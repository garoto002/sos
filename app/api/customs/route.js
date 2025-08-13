import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import Custom from "@/models/customModel";
import { getServerSession } from "next-auth";


export async function GET(request){
    
    try{
        await connectToDB();
        const session = await getServerSession();
        const user = await User.findOne({ email: session?.user?.email });
        if (!user) {
          return NextResponse.json({ message: "Usuário não encontrado" }, { status: 401 });
        }
        // Filtra clientes pela empresa do usuário logado
        const customers = await Custom.find({ empresaId: user.empresaId });
        return NextResponse.json({customers});
    } 
    catch (err) {
        console.log(err);
        return NextResponse.json( 
            {message: "Ocorreu um erro ao buscar os Clientes"},
             {status: 500}
             );
    } 
}

export async function POST(request) {
    try{
        await connectToDB();
    const body = await request.json();

    const session = await getServerSession();//pegar o user logado  
    const user = await User.findOne({email: session.user?.email}); //procurar na base de dados o email igual ao da sessao
    const custom = await Custom.create({
        ...body,
        user: user._id,
        empresaId: user.empresaId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
 return NextResponse.json(custom, {status: 201});
    }catch (err) {
        console.log(err);
        return NextResponse.json({
            message: "Ocorreu um erro ao Adicionar  o cliente",
            status: 500,
        });
    } 
}