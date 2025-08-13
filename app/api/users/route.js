import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(request){
    
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);
        let users;
        if (session?.user?.role === "superadmin") {
            users = await User.find();
        } else {
            users = await User.find({ empresaId: session?.user?.empresaId });
        }
        // Importa o modelo Empresa dinamicamente para evitar problemas de dependência circular
        const Empresa = (await import("@/models/empresaModel")).default;
        const empresas = await Empresa.find();
        return NextResponse.json({ users, empresas });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Ocorreu um erro buscando os usuários e empresas" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }
    const { role, empresaId: sessionEmpresaId } = session.user;
    const body = await request.json();
    // Superadmin pode criar qualquer usuário
    if (role === "superadmin") {
        // segue para criação
    } else if (role === "admin") {
        // Admin só pode criar usuários para sua própria empresa
        if (body.empresaId !== sessionEmpresaId) {
            return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
        }
    } else {
        // Usuário comum não pode criar usuários
        return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }
    try{
        await connectToDB();
        let password = body.password;
        if (password) {
            // Garante que a senha seja sempre salva como hash
            password = await bcrypt.hash(password, 10);
        }
        const user = await User.create({
            ...body,
            password,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return NextResponse.json(user, {status: 201});
    }catch (err) {
        console.log(err);
        return NextResponse.json({
            message: "Ocorreu um erro ao buscar/criar o usuário",
            status: 500,
        });
    } 
}