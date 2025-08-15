import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";

export async function GET(request) {
    try {
        await connectToDB();
        const users = await User.find();
        return NextResponse.json({ users });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Ocorreu um erro buscando os usuários" }, { status: 500 });
    }
}

export async function POST(request) {
    const body = await request.json();
    const { nome, contacto } = body;
    if (!nome || !contacto) {
        return NextResponse.json({ error: "Nome e contacto obrigatórios" }, { status: 400 });
    }
    try {
        await connectToDB();
        let user = await User.findOne({ nome, contacto });
        if (user) {
            // Login: usuário já existe
            return NextResponse.json({ user });
        } else {
            // Cadastro: cria novo usuário
            user = await User.create({ nome, contacto });
            return NextResponse.json({ user });
        }
    } catch (err) {
        console.log(err);
            return NextResponse.json({ error: "Erro ao cadastrar/logar usuário" }, { status: 500 });
        }
    }