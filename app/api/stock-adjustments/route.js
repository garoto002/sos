// pages/api/stock-adjustments/index.js
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Product from "@/models/productModel";
import StockAdjustment from "@/models/stockAdjustmentModel";
import connectToDB from "@/utils/DAO";
import { getServerSession } from "next-auth";
import StockMovement from "@/models/stockMovementModel";

export async function GET(request) {
  try {
    await connectToDB();
    const session = await getServerSession();
    const user = await User.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 401 });
    }
    // Filtra ajustes de estoque pela empresa do usuário logado
    const stockAdjustments = await StockAdjustment.find({ empresaId: user.empresaId })
      .sort({ createdAt: -1 })
      .populate("user");
    return NextResponse.json({ stockAdjustments });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Ocorreu um erro buscando os ajustes de estoque" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const body = await request.json();
    const session = await getServerSession();
    const user = await User.findOne({ email: session.user?.email });

    if (!Array.isArray(body.adjustmentItems) || body.adjustmentItems.length === 0) {
      throw new Error("O campo adjustmentItems deve ser um array não vazio.");
    }

    const adjustmentItems = body.adjustmentItems.map(item => ({
      product: item.product,
      quantity: parseInt(item.quantity),
      reason: item.reason,
    }));

    const stockAdjustmentData = {
      adjustmentItems,
      user: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
console.log(stockAdjustmentData);
    // Atualizar o estoque após o ajuste
    // Iterar sobre os itens de ajuste e realizar as operações necessárias
for (const adjustmentItem of stockAdjustmentData.adjustmentItems) {
  const productName = adjustmentItem.product;
  const product = await Product.findOne({ name: productName });

  if (product) {
    if (body.adjustmentType === 'increase') {
      product.quantityInStock += adjustmentItem.quantity;
    } else if (body.adjustmentType === 'decrease') {
      product.quantityInStock -= adjustmentItem.quantity;
    }

    await product.save();
  }
}

// Criar StockAdjustment após as operações nos produtos
const stockAdjustment = await StockAdjustment.create(stockAdjustmentData);

// Iterar novamente para criar StockMovement associado ao ajuste de estoque
for (const adjustmentItem of stockAdjustmentData.adjustmentItems) {
  const productName = adjustmentItem.product;
  const product = await Product.findOne({ name: productName });

  if (product) {
    // Criar StockMovement associado ao ajuste de estoque
    await StockMovement.create({
      product: product._id,
      stockAdjustment: stockAdjustment._id,
      type: 'adjustment',
      quantity: adjustmentItem.quantity,
    });
  }
}

// Atualizar a propriedade stockAdjustment em cada StockMovement criado
for (const adjustmentItem of stockAdjustmentData.adjustmentItems) {
  const productName = adjustmentItem.product;
  const product = await Product.findOne({ name: productName });

  if (product) {
    await StockMovement.findOneAndUpdate(
      { product: product._id, stockAdjustment: null },
      { stockAdjustment: stockAdjustment._id },
      { new: true }
    );
  }
}


    return NextResponse.json(stockAdjustment, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: `Ocorreu um erro adicionando o ajuste de estoque: ${err.message}` },
      { status: 500 }
    );
  }
}
