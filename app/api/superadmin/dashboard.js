import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import Empresa from "@/models/empresaModel";
import Sale from "@/models/saleModel";
import connectToDB from "@/utils/DAO";

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "superadmin") {
        return NextResponse.json({ message: "Acesso restrito ao superadmin" }, { status: 403 });
    }
    await connectToDB();
    // Contagem de usuários por tipo
    const users = await User.find();
    const usersByRole = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
    }, {});
    // Contagem de vendas
    const vendasCount = await Sale.countDocuments();
    // Valor total de vendas
    const vendas = await Sale.find();
    const totalVendas = vendas.reduce((acc, v) => acc + (v.total || 0), 0);
    return NextResponse.json({
        usersByRole,
        vendasCount,
        totalVendas
    });
}
