import Custom from "@/models/customModel";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
   try{
    await connectToDB();
    
    const custom = await Custom.findById(params.id).populate({
        path: "user",
        model: "User",
    });
    return NextResponse.json({custom});
   } catch(err){
    console.log(err);
    return NextResponse.json(

    
        {message: "Ocorreu um erro buscando o Cliente com id" + params.id,
    },
        {status: 500}
    
    ); 
   }
}

export async function PATCH (request, {params}) {
    try{
        await connectToDB();
        
        const body = await request.json();
        const custom = await Custom.findByIdAndUpdate(params.id, 
            {...body,
            updatedAt: Date.now(),
         });
    return NextResponse.json({custom});
   } catch(err){
    console.log(err);
    return NextResponse.json(

    
        {message: "Ocorreu um erro alterando o Cliente com id" + params.id,
    },
        {status: 500} 
    
    ); 
   }
}

export  async function DELETE (request, {params}) {
    try{
        await connectToDB();
        
        const custom = await Custom.findByIdAndDelete(params.id);
        return new NextResponse(null, {status: 204} );
       } catch(err){
        console.log(err);
        return NextResponse.json(
    
        
            {message: "Ocorreu um erro deletando o Cliente com id" + params.id,
        },
            {status: 500}
        
        ); 
       }
}