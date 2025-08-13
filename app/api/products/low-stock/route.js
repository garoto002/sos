import { NextResponse } from "next/server";
import connectToDB from "@/utils/DAO";
import Product from "@/models/productModel";

export async function GET(request) {
    try {
        await connectToDB();

        const lowStockProducts = await Product.find({ quantityInStock: { $lt: '$stockMinimum' } });

        return NextResponse.json({ lowStockProducts });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Ocorreu um erro buscando produtos com estoque baixo" },
            { status: 500 }
        );
    }
}