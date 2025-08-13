import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Product from "@/models/productModel";
import Purchase from "@/models/purchaseModel";
import connectToDB from "@/utils/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import StockMovement from "@/models/stockMovementModel";

export async function GET(request) {
  try {
    await connectToDB();
    const session = await getServerSession();
    const user = await User.findOne({ email: session?.user?.email });
    
    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 401 });
    }

    // Filtra compras pela empresa do usuário logado (mesmo padrão da API de products)
    const purchases = await Purchase.find({ empresaId: user.empresaId })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("empresaId")
      .populate("supplierName");
    
    console.log("Purchases found:", purchases.length);
    console.log("User role:", user.role, "EmpresaId:", user.empresaId);

    return NextResponse.json({ purchases });
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    return NextResponse.json(
      { message: "Ocorreu um erro buscando as compras" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const session = await getServerSession();
    const user = await User.findOne({ email: session.user?.email });
    const body = await request.json();
    console.log("Purchase data received:", body);
    
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    console.log("=== DEBUG USER DATA ===");
    console.log("User found:", user.email);
    console.log("User empresaId:", user.empresaId);
    console.log("User empresaId exists:", !!user.empresaId);
    console.log("Type of empresaId:", typeof user.empresaId);
    console.log("======================");

    const purchaseItems = body.products;

    // Estrutura dos dados da compra seguindo o padrão da API de products
    const purchaseData = {
      supplierName: body.supplierName,
      description: body.description,
      subtotal: body.subtotal,
      debt: body.debt,
      amountPaid: body.amountPaid,
      discount: body.discount,
      totalAfterDiscount: body.totalAfterDiscount,
      totalBeforeDiscount: body.totalBeforeDiscount,
      totalIva: body.totalIva,
      products: purchaseItems.map((item) => ({
        product: item.product,
        cost: parseFloat(item.cost),
        quantity: parseFloat(item.quantity),
        totalCost: parseFloat(item.totalCost),
        ivaRate: parseFloat(item.ivaRate),
      })),
      user: user._id,
      empresaId: user.empresaId, // Mesmo padrão da API de products
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("Creating purchase with data:", purchaseData);
    console.log("=== PURCHASE DATA DEBUG ===");
    console.log("User ID:", purchaseData.user);
    console.log("Empresa ID:", purchaseData.empresa);
    console.log("===========================");
    
    const purchase = await Purchase.create(purchaseData);
    console.log("Produtos comprados:", purchaseData.products);

    for (const productBought of purchaseData.products) {
      const productName = productBought.product;
      const product = await Product.findOne({ name: productName });
      if (product) {
        product.quantityInStock += productBought.quantity;
        await product.save();
        // Criar StockMovement associado à compra
        await StockMovement.create({
          product: product._id,
          purchase: purchase._id,
          type: 'purchase',
          quantity: productBought.quantity,
        });
      }
    }

    console.log("Compra criada:", purchase);
    return NextResponse.json(purchase, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Ocorreu um erro adicionando a compra" },
      { status: 500 }
    );
  }
}