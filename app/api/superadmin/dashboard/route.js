import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
import Sale from "@/models/saleModel";
import Product from "@/models/productModel";
import Supplier from "@/models/supplierModel";
import Purchase from "@/models/purchaseModel";
import StockAdjustment from "@/models/stockAdjustmentModel";
import Empresa from "@/models/empresaModel";
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
    // Obter dados das empresas
    const empresas = await Empresa.find().select('nome cnpj email telefone ativo').lean();

    // Calcular usuários ativos e inativos
    const activeUsers = users.filter(u => u.status === 'ativo').length;
    const inactiveUsers = users.filter(u => u.status !== 'ativo').length;

    // Calcular dados do período anterior (30 dias atrás)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previousUsers = await User.find({ createdAt: { $lt: thirtyDaysAgo } });
    const previousActiveUsers = previousUsers.filter(u => u.status === 'ativo').length;
    const previousInactiveUsers = previousUsers.filter(u => u.status !== 'ativo').length;
    const previousEmpresas = await Empresa.countDocuments({ createdAt: { $lt: thirtyDaysAgo } });
    const previousAdmins = previousUsers.filter(u => u.role === 'admin').length;
    const previousTotalUsers = previousUsers.length;

    return NextResponse.json({
        usersByRole,
        empresas,
        activeUsers,
        inactiveUsers,
        previousActiveUsers,
        previousInactiveUsers,
        previousEmpresas,
        previousAdmins,
        previousTotalUsers,
        vendasCount,
        totalVendas,
        productsCount,
        suppliersCount,
        purchasesCount,
        stockAdjustmentsCount,
        users: users.map(u => ({
            _id: u._id,
            role: u.role,
            status: u.status,
            empresaId: u.empresaId,
            empresaName: u.empresaName,
            createdAt: u.createdAt
        }))
    });
}
