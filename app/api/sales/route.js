import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Product from "@/models/productModel";
import Sale from "@/models/saleModel";
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
    // Filtra vendas pela empresa do usuário logado
    const sales = await Sale.find({ empresaId: user.empresaId });
    return NextResponse.json({ sales });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Ocorreu um erro ao buscar as vendas" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const body = await request.json();
    const session = await getServerSession(); 
    const user = await User.findOne({ email: session.user?.email }); 

    // Gerar número da próxima fatura
    const lastSale = await Sale.findOne({ empresaId: user.empresaId }).sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastSale ? lastSale.invoiceNumber + 1 : 1;

    const saleItems = body.products || body.items || [];

    // Validar se temos itens
    if (!Array.isArray(saleItems) || saleItems.length === 0) {
      return NextResponse.json({ message: "É necessário adicionar pelo menos um produto" }, { status: 400 });
    }

    // Verificar o estoque antes de criar a venda
    for (const item of saleItems) {
      const product = await Product.findOne({ name: item.product });
      if (!product) {
        throw new Error(`Produto '${item.product}' não encontrado.`);
      }
      if (item.quantity > product.quantityInStock) {
        throw new Error(`Não há estoque suficiente para o produto: ${product.name}`);
      }
    }

    // Calcular totais automaticamente
    const subtotal = saleItems.reduce((sum, item) => sum + (item.totalPrice || (item.price * item.quantity)), 0);
    const totalIva = saleItems.reduce((sum, item) => sum + ((item.totalPrice || (item.price * item.quantity)) * (item.ivaRate || 0)), 0);
    const discount = parseFloat(body.discount) || 0;
    const totalBeforeDiscount = subtotal + totalIva;
    const totalAfterDiscount = totalBeforeDiscount - discount;
    const receivedAmount = parseFloat(body.receivedAmount) || 0;
    const change = Math.max(0, receivedAmount - totalAfterDiscount);
    const debtOrChange = receivedAmount >= totalAfterDiscount ? change : totalAfterDiscount - receivedAmount;

    const saleData = {
      invoiceNumber: nextInvoiceNumber,  // Adicionando o número da fatura
      customName: body.customName,
      description: body.description || '',
      discount: discount,
      totalIva: totalIva,
      debtOrChange: debtOrChange,
      receivedAmount: receivedAmount,
      subtotal: subtotal, 
      totalBeforeDiscount: totalBeforeDiscount, 
      totalAfterDiscount: totalAfterDiscount, 
      change: change, 
      products: saleItems,
      user: user._id,
      empresaId: user.empresaId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const sale = await Sale.create(saleData);

    // Atualizar o estoque e criar movimento de estoque
    for (const item of saleItems) {
      const product = await Product.findOne({ name: item.product });
      if (!product) {
        throw new Error(`Produto '${item.product}' não encontrado.`);
      }
      
      // Atualizar estoque sem triggering validação completa
      await Product.findByIdAndUpdate(
        product._id, 
        { 
          $inc: { quantityInStock: -item.quantity },
          updatedAt: Date.now()
        },
        { runValidators: false } // Evita validação de campos não relacionados
      );
      
      const stockMovement = await StockMovement.create({
        product: product._id,
        type: "sale",
        quantity: item.quantity,
        date: Date.now(),
      });
      
      sale.products.push(stockMovement._id);
    }

    return NextResponse.json({ sale }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Ocorreu um erro ao adicionar a venda" },
      { status: 500 }
    );
  }
}