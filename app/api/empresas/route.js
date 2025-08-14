import connectToDB from "@/utils/DAO";
import Empresa from "@/models/empresaModel";

export async function POST(req) {
  await connectToDB();
  try {
    const body = await req.json();
    const { 
      nome, 
      nuit, 
      alvara, 
      endereco, 
      telefone1, 
      telefone2, 
      email 
    } = body;

    // Validações básicas
    if (!nome) {
      return Response.json({ message: "Nome é obrigatório." }, { status: 400 });
    }
    if (!nuit || !/^[0-9]{9}$/.test(nuit)) {
      return Response.json({ message: "NUIT inválido. Deve ter 9 dígitos." }, { status: 400 });
    }
    if (!endereco?.provincia || !endereco?.distrito || !endereco?.bairro) {
      return Response.json({ message: "Província, distrito e bairro são obrigatórios." }, { status: 400 });
    }
    if (!telefone1 || !/^(?:\+258|8[234567]\d{7})$/.test(telefone1)) {
      return Response.json({ message: "Telefone principal inválido." }, { status: 400 });
    }
    if (telefone2 && !/^(?:\+258|8[234567]\d{7})$/.test(telefone2)) {
      return Response.json({ message: "Telefone alternativo inválido." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ message: "Email inválido." }, { status: 400 });
    }

    const empresa = new Empresa({
      nome,
      nuit,
      alvara,
      endereco,
      telefone1,
      telefone2,
      email,
      ativo: true,
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
