export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import connectToDB from '../../../../utils/DAO';
import Supplier from '../../../../models/supplierModel';
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
    const company = searchParams.get('company');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Construir filtro
    let filter = { empresaId: user.empresaId };
    
    // Se for um PDF individual de um fornecedor específico
    if (id) {
      filter._id = id;
    } else {
      // Aplicar filtros de busca geral
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      if (company) {
        filter.company = { $regex: company, $options: 'i' };
      }
      if (status) {
        filter.status = status;
      }
      if (category) {
        filter.category = { $regex: category, $options: 'i' };
      }
      if (country) {
        filter.country = { $regex: country, $options: 'i' };
      }
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59');
      }
    }
    
    // Buscar todos os fornecedores
    const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });
    
    if (!suppliers || suppliers.length === 0) {
      return NextResponse.json({ error: 'Nenhum fornecedor encontrado' }, { status: 404 });
    }
    
    // Calcular totais
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'ativo').length;
    const inactiveSuppliers = suppliers.filter(s => s.status === 'inativo').length;
    const pendingSuppliers = suppliers.filter(s => s.status === 'pendente').length;
    
    // Fornecedores por categoria
    const categoriesStats = {};
    suppliers.forEach(supplier => {
      const category = supplier.category || 'Sem categoria';
      categoriesStats[category] = (categoriesStats[category] || 0) + 1;
    });
    
    // Fornecedores por país
    const countriesStats = {};
    suppliers.forEach(supplier => {
      const country = supplier.country || 'Não informado';
      countriesStats[country] = (countriesStats[country] || 0) + 1;
    });
    
    // Gerar HTML do relatório
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Fornecedores</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 30px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 5px;
            }
            .table-container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #667eea;
                color: white;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .status-ativo { background-color: #d4edda; color: #155724; }
            .status-inativo { background-color: #f8d7da; color: #721c24; }
            .status-pendente { background-color: #fff3cd; color: #856404; }
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 0.9em;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📊 Relatório de Fornecedores</h1>
            <p>Gerado em ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}</p>
            ${id ? `<p>Fornecedor específico: ${suppliers[0]?.name}</p>` : ''}
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${totalSuppliers}</div>
                <div>Total de Fornecedores</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${activeSuppliers}</div>
                <div>Fornecedores Ativos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${inactiveSuppliers}</div>
                <div>Fornecedores Inativos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${pendingSuppliers}</div>
                <div>Fornecedores Pendentes</div>
            </div>
        </div>

        <div class="table-container">
            <h2>📋 Lista de Fornecedores</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Empresa</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Categoria</th>
                        <th>País</th>
                        <th>Status</th>
                        <th>Data Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${suppliers.map(supplier => `
                        <tr>
                            <td><strong>${supplier.name}</strong></td>
                            <td>${supplier.company || 'N/A'}</td>
                            <td>${supplier.email || 'N/A'}</td>
                            <td>${supplier.phone || 'N/A'}</td>
                            <td>${supplier.category || 'N/A'}</td>
                            <td>${supplier.country || 'N/A'}</td>
                            <td class="status-${supplier.status || 'pendente'}">${supplier.status === 'ativo' ? 'Ativo' : supplier.status === 'inativo' ? 'Inativo' : 'Pendente'}</td>
                            <td>${new Date(supplier.createdAt).toLocaleDateString('pt-PT')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="summary-grid">
            <div class="table-container">
                <h3>📊 Fornecedores por Categoria</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Quantidade</th>
                            <th>Percentual</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(categoriesStats).map(([category, count]) => `
                            <tr>
                                <td>${category}</td>
                                <td>${count}</td>
                                <td>${((count / totalSuppliers) * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="table-container">
                <h3>🌍 Fornecedores por País</h3>
                <table>
                    <thead>
                        <tr>
                            <th>País</th>
                            <th>Quantidade</th>
                            <th>Percentual</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(countriesStats).map(([country, count]) => `
                            <tr>
                                <td>${country}</td>
                                <td>${count}</td>
                                <td>${((count / totalSuppliers) * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="footer">
            <p>Sistema de Gestão Empresarial - Relatório gerado automaticamente</p>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'inline; filename="relatorio-fornecedores.html"',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de fornecedores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
