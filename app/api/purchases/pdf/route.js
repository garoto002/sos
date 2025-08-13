import { NextResponse } from 'next/server';
import connectToDB from '../../../../utils/DAO';
import Purchase from '../../../../models/purchaseModel';
import User from '../../../../models/userModel';
import { getServerSession } from 'next-auth';

export async function GET(request) {
  try {
    await connectToDB();
    
    // Verificar sessão do usuário
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    // Obter parâmetros de query se houver filtros
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Para PDF individual
    const search = searchParams.get('search');
    const supplier = searchParams.get('supplier');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minTotal = searchParams.get('minTotal');
    const maxTotal = searchParams.get('maxTotal');
    
    // Construir filtro
    let filter = { empresaId: user.empresaId };
    
    // Se for um PDF individual de uma compra específica
    if (id) {
      filter._id = id;
    } else {
      // Aplicar filtros de busca geral
      if (search) {
        filter.$or = [
          { supplier: { $regex: search, $options: 'i' } },
          { referenceNumber: { $regex: search, $options: 'i' } }
        ];
      }
      if (supplier) {
        filter.supplier = { $regex: supplier, $options: 'i' };
      }
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59');
      }
      if (minTotal || maxTotal) {
        filter.totalAmount = {};
        if (minTotal) filter.totalAmount.$gte = parseFloat(minTotal);
        if (maxTotal) filter.totalAmount.$lte = parseFloat(maxTotal);
      }
    }
    
    // Buscar todas as compras
    const purchases = await Purchase.find(filter).sort({ createdAt: -1 });
    
    if (!purchases || purchases.length === 0) {
      return NextResponse.json({ error: 'Nenhuma compra encontrada' }, { status: 404 });
    }
    
    // Calcular totais
    const totalPurchases = purchases.length;
    const totalValue = purchases.reduce((sum, purchase) => sum + (purchase.totalAmount || purchase.total || 0), 0);
    const totalProducts = purchases.reduce((sum, purchase) => sum + (purchase.products?.length || 0), 0);
    const averageValue = totalPurchases > 0 ? totalValue / totalPurchases : 0;
    
    // Compras por status
    const statusStats = {
      completed: purchases.filter(p => p.status === 'completed').length,
      pending: purchases.filter(p => p.status === 'pending').length,
      cancelled: purchases.filter(p => p.status === 'cancelled').length
    };
    
    // Compras por fornecedor
    const suppliersStats = {};
    purchases.forEach(purchase => {
      const supplierName = purchase.supplier || 'Sem fornecedor';
      if (!suppliersStats[supplierName]) {
        suppliersStats[supplierName] = { count: 0, totalValue: 0 };
      }
      suppliersStats[supplierName].count++;
      suppliersStats[supplierName].totalValue += purchase.totalAmount || purchase.total || 0;
    });
    
    // Formatação de moeda
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0);
    };
    
    // Formatação de data
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date));
    };
    
    // Gerar HTML do relatório
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Compras</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f8fafc;
                color: #334155;
                line-height: 1.6;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 2.5rem;
                font-weight: 700;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 1.1rem;
            }
            .summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                padding: 30px;
                background: #f1f5f9;
            }
            .summary-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .summary-card h3 {
                margin: 0 0 10px 0;
                color: #475569;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .summary-card .value {
                font-size: 2rem;
                font-weight: 700;
                color: #1e293b;
            }
            .suppliers {
                padding: 30px;
            }
            .suppliers h2 {
                color: #1e293b;
                border-bottom: 3px solid #7c3aed;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .supplier-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            .supplier-item {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #7c3aed;
            }
            .supplier-item h4 {
                margin: 0 0 5px 0;
                color: #1e293b;
            }
            .purchases-table {
                padding: 30px;
            }
            .purchases-table h2 {
                color: #1e293b;
                border-bottom: 3px solid #7c3aed;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            th {
                background: #7c3aed;
                color: white;
                padding: 15px 10px;
                text-align: left;
                font-weight: 600;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            td {
                padding: 12px 10px;
                border-bottom: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
                background: #f8fafc;
            }
            tr:hover {
                background: #e2e8f0;
            }
            .status-completed {
                color: #16a34a;
                font-weight: 600;
            }
            .status-pending {
                color: #ca8a04;
                font-weight: 600;
            }
            .status-cancelled {
                color: #dc2626;
                font-weight: 600;
            }
            .footer {
                background: #f1f5f9;
                padding: 20px 30px;
                text-align: center;
                color: #64748b;
                font-size: 0.9rem;
            }
            @media print {
                body { background: white; }
                .container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛒 Relatório de Compras</h1>
                <p>Gerado em ${formatDate(new Date())}</p>
            </div>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>Total de Compras</h3>
                    <div class="value">${totalPurchases}</div>
                </div>
                <div class="summary-card">
                    <h3>Valor Total</h3>
                    <div class="value">${formatCurrency(totalValue)}</div>
                </div>
                <div class="summary-card">
                    <h3>Produtos Comprados</h3>
                    <div class="value">${totalProducts}</div>
                </div>
                <div class="summary-card">
                    <h3>Valor Médio</h3>
                    <div class="value">${formatCurrency(averageValue)}</div>
                </div>
                <div class="summary-card">
                    <h3>Concluídas</h3>
                    <div class="value" style="color: #16a34a;">${statusStats.completed}</div>
                </div>
                <div class="summary-card">
                    <h3>Pendentes</h3>
                    <div class="value" style="color: #ca8a04;">${statusStats.pending}</div>
                </div>
            </div>
            
            <div class="suppliers">
                <h2>📊 Compras por Fornecedor</h2>
                <div class="supplier-grid">
                    ${Object.entries(suppliersStats).map(([supplier, stats]) => `
                        <div class="supplier-item">
                            <h4>${supplier}</h4>
                            <p><strong>${stats.count}</strong> compras</p>
                            <p>Valor: <strong>${formatCurrency(stats.totalValue)}</strong></p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="purchases-table">
                <h2>📝 Lista Detalhada de Compras</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Data</th>
                            <th>Fornecedor</th>
                            <th>Referência</th>
                            <th>Status</th>
                            <th>Produtos</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${purchases.map((purchase, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${formatDate(purchase.createdAt || purchase.date)}</td>
                                <td><strong>${purchase.supplier || 'N/A'}</strong></td>
                                <td>${purchase.referenceNumber || 'N/A'}</td>
                                <td class="status-${purchase.status || 'pending'}">
                                    ${purchase.status === 'completed' ? 'Concluída' :
                                      purchase.status === 'pending' ? 'Pendente' : 'Cancelada'}
                                </td>
                                <td>${purchase.products?.length || 0} itens</td>
                                <td><strong>${formatCurrency(purchase.totalAmount || purchase.total || 0)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="footer">
                <p>Relatório gerado automaticamente pelo Sistema de Gestão Empresarial</p>
                <p>Total de ${totalPurchases} compras • Valor total: ${formatCurrency(totalValue)}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'inline; filename="relatorio-compras.html"',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de compras:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
