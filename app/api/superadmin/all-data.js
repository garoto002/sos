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
    // Lista de empresas
    const empresas = await Empresa.find();
    // Lista de usuários
    const users = await User.find();
    // Lista de vendas
    const vendas = await Sale.find();
    return NextResponse.json({
        empresas,
        users,
        vendas
    });
}
