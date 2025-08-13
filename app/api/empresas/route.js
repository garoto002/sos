import connectToDB from "@/utils/DAO";
import Empresa from "@/models/empresaModel";

export async function POST(req) {
  await connectToDB();
  try {
    const body = await req.json();
    const { nome, razaoSocial, cnpj, endereco, telefone, email } = body;
    if (!nome) {
      return Response.json({ message: "Nome é obrigatório." }, { status: 400 });
    }
    const empresa = new Empresa({
      nome,
      razaoSocial,
      cnpj,
      endereco,
      telefone,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await empresa.save();
    return Response.json(empresa, { status: 201 });
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}

export async function GET() {
  await connectToDB();
  const empresas = await Empresa.find();
  return Response.json({ empresas }, { status: 200 });
}
