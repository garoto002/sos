import jsPDF from 'jspdf';
import 'jspdf-autotable';

// You can pass a logo as a base64 string or image URL if needed
export default function exportSalesPDF({ sales, periodLabel, logoBase64 }) {
  const pdf = new jsPDF({ orientation: 'landscape' });

  // Add logo if provided
  if (logoBase64) {
    pdf.addImage(logoBase64, 'PNG', 14, 8, 24, 16);
  }

  // Company Info (customize as needed)
  pdf.setFontSize(11);
  pdf.setTextColor('#1e3a8a');
  pdf.text('Empresa: Sistema de Gestão Empresarial', 150, 12, { align: 'right' });
  pdf.setFontSize(10);
  pdf.setTextColor('#6b7280');
  pdf.text('Data de emissão: ' + new Date().toLocaleDateString('pt-PT'), 150, 18, { align: 'right' });

  // Header
  pdf.setFontSize(18);
  pdf.setTextColor('#1e3a8a');
  pdf.text('Relatório de Vendas', 14, 18);
  pdf.setFontSize(12);
  pdf.setTextColor('#374151');
  pdf.text(periodLabel, 14, 26);

  // Summary Section
  const totalVendas = sales.length;
  const volumeVendas = sales.reduce((total, sale) => total + (sale.totalAfterDiscount || 0), 0);
  pdf.setFontSize(11);
  pdf.setTextColor('#2563eb');
  pdf.text(`Vendas Registadas: ${totalVendas}`, 14, 34);
  pdf.setTextColor('#059669');
  pdf.text(`Volume de vendas: ${volumeVendas.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT`, 80, 34);

  // Table (with improved formatting and information)
  pdf.autoTable({
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontSize: 8,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: 50,
      lineWidth: 0.1
    },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'center' },
      6: { halign: 'center' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' }
    },
    head: [[
      'Nº Fatura', 'Data', 'Cliente', 'Produto', 'Preço Unit.', 'Qtd', 'IVA', 'Total', 'Desconto', 'Total Final'
    ]],
    body: sales.flatMap((sale) =>
      sale.products.map((product, index) => [
        index === 0 ? sale.invoiceNumber || '-' : '',
        index === 0 ? (sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('pt-PT') : '-') : '',
        index === 0 ? (sale.customName || sale.customer?.name || '-') : '',
        product.product,
        product.price.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' MT',
        product.quantity,
        (product.ivaRate || 0) + '%',
        product.totalPrice.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' MT',
        index === 0 ? (sale.discount ? sale.discount.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' MT' : '-') : '',
        index === 0 ? ((sale.products.reduce((acc, p) => acc + (p.totalPrice || 0), 0) - (sale.discount || 0)).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' MT') : ''
      ]),
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: 30,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'right'
    },
    foot: [[
      'Totais',
      '',
      '',
      '',
      '',
      sales.reduce((acc, sale) => acc + sale.products.reduce((a, p) => a + p.quantity, 0), 0),
      '',
      sales.reduce((acc, sale) => acc + sale.products.reduce((a, p) => a + p.totalPrice, 0), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' MT',
      sales.reduce((acc, sale) => acc + (sale.discount || 0), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' MT',
      sales.reduce((acc, sale) => acc + (sale.products.reduce((a, p) => a + p.totalPrice, 0) - (sale.discount || 0)), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' MT'
    ]]
  });

  // Salvar o PDF
  const fileName = `Relatorio_Vendas_${periodLabel.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  pdf.save(fileName);
      ])
    ),
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 2,
      textColor: '#374151',
      lineColor: [30, 58, 138],
      lineWidth: 0.1,
      cellWidth: 'wrap',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: '#fff',
      fontStyle: 'bold',
      lineColor: [30, 58, 138],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [239, 246, 255],
    },
    margin: { left: 14, right: 14 },
    tableLineColor: [30, 58, 138],
    tableLineWidth: 0.1,
  });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor('#6b7280');
  pdf.text('Gerado por Sistema de Gestão Empresarial', 14, pdf.internal.pageSize.getHeight() - 10);

  pdf.save('relatorio_vendas.pdf');
}
