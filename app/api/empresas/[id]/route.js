import connectToDB from "@/utils/DAO";
import Empresa from "@/models/empresaModel";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  await connectToDB();
  
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      nome, 
      nuit, 
      alvara, 
      endereco, 
      telefone1, 
      telefone2, 
      email,
      ativo 
    } = body;

    // Validações
    if (!nome) {
      return NextResponse.json({ message: "Nome é obrigatório." }, { status: 400 });
    }
    if (!nuit || !/^[0-9]{9}$/.test(nuit)) {
      return NextResponse.json({ message: "NUIT inválido. Deve ter 9 dígitos." }, { status: 400 });
    }
    if (!endereco?.provincia || !endereco?.distrito || !endereco?.bairro) {
      return NextResponse.json({ message: "Província, distrito e bairro são obrigatórios." }, { status: 400 });
    }
    if (!telefone1 || !/^(?:\+258|8[234567]\d{7})$/.test(telefone1)) {
      return NextResponse.json({ message: "Telefone principal inválido." }, { status: 400 });
    }
    if (telefone2 && !/^(?:\+258|8[234567]\d{7})$/.test(telefone2)) {
      return NextResponse.json({ message: "Telefone alternativo inválido." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Email inválido." }, { status: 400 });
    }

    const empresa = await Empresa.findByIdAndUpdate(
      id,
      {
        nome,
        nuit,
        alvara,
        endereco,
        telefone1,
        telefone2,
        email,
        ativo,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!empresa) {
      return NextResponse.json({ message: "Empresa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Erro ao atualizar empresa" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  await connectToDB();
  
  try {
    const { id } = params;
    const empresa = await Empresa.findById(id);

    if (!empresa) {
      return NextResponse.json({ message: "Empresa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Erro ao buscar empresa" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectToDB();
  
  try {
    const { id } = params;
    const empresa = await Empresa.findByIdAndUpdate(
      id,
      { ativo: false, updatedAt: new Date() },
      { new: true }
    );

    if (!empresa) {
      return NextResponse.json({ message: "Empresa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Empresa desativada com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Erro ao desativar empresa" },
      { status: 500 }
    );
  }
}
