import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Empresa from "@/models/empresaModel";
import connectToDB from "@/utils/DAO";

export async function GET(request) {
  return await fixUsers();
}

export async function POST(request) {
  return await fixUsers();
}

async function fixUsers() {
  try {
    await connectToDB();
    console.log('🔌 Conectado ao banco de dados');

    // Buscar usuários sem empresa
    const usersWithoutEmpresa = await User.find({ 
      $or: [
        { empresaId: { $exists: false } },
        { empresaId: null }
      ]
    });
    
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
      }

      // Atualizar todos os usuários sem empresa
      const updateResult = await User.updateMany(
        { 
          $or: [
            { empresaId: { $exists: false } },
            { empresaId: null }
          ]
        },
        { 
          empresaId: empresaDefault._id,
          updatedAt: new Date()
        }
      );

      console.log(`✅ ${updateResult.modifiedCount} usuários atualizados`);
    }

    // Verificar status final
    const allUsers = await User.find().populate('empresaId');
    const usersStatus = allUsers.map(user => ({
      email: user.email,
      hasEmpresa: !!user.empresaId,
      empresa: user.empresaId ? user.empresaId.nome : 'Sem empresa'
    }));

    return NextResponse.json({
      message: 'Correção concluída com sucesso!',
      usersFound: usersWithoutEmpresa.length,
      usersFixed: usersWithoutEmpresa.length,
      allUsers: usersStatus
    });

  } catch (error) {
    console.error('❌ Erro ao corrigir usuários:', error);
    return NextResponse.json(
      { message: "Erro ao corrigir usuários", error: error.message },
      { status: 500 }
    );
  }
}
