import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Sale from "@/models/saleModel";
import connectToDB from "@/utils/DAO";
import { getServerSession } from "next-auth";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

function formatMoney(value) {
  return value.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-MZ');
}

export async function POST(request) {
  try {
    await connectToDB();
    const session = await getServerSession();
    const user = await User.findOne({ email: session?.user?.email });
    
    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      dateRange,
      customDateStart,
      customDateEnd,
      minValue,
      maxValue,
      paymentMethod,
      groupBy 
    } = body;

    // Construir a query base
    let query = { empresaId: user.empresaId };

    // Aplicar filtros de data
    if (dateRange === 'custom' && customDateStart && customDateEnd) {
      query.createdAt = {
        $gte: new Date(customDateStart),
        $lte: new Date(customDateEnd)
      };
    } else {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dateRange) {
        case 'today':
          query.createdAt = { $gte: today };
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          query.createdAt = { $gte: weekAgo };
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          query.createdAt = { $gte: monthAgo };
          break;
        case 'year':
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          query.createdAt = { $gte: yearAgo };
          break;
      }
    }

    // Aplicar filtros de valor
    if (minValue) {
      query.totalAfterDiscount = { $gte: Number(minValue) };
    }
    if (maxValue) {
      query.totalAfterDiscount = { ...query.totalAfterDiscount, $lte: Number(maxValue) };
    }

    // Aplicar filtro de método de pagamento
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    // Buscar vendas filtradas
    const sales = await Sale.find(query).sort({ createdAt: -1 });

    // Criar PDF
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Relatório de Vendas', 105, 15, { align: 'center' });
    
    // Informações do período
    doc.setFontSize(12);
    doc.text(`Período: ${dateRange === 'custom' ? 
      `${formatDate(customDateStart)} até ${formatDate(customDateEnd)}` : 
      dateRange}`, 14, 25);
    doc.text(`Gerado em: ${formatDate(new Date())}`, 14, 32);

    // Resumo
    const totalVendas = sales.reduce((acc, sale) => acc + sale.totalAfterDiscount, 0);
    const totalItens = sales.reduce((acc, sale) => acc + sale.products.length, 0);
    
    doc.setFontSize(14);
    doc.text('Resumo', 14, 45);
    doc.setFontSize(12);
    doc.text(`Total de Vendas: ${formatMoney(totalVendas)}`, 14, 55);
    doc.text(`Quantidade de Vendas: ${sales.length}`, 14, 62);
    doc.text(`Total de Itens Vendidos: ${totalItens}`, 14, 69);

    // Tabela de vendas
    const headers = [['Data', 'Cliente', 'Itens', 'Total', 'Método']];
    const data = sales.map(sale => [
      formatDate(sale.createdAt),
      sale.customName,
      sale.products.length,
      formatMoney(sale.totalAfterDiscount),
      sale.paymentMethod || '-'
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 80,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Gráfico de barras mensal (se houver espaço)
    if (doc.lastAutoTable.finalY < 220) {
      // Agrupar vendas por mês
      const monthlySales = {};
      sales.forEach(sale => {
        const month = new Date(sale.createdAt).toLocaleString('pt-BR', { month: 'short' });
        monthlySales[month] = (monthlySales[month] || 0) + sale.totalAfterDiscount;
      });

      // Desenhar barras simples
      const startY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text('Vendas por Mês', 14, startY);
      
      let barY = startY + 10;
      Object.entries(monthlySales).forEach(([month, total]) => {
        const barWidth = (total / Math.max(...Object.values(monthlySales))) * 150;
        doc.setFillColor(99, 102, 241);
        doc.rect(14, barY, barWidth, 5, 'F');
        doc.setFontSize(8);
        doc.text(`${month}: ${formatMoney(total)}`, 170, barY + 4);
        barY += 8;
      });
    }

    // Converter para bytes
    const pdfBytes = doc.output('arraybuffer');
    
    // Retornar como resposta
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="relatorio-vendas.pdf"'
      }
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao gerar relatório" },
      { status: 500 }
    );
  }
}
