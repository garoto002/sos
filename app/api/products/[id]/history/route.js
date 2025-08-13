// pages/api/product/[id]/history.js
import { NextResponse } from "next/server";
import connectToDB from "@/utils/DAO";
import Product from "@/models/productModel";

export async function GET(request) {
  if (request.method === "GET") {
    try {
      await connectToDB();
      const { id } = request.params;
      const product = await Product.findById(id);

      if (!product) {
        return NextResponse.json(
          { message: "Produto não encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({ history: product.history });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { message: "Ocorreu um erro ao buscar o histórico" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.next();
  }
}
