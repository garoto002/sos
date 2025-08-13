// Script para corrigir usuário existente e adicionar empresa
const connectToDB = require('../utils/DAO.js').default;
const User = require('../models/userModel.js').default;
const Empresa = require('../models/empresaModel.js').default;

async function fixUserAndEmpresa() {
  try {
    await connectToDB();
    console.log('🔌 Conectado ao banco de dados');

    // Buscar usuários sem empresa
    const usersWithoutEmpresa = await User.find({ empresaId: { $exists: false } });
    console.log(`👥 Encontrados ${usersWithoutEmpresa.length} usuários sem empresa`);

    if (usersWithoutEmpresa.length > 0) {
      // Criar uma empresa padrão se não existir
      let empresaDefault = await Empresa.findOne({ nome: 'Empresa Padrão' });
      
      if (!empresaDefault) {
        empresaDefault = await Empresa.create({
          nome: 'Empresa Padrão',
          razaoSocial: 'Empresa Padrão Ltda',
          email: 'contato@empresapadrao.com',
          telefone: '+258 84 000 0000',
          endereco: 'Maputo, Moçambique',
          cnpj: '000000000',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('🏢 Empresa padrão criada:', empresaDefault.nome);
      } else {
        console.log('🏢 Empresa padrão já existe:', empresaDefault.nome);
      }

      // Atualizar todos os usuários sem empresa
      for (const user of usersWithoutEmpresa) {
        await User.findByIdAndUpdate(user._id, { 
          empresaId: empresaDefault._id,
          updatedAt: new Date()
        });
        console.log(`✅ Usuário ${user.email} associado à empresa padrão`);
      }
    }

    // Verificar se todos os usuários agora têm empresa
    const allUsers = await User.find().populate('empresaId');
    console.log('\n📋 Status de todos os usuários:');
    for (const user of allUsers) {
      console.log(`- ${user.email}: ${user.empresaId ? `✅ ${user.empresaId.nome}` : '❌ Sem empresa'}`);
    }

    console.log('\n✨ Correção concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao corrigir usuários:', error);
    process.exit(1);
  }
}

fixUserAndEmpresa();
