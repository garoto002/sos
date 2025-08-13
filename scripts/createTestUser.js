// Script para criar um usuário de teste com empresa
import connectToDB from '../utils/DAO.js';
import User from '../models/userModel.js';
import Empresa from '../models/empresaModel.js';
import bcrypt from 'bcrypt';

async function createTestUser() {
  try {
    await connectToDB();
    console.log('Conectado ao banco de dados');

    // Primeiro, verificar se já existe uma empresa de teste
    let empresa = await Empresa.findOne({ nome: 'Empresa Teste' });
    
    if (!empresa) {
      // Criar empresa de teste
      empresa = await Empresa.create({
        nome: 'Empresa Teste',
        razaoSocial: 'Empresa Teste Ltda',
        email: 'contato@empresateste.com',
        telefone: '+258 84 123 4567',
        endereco: 'Maputo, Moçambique',
        cnpj: '123456789',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Empresa criada:', empresa.nome);
    } else {
      console.log('Empresa já existe:', empresa.nome);
    }

    // Verificar se já existe o usuário de teste
    let user = await User.findOne({ email: 'admin@teste.com' });
    
    if (!user) {
      // Hash da senha
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Criar usuário de teste
      user = await User.create({
        firstName: 'Admin',
        lastName: 'Teste',
        email: 'admin@teste.com',
        password: hashedPassword,
        role: 'admin',
        empresaId: empresa._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Usuário criado:', user.email);
    } else {
      console.log('Usuário já existe:', user.email);
    }

    console.log('Setup completo!');
    console.log('Login: admin@teste.com');
    console.log('Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
    process.exit(1);
  }
}

createTestUser();
