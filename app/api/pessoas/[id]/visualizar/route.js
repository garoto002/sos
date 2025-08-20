import connectToDB from '../../../../../utils/DAO';
import Pessoa from '../../../../../models/pessoaModel';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // Incrementa o contador de visualizações
    const pessoa = await Pessoa.findByIdAndUpdate(
      id,
      { $inc: { visualizacoes: 1 } },
      { new: true }
    );

    if (!pessoa) {
      return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      visualizacoes: pessoa.visualizacoes 
    });
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
