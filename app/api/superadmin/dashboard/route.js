import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import Sale from "@/models/saleModel";
import Product from "@/models/productModel";
import Supplier from "@/models/supplierModel";
import Purchase from "@/models/purchaseModel";
import StockAdjustment from "@/models/stockAdjustmentModel";
import connectToDB from "@/utils/DAO";

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "superadmin") {
        return NextResponse.json({ message: "Acesso restrito ao superadmin" }, { status: 403 });
    }
    await connectToDB();
    // Contagem de usuários por tipo
    const users = await User.find();
    const usersByRole = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
    }, {});
    // Contagem de vendas
    const vendasCount = await Sale.countDocuments();
    // Valor total de vendas (considerando totalAfterDiscount de cada venda)
    const vendas = await Sale.find();
    const totalVendas = vendas.reduce((acc, v) => acc + (v.totalAfterDiscount || 0), 0);
    // Contagem de produtos
    const productsCount = await Product.countDocuments();
    // Contagem de fornecedores
    const suppliersCount = await Supplier.countDocuments();
    // Contagem de compras
    const purchasesCount = await Purchase.countDocuments();
    // Contagem de ajustes de estoque
    const stockAdjustmentsCount = await StockAdjustment.countDocuments();
    return NextResponse.json({
        usersByRole,
        vendasCount,
        totalVendas,
        productsCount,
        suppliersCount,
        purchasesCount,
        stockAdjustmentsCount
    });
}
