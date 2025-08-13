import { NextResponse } from 'next/server';
import connectToDB from '../../../../utils/DAO';
import Product from '../../../../models/productModel';
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
    const category = searchParams.get('category');
    const supplier = searchParams.get('supplier');
    const minStock = searchParams.get('minStock');
    const maxStock = searchParams.get('maxStock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    
    // Construir filtro
    let filter = { empresaId: user.empresaId };
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (supplier) {
      filter.supplier = { $regex: supplier, $options: 'i' };
    }
    if (minStock || maxStock) {
      filter.stock = {};
      if (minStock) filter.stock.$gte = parseInt(minStock);
      if (maxStock) filter.stock.$lte = parseInt(maxStock);
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Buscar todos os produtos
    const products = await Product.find(filter).sort({ name: 1 });
    
    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Nenhum produto encontrado' }, { status: 404 });
    }
    
    // Calcular totais
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.stock || 0)), 0);
    const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
    const lowStockProducts = products.filter(product => (product.stock || 0) <= 5).length;
    const averagePrice = products.length > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length : 0;
    
    // Produtos por categoria
    const categoriesStats = {};
    products.forEach(product => {
      const cat = product.category || 'Sem categoria';
      if (!categoriesStats[cat]) {
        categoriesStats[cat] = { count: 0, totalValue: 0 };
      }
      categoriesStats[cat].count++;
      categoriesStats[cat].totalValue += (product.price || 0) * (product.stock || 0);
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
        <title>Relatório de Produtos</title>
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
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
            .categories {
                padding: 30px;
            }
            .categories h2 {
                color: #1e293b;
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .category-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            .category-item {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
            }
            .category-item h4 {
                margin: 0 0 5px 0;
                color: #1e293b;
            }
            .products-table {
                padding: 30px;
            }
            .products-table h2 {
                color: #1e293b;
                border-bottom: 3px solid #3b82f6;
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
                background: #3b82f6;
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
            .low-stock {
                color: #dc2626;
                font-weight: 600;
            }
            .good-stock {
                color: #16a34a;
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
                <h1>📦 Relatório de Produtos</h1>
                <p>Gerado em ${formatDate(new Date())}</p>
            </div>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>Total de Produtos</h3>
                    <div class="value">${totalProducts}</div>
                </div>
                <div class="summary-card">
                    <h3>Valor Total em Estoque</h3>
                    <div class="value">${formatCurrency(totalValue)}</div>
                </div>
                <div class="summary-card">
                    <h3>Quantidade Total</h3>
                    <div class="value">${totalStock.toLocaleString('pt-PT')}</div>
                </div>
                <div class="summary-card">
                    <h3>Produtos com Estoque Baixo</h3>
                    <div class="value" style="color: #dc2626;">${lowStockProducts}</div>
                </div>
                <div class="summary-card">
                    <h3>Preço Médio</h3>
                    <div class="value">${formatCurrency(averagePrice)}</div>
                </div>
            </div>
            
            <div class="categories">
                <h2>📊 Produtos por Categoria</h2>
                <div class="category-grid">
                    ${Object.entries(categoriesStats).map(([category, stats]) => `
                        <div class="category-item">
                            <h4>${category}</h4>
                            <p><strong>${stats.count}</strong> produtos</p>
                            <p>Valor: <strong>${formatCurrency(stats.totalValue)}</strong></p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="products-table">
                <h2>📝 Lista Detalhada de Produtos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Fornecedor</th>
                            <th>Estoque</th>
                            <th>Preço Unit.</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map((product, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${product.name || 'N/A'}</strong></td>
                                <td>${product.category || 'Sem categoria'}</td>
                                <td>${product.supplier || 'N/A'}</td>
                                <td class="${(product.stock || 0) <= 5 ? 'low-stock' : 'good-stock'}">
                                    ${(product.stock || 0).toLocaleString('pt-PT')} un.
                                </td>
                                <td>${formatCurrency(product.price || 0)}</td>
                                <td><strong>${formatCurrency((product.price || 0) * (product.stock || 0))}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="footer">
                <p>Relatório gerado automaticamente pelo Sistema de Gestão Empresarial</p>
                <p>Total de ${totalProducts} produtos • Valor total: ${formatCurrency(totalValue)}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'inline; filename="relatorio-produtos.html"',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
