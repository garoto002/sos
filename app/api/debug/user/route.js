import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    await connectToDB();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Retorna dados do usuário para debug
    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        empresaId: user.empresaId,
        hasEmpresaId: !!user.empresaId,
        empresaIdType: typeof user.empresaId
      }
    });
  } catch (err) {
    console.error("Erro ao buscar dados do usuário:", err);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
