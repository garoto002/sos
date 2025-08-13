import { NextResponse } from 'next/server';
import connectToDB from '../../../../utils/DAO';
import Sale from '../../../../models/saleModel';

export async function GET(request) {
  try {
    await connectToDB();
    
    // Obter parâmetros de query se houver filtros
    const { searchParams } = new URL(request.url);
    const empresaId = searchParams.get('empresaId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Construir filtro
    let filter = {};
    if (empresaId) {
      filter.empresaId = empresaId;
    }
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Buscar todas as vendas
    const sales = await Sale.find(filter).sort({ createdAt: -1 });
    
    if (!sales || sales.length === 0) {
      return NextResponse.json({ error: 'Nenhuma venda encontrada' }, { status: 404 });
    }
    
    // Calcular totais
    const totalVendas = sales.length;
    const totalValue = sales.reduce((sum, sale) => sum + (sale.totalAfterDiscount || 0), 0);
    const totalSubtotal = sales.reduce((sum, sale) => sum + (sale.subtotal || 0), 0);
    const totalIva = sales.reduce((sum, sale) => sum + (sale.totalIva || 0), 0);
    const totalDiscount = sales.reduce((sum, sale) => sum + (sale.discount || 0), 0);
    
    // Formatação de moeda
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0);
    };
    
    // Gerar HTML do PDF
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');
    
    let salesRows = '';
    sales.forEach((sale, index) => {
      const saleDate = sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('pt-BR') : '-';
      salesRows += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; text-align: center;">${index + 1}</td>
          <td style="padding: 8px;">${sale.customName || '-'}</td>
          <td style="padding: 8px; text-align: center;">${saleDate}</td>
          <td style="padding: 8px; text-align: right;">${formatCurrency(sale.subtotal)}</td>
          <td style="padding: 8px; text-align: right;">${formatCurrency(sale.discount)}</td>
          <td style="padding: 8px; text-align: right;">${formatCurrency(sale.totalIva)}</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">${formatCurrency(sale.totalAfterDiscount)}</td>
        </tr>
      `;
    });
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Vendas</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 20px;
          }
          .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            color: #4f46e5;
            margin-bottom: 5px;
          }
          .report-title { 
            font-size: 18px; 
            color: #666;
            margin-bottom: 10px;
          }
          .report-info { 
            font-size: 12px; 
            color: #888;
          }
          .summary {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
          }
          .summary-title {
            font-size: 16px;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 15px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
          }
          .summary-label {
            font-weight: bold;
            color: #374151;
          }
          .summary-value {
            color: #059669;
            font-weight: bold;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th { 
            background-color: #4f46e5; 
            color: white; 
            padding: 12px 8px; 
            text-align: left;
            font-weight: bold;
          }
          td { 
            padding: 8px; 
            border-bottom: 1px solid #e2e8f0;
          }
          tr:nth-child(even) { 
            background-color: #f8fafc; 
          }
          tr:hover { 
            background-color: #e0e7ff; 
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-inside: avoid; }
            .summary { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Sistema de Gestão Empresarial</div>
          <div class="report-title">Relatório Geral de Vendas</div>
          <div class="report-info">
            Gerado em: ${currentDate} às ${currentTime}<br>
            Período: ${startDate && endDate ? `${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}` : 'Todas as vendas'}
          </div>
        </div>
        
        <div class="summary">
          <div class="summary-title">Resumo do Período</div>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Total de Vendas:</span>
              <span class="summary-value">${totalVendas}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Subtotal:</span>
              <span class="summary-value">${formatCurrency(totalSubtotal)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Descontos:</span>
              <span class="summary-value">${formatCurrency(totalDiscount)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total IVA:</span>
              <span class="summary-value">${formatCurrency(totalIva)}</span>
            </div>
            <div class="summary-item" style="grid-column: span 2; background-color: #4f46e5; color: white;">
              <span class="summary-label" style="color: white;">TOTAL GERAL:</span>
              <span class="summary-value" style="color: white; font-size: 18px;">${formatCurrency(totalValue)}</span>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="text-align: center;">#</th>
              <th>Cliente</th>
              <th style="text-align: center;">Data</th>
              <th style="text-align: right;">Subtotal</th>
              <th style="text-align: right;">Desconto</th>
              <th style="text-align: right;">IVA</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${salesRows}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo Sistema de Gestão Empresarial</p>
          <p>Total de ${totalVendas} venda(s) processada(s)</p>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="relatorio_vendas_${currentDate.replace(/\//g, '-')}.html"`
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
