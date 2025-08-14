import { NextResponse } from "next/server";
import Empresa from "@/models/empresaModel";
import User from "@/models/userModel";
import Sale from "@/models/saleModel";
import connectToDB from "@/utils/DAO";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    await connectToDB();
    const session = await getServerSession();
    const user = await User.findOne({ email: session?.user?.email });

    // Verificar se o usuário é superadmin
    if (!user?.isSuperAdmin) {
      return NextResponse.json(
        { message: "Acesso não autorizado" },
        { status: 401 }
      );
    }

    // Buscar estatísticas
    const [
      totalEmpresas,
      empresasAtivas,
      totalUsuarios,
      vendasUltimoMes
    ] = await Promise.all([
      Empresa.countDocuments({}),
      Empresa.countDocuments({ ativo: true }),
      User.countDocuments({}),
      Sale.countDocuments({
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
      })
    ]);

    // Calcular crescimento mensal (comparando com mês anterior)
    const vendasMesAnterior = await Sale.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        $lt: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    });

    const crescimentoMensal = vendasMesAnterior > 0
      ? ((vendasUltimoMes - vendasMesAnterior) / vendasMesAnterior) * 100
      : 0;

    return NextResponse.json({
      totalEmpresas,
      empresasAtivas,
      totalUsuarios,
      crescimentoMensal: Math.round(crescimentoMensal * 10) / 10,
      vendasUltimoMes
    });

  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { message: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
