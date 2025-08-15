import { NextResponse } from "next/server";
import Pessoa from "@/models/pessoaModel";
import connectToDB from "@/utils/DAO";

export async function POST(request, { params }) {
  const { id } = params;
  const { texto, autor } = await request.json();
  if (!texto) {
    return NextResponse.json({ error: "Comentário obrigatório" }, { status: 400 });
  }
  try {
    await connectToDB();
    const pessoa = await Pessoa.findById(id);
    if (!pessoa) return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 });
    pessoa.comentarios.push({ texto, autor });
    await pessoa.save();
    return NextResponse.json({ comentarios: pessoa.comentarios });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao adicionar comentário" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  try {
    await connectToDB();
    const pessoa = await Pessoa.findById(id);
    if (!pessoa) return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 });
    return NextResponse.json({ comentarios: pessoa.comentarios });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao buscar comentários" }, { status: 500 });
  }
}
