import { NextResponse } from "next/server";
import connectToDB from "../../../../../utils/DAO";
import Sale from "../../../../../models/saleModel";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    
    // Verificar se o ID é válido
    if (!params.id || params.id.length !== 24) {
      return NextResponse.json(
        { message: "ID de venda inválido" },
        { status: 400 }
      );
    }

    // Buscar a venda
    const sale = await Sale.findById(params.id).populate('user');
    
    if (!sale) {
      return NextResponse.json(
        { message: "Venda não encontrada" },
        { status: 404 }
      );
    }

    // Gerar PDF simples (HTML que pode ser impresso)
    const pdfHtml = generateSalePDF(sale);
    
    return new NextResponse(pdfHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="venda-${sale._id}.html"`,
      },
    });

  } catch (error) {
    console.error("Erro ao gerar PDF da venda:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

function generateSalePDF(sale) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(value || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-PT');
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Recibo de Venda - ${sale._id}</title>
      <style>
        @media print {
          @page { margin: 1cm; }
          body { font-size: 12px; }
        }
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          line-height: 1.4;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #333; 
          padding-bottom: 20px; 
          margin-bottom: 20px; 
        }
        .company-name { 
          font-size: 24px; 
          font-weight: bold; 
          color: #2563eb;
          margin-bottom: 5px;
        }
        .receipt-title { 
          font-size: 18px; 
          color: #666; 
        }
        .info-section { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 20px; 
        }
        .info-box { 
          flex: 1; 
          margin-right: 20px; 
        }
        .info-box:last-child { 
          margin-right: 0; 
        }
        .info-title { 
          font-weight: bold; 
          color: #333; 
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 20px; 
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 10px; 
          text-align: left; 
        }
        th { 
          background-color: #f8f9fa; 
          font-weight: bold; 
        }
        .text-right { 
          text-align: right; 
        }
        .totals { 
          background-color: #f8f9fa; 
          padding: 15px; 
          border-radius: 5px; 
          margin-top: 20px;
        }
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 5px; 
        }
        .final-total { 
          font-size: 18px; 
          font-weight: bold; 
          color: #2563eb; 
          border-top: 2px solid #333; 
          padding-top: 10px;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #ddd; 
          color: #666; 
        }
        .print-button {
          background-color: #2563eb;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 16px;
        }
        @media print {
          .print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">🖨️ Imprimir Recibo</button>
      
      <div class="header">
        <div class="company-name">Sistema de Gestão Empresarial</div>
        <div class="receipt-title">RECIBO DE VENDA</div>
      </div>

      <div class="info-section">
        <div class="info-box">
          <div class="info-title">📄 Informações da Venda</div>
          <div><strong>ID:</strong> ${sale._id}</div>
          <div><strong>Data:</strong> ${formatDate(sale.createdAt)}</div>
          <div><strong>Vendedor:</strong> ${sale.user?.firstName || 'N/A'} ${sale.user?.lastName || ''}</div>
        </div>
        <div class="info-box">
          <div class="info-title">👤 Cliente</div>
          <div><strong>Nome:</strong> ${sale.customName || 'Cliente Avulso'}</div>
          <div><strong>Observações:</strong> ${sale.description || 'Nenhuma'}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th class="text-right">Preço Unit.</th>
            <th class="text-right">Qtd</th>
            <th class="text-right">IVA</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${sale.products.map(product => `
            <tr>
              <td>${product.product}</td>
              <td class="text-right">${formatCurrency(product.price)}</td>
              <td class="text-right">${product.quantity}</td>
              <td class="text-right">${(product.ivaRate * 100).toFixed(1)}%</td>
              <td class="text-right">${formatCurrency(product.totalPrice)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(sale.subtotal)}</span>
        </div>
        <div class="total-row">
          <span>Desconto:</span>
          <span>-${formatCurrency(sale.discount || 0)}</span>
        </div>
        <div class="total-row final-total">
          <span>TOTAL FINAL:</span>
          <span>${formatCurrency(sale.totalAfterDiscount)}</span>
        </div>
        ${sale.receivedAmount ? `
          <div class="total-row">
            <span>Valor Recebido:</span>
            <span>${formatCurrency(sale.receivedAmount)}</span>
          </div>
          <div class="total-row">
            <span>Troco:</span>
            <span>${formatCurrency(sale.receivedAmount - sale.totalAfterDiscount)}</span>
          </div>
        ` : ''}
      </div>

      <div class="footer">
        <p>Obrigado pela sua preferência!</p>
        <p><small>Documento gerado automaticamente em ${formatDate(new Date())}</small></p>
      </div>

      <script>
        // Auto-print quando for um novo recibo
        if (window.location.search.includes('autoprint=true')) {
          window.onload = function() {
            setTimeout(() => window.print(), 500);
          };
        }
      </script>
    </body>
    </html>
  `;
}
