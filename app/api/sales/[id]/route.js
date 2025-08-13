import User from "@/models/userModel";
import Sale from "@/models/saleModel";
import connectToDB from "@/utils/DAO";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
   try{
    await connectToDB();
    
    // Verificar se o ID é válido (formato ObjectId)
    if (!params.id || params.id === 'pdf' || params.id.length !== 24) {
      return NextResponse.json(
        { message: "ID de venda inválido" },
        { status: 400 }
      );
    }
    
    const sale = await Sale.findById(params.id).populate({
            path: "user",
            model:"User",
    });
    return NextResponse.json({sale});
   } catch(err){
    console.log(err);
    return NextResponse.json( 

    
        {message: "Ocorreu um erro buscando o produto com id" + params.id},
        {status: 500}
    
    ); 
   }
}

export async function PATCH (request, {params}) {
    try{
        await connectToDB();
        
        const body = await request.json();
        const sale = await Sale.findByIdAndUpdate(params.id, 
            {...body,
            updatedAt: Date.now(),
         });
    return NextResponse.json({sale});
   } catch(err){
    console.log(err);
    return NextResponse.json(

    
        {message: "Ocorreu um erro alterando a venda com id" + params.id},
        {status: 500} 
    
    ); 
   }
}

export  async function DELETE (request, {params}) {
    try{
        await connectToDB();
        
        const sale = await Sale.findByIdAndDelete(params.id);
        return new NextResponse(null, {status: 204} );
       } catch(err){
        console.log(err);
        return NextResponse.json(
    
        
            {message: "Ocorreu um erro deletando a venda com id" + params.id},
            {status: 500}
        
        ); 
       }
}