import Supplier from "@/models/supplierModel";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
   try{
    await connectToDB();
    
    const supplier = await Supplier.findById(params.id).populate({
            path: "user",
            model:"User",
    });
    return NextResponse.json({supplier});
   } catch(err){
    console.log(err);
    return NextResponse.json( 

    
        {message: "Ocorreu um erro buscando o fornecedor com id" + params.id},
        {status: 500}
    
    ); 
   }
}

export async function PATCH (request, {params}) {
    try{
        await connectToDB();
        
        const body = await request.json();
        const supplier = await Supplier.findByIdAndUpdate(params.id, 
            {...body,
            updatedAt: Date.now(),
         });
    return NextResponse.json({supplier});
   } catch(err){
    console.log(err);
    return NextResponse.json(

    
        {message: "Ocorreu um erro alterando o Fornecedor com id" + params.id},
        {status: 500} 
    
    ); 
   }
}

export  async function DELETE (request, {params}) {
    try{
        await connectToDB();
        
        const supplier = await Supplier.findByIdAndDelete(params.id);
        return new NextResponse(null, {status: 204} );
       } catch(err){
        console.log(err);
        return NextResponse.json(
    
        
            {message: "Ocorreu um erro deletando o Fornecedor com id" + params.id,
        },
            {status: 500}
        
        ); 
       }
}