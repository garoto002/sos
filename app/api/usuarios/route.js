import connectToDB from "@/utils/DAO";
import User from "@/models/userModel";

export async function POST(req) {
  await connectToDB();
  try {
    const body = await req.json();
    const { firstName, lastName, email, role, empresaId, password } = body;
    if (!firstName || !lastName || !email || !role || !empresaId) {
      return Response.json({ message: "Dados obrigatórios faltando." }, { status: 400 });
    }
    // Gera senha aleatória se não vier
    let generatedPassword = undefined;
    const userPassword = password || Math.random().toString(36).slice(-8);
    if (!password) generatedPassword = userPassword;
    const user = new User({
      firstName,
      lastName,
      email,
      role,
      empresaId,
      password: userPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "ativo"
    });
    await user.save();
    // Não retorna senha
    const { password: _, ...userData } = user.toObject();
    return Response.json({ ...userData, generatedPassword }, { status: 201 });
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectToDB();
  // Busca sessão do usuário logado
  let sessionUser = null;
  try {
    const { getServerSession } = await import("next-auth");
    sessionUser = await getServerSession();
  } catch {}
  const url = new URL(req.url);
  const empresaIdParam = url.searchParams.get("empresaId");
  let filter = {};
  // Se for superadmin, pode ver todos; senão, filtra pela empresa do usuário logado
  if (sessionUser?.user?.role === "superadmin") {
    if (empresaIdParam) filter.empresaId = empresaIdParam;
  } else if (sessionUser?.user?.empresaId) {
    filter.empresaId = sessionUser.user.empresaId;
  } else if (empresaIdParam) {
    filter.empresaId = empresaIdParam;
  }
  const users = await User.find(filter).select("-password").populate({ path: 'empresaId', select: 'nome' });
  // Mapeia para retornar nome da empresa
  const usersWithEmpresa = users.map(u => ({
    ...u.toObject(),
    empresa: u.empresaId?.nome || 'N/A',
    empresaId: u.empresaId?._id || u.empresaId || 'N/A',
  }));
  return Response.json(usersWithEmpresa, { status: 200 });
}
