import connectToDB from '@/utils/DAO';
import Pessoa from '../../../../../models/pessoaModel';

export async function PUT(req, { params }) {
  await connectToDB();
  const { id } = params;
  const { status } = await req.json();
  if (!['perdido', 'achado'].includes(status)) {
    return new Response(JSON.stringify({ error: 'Status inválido.' }), { status: 400 });
  }
  try {
    const pessoa = await Pessoa.findByIdAndUpdate(id, { status }, { new: true });
    if (!pessoa) {
      return new Response(JSON.stringify({ error: 'Pessoa não encontrada.' }), { status: 404 });
    }
    return new Response(JSON.stringify({ pessoa }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar status.' }), { status: 500 });
  }
}
