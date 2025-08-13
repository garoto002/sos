import Product from "@/models/productModel";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
   try{
    await connectToDB();
    
    const product = await Product.findById(params.id).populate({
            path: "user",
            model:"User",
    });
    return NextResponse.json({product});
   } catch(err){
    console.log(err);
    return NextResponse.json( 

    
        {
            message: "Ocorreu um erro buscando o produto com id" + params.id, 
        },
        {status: 500}
    
    ); 
   }
}

export async function PATCH (request, {params}) {
    try{
        await connectToDB();
        
        const body = await request.json();
        const product = await Product.findByIdAndUpdate(params.id, 
            {...body,
            updatedAt: Date.now(),
         });
    return NextResponse.json({product});
   } catch(err){
    console.log(err);
    return NextResponse.json(

    
        {message: 
            "Ocorreu um erro alterando o produto com id" + params.id,
        },
        {status: 500} 
    
    ); 
   }
}

export  async function DELETE (request, {params}) {
    try{
        await connectToDB();
        
        const product = await Product.findByIdAndDelete(params.id);
        return new NextResponse(null, {status: 204} );
       } catch(err){
        console.log(err);
        return NextResponse.json(
    
        
            {
                message: "Ocorreu um erro deletando o Produto com id " + params.id,
            },
            {status: 500}
        
        ); 
       }
}