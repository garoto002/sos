import User from "@/models/userModel";
import Purchase from "@/models/purchaseModel";
import connectToDB from "@/utils/DAO";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
   try{
    await connectToDB();
    
    const purchase = await Purchase.findById(params.id).populate({
            path: "user",
            model:"User",
    });
    return NextResponse.json({sale});
   } catch(err){
    console.log(err);
    return NextResponse.json( 

    
        {message: "Ocorreu um erro buscando a Compra com id" + params.id},
        {status: 500}
    
    ); 
   }
}

export async function PATCH (request, {params}) {
    try{
        await connectToDB();
        
        const body = await request.json();
        const purchase = await Purchase.findByIdAndUpdate(params.id, 
            {...body,
            updatedAt: Date.now(),
         });
    return NextResponse.json({sale});
   } catch(err){
    console.log(err);
    return NextResponse.json(

    
        {message: "Ocorreu um erro alterando a compra com id" + params.id},
        {status: 500} 
    
    ); 
   }
}

export  async function DELETE (request, {params}) {
    try{
        await connectToDB();
        
        const purchase = await Purchase.findByIdAndDelete(params.id);
        return new NextResponse(null, {status: 204} );
       } catch(err){
        console.log(err);
        return NextResponse.json(
    
        
            {message: "Ocorreu um erro deletando a compra com id" + params.id},
            {status: 500}
        
        ); 
       }
}