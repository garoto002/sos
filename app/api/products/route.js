import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectToDB from "@/utils/DAO";
import Product from "@/models/productModel";
import { getServerSession } from "next-auth";
import formidable from "formidable";
import fs from "fs";
import path from "path";


export async function GET(request){
    
    try{
        await connectToDB();
        const session = await getServerSession();
        const user = await User.findOne({ email: session?.user?.email });
        if (!user) {
          return NextResponse.json({ message: "Usuário não encontrado" }, { status: 401 });
        }
        // Filtra produtos pela empresa do usuário logado
        const products = await Product.find({ empresaId: user.empresaId });
        return NextResponse.json({products});
} 
    catch (err) {
        console.log(err);
        return NextResponse.json(
             {message: "Ocorreu um erro ao buscar os Produtos"},
             {status: 500}
             );
    } 
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    await connectToDB();
    const session = await getServerSession();
    const user = await User.findOne({ email: session.user?.email });
    const formData = await request.formData();
    const uploadDir = path.join(process.cwd(), "public/images/products");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    let imageUrl = "";
    let imageFile = formData.get("image");
    if (imageFile && typeof imageFile === "object" && imageFile.arrayBuffer) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name ? path.extname(imageFile.name) : ".jpg";
      const fileName = `${Date.now()}_${Math.floor(Math.random()*10000)}${ext}`;
      const destPath = path.join(uploadDir, fileName);
      fs.writeFileSync(destPath, buffer);
      imageUrl = `/images/products/${fileName}`;
    }

    // Extrai os campos do formData
    const fields = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "image") fields[key] = value;
    }

    const productData = {
      ...fields,
      imageUrl,
      user: user._id,
      empresaId: user.empresaId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    ["cost", "price", "ivaRate", "quantity", "quantityInStock", "stockMinimum"]
      .forEach((key) => {
        if (productData[key] !== undefined) productData[key] = Number(productData[key]);
      });
    const product = await Product.create(productData);
    if (product.quantityInStock < product.stockMinimum) {
      console.log(`Alerta: Estoque baixo para o produto ${product.name}.`);
    }
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Ocorreu um erro ao Adicionar o Produto" },
      { status: 500 }
    );
  }
}