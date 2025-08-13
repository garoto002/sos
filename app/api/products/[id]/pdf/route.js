
import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fetch from 'node-fetch';

export async function GET(req, { params }) {
  const { id } = params;
  // Busca os dados do produto na própria API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`);
  if (!res.ok) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  const { product } = await res.json();
  if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });

  // Cria o PDF bonito
  const doc = new jsPDF();

  // Logo e cabeçalho
  try {
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/images/logo-sistema-empresarial.png`;
    const logoRes = await fetch(logoUrl);
    if (logoRes.ok) {
      const imgBuffer = await logoRes.arrayBuffer();
      const base64Flag = 'data:image/png;base64,';
      const imageStr = Buffer.from(imgBuffer).toString('base64');
      doc.addImage(base64Flag + imageStr, 'PNG', 150, 10, 40, 20);
    }
  } catch {}

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 120);
  doc.text(product.name, 14, 30);
  doc.setFontSize(16);
  doc.setTextColor(0, 150, 0);
  doc.text(`Preço: ${product.price} MT`, 14, 40);
  doc.setTextColor(80, 80, 80);

  // Tabela de informações principais
  autoTable(doc, {
    startY: 50,
    head: [['Campo', 'Valor']],
    body: [
      ['Estoque', product.quantityInStock],
      ['Categoria', product.category || '-'],
      ['Marca', product.brand || '-'],
      ['Custo Unitário', `${product.cost || '-'} MT`],
      ['Custo Total', `${product.totalCost || '-'} MT`],
      ['Preço Total', `${product.totalPrice || '-'} MT`],
      ['Estoque Mínimo', product.stockMinimum || '-'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [40, 40, 120] },
    styles: { fontSize: 12 },
    margin: { left: 14, right: 14 },
  });

  // Descrição
  let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120;
  if (product.description) {
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 120);
    doc.text('Descrição:', 14, y);
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(doc.splitTextToSize(product.description, 180), 14, y + 8);
    y += 20;
  }

  // Rodapé
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text('Gerado por Sistema de Gestão Empresarial', 14, 285);

  // Retorna o PDF como resposta
  const pdfBuffer = doc.output('arraybuffer');
  return new NextResponse(Buffer.from(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=produto_${id}.pdf`,
    },
  });
}
