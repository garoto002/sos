import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import Customer from "@/models/customerModel";
import { getServerSession } from "next-auth";


export async function GET(request){
    try {
        await connectToDB();
        const session = await getServerSession();
        
        // Log da sessão para debug
        console.log('Session:', session?.user?.email);
        
        if (!session?.user?.email) {
            console.error('Sem sessão de usuário válida');
            return NextResponse.json({ 
                message: "Autenticação necessária",
                debug: { hasSession: !!session, hasUser: !!session?.user }
            }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            console.error('Usuário não encontrado:', session.user.email);
            return NextResponse.json({ 
                message: "Usuário não encontrado",
                debug: { email: session.user.email }
            }, { status: 401 });
        }

        console.log('Usuário encontrado:', user.email, 'empresaId:', user.empresaId);

        // Filtra clientes pela empresa do usuário logado
        const customers = await Customer.find({ empresaId: user.empresaId });
        console.log(`${customers.length} clientes encontrados para empresa ${user.empresaId}`);

        return NextResponse.json({ 
            customers,
            debug: { 
                count: customers.length,
                empresaId: user.empresaId 
            }
        });
    } catch (err) {
        console.error('Erro detalhado:', err);
        return NextResponse.json({ 
            message: "Ocorreu um erro ao buscar os Clientes",
            error: err.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try{
        await connectToDB();
    const body = await request.json();

    const session = await getServerSession();//pegar o user logado  
    const user = await User.findOne({email: session.user?.email}); //procurar na base de dados o email igual ao da sessao
    const customer = await Customer.create({
        ...body,
        user: user._id,
        empresaId: user.empresaId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
 return NextResponse.json(customer, {status: 201});
    }catch (err) {
        console.log(err);
        return NextResponse.json({
            message: "Ocorreu um erro ao Adicionar  o cliente",
            status: 500,
        });
    } 
}
