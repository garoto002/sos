export const dynamic = 'force-dynamic'


import { NextResponse } from 'next/server';
import connectToDB from '../../../../utils/DAO';
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

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    // Obter parâmetros de query se houver filtros
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Para PDF individual
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const company = searchParams.get('company');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Construir filtro
    let filter = { empresaId: currentUser.empresaId };
    
    // Se for um PDF individual de um usuário específico
    if (id) {
      filter._id = id;
    } else {
      // Aplicar filtros de busca geral
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      if (role) {
        filter.role = role;
      }
      if (status) {
        filter.status = status;
      }
      if (company) {
        filter.company = { $regex: company, $options: 'i' };
      }
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59');
      }
    }
    
    // Buscar todos os usuários
    const users = await User.find(filter).sort({ createdAt: -1 });
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Nenhum usuário encontrado' }, { status: 404 });
    }
    
    // Calcular totais
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'ativo').length;
    const inactiveUsers = users.filter(u => u.status === 'inativo').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    
    // Usuários por empresa
    const companiesStats = {};
    users.forEach(user => {
      const company = user.company || 'Sem empresa';
      companiesStats[company] = (companiesStats[company] || 0) + 1;
    });
    
    // Usuários criados por mês
    const monthlyStats = {};
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
    });
    
    // Gerar HTML do relatório
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Usuários</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .header {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
                color: #3b82f6;
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
                background-color: #3b82f6;
                color: white;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .status-ativo { background-color: #d4edda; color: #155724; }
            .status-inativo { background-color: #f8d7da; color: #721c24; }
            .role-admin { background-color: #e7e3ff; color: #5b21b6; }
            .role-user { background-color: #dbeafe; color: #1e40af; }
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
            <h1>👥 Relatório de Usuários</h1>
            <p>Gerado em ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}</p>
            ${id ? `<p>Usuário específico: ${users[0]?.name}</p>` : ''}
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${totalUsers}</div>
                <div>Total de Usuários</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${activeUsers}</div>
                <div>Usuários Ativos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${inactiveUsers}</div>
                <div>Usuários Inativos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${adminUsers}</div>
                <div>Administradores</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${regularUsers}</div>
                <div>Usuários Comuns</div>
            </div>
        </div>

        <div class="table-container">
            <h2>👤 Lista de Usuários</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Função</th>
                        <th>Status</th>
                        <th>Empresa</th>
                        <th>Data Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td><strong>${user.name || 'Nome não informado'}</strong></td>
                            <td>${user.email || 'Email não informado'}</td>
                            <td class="role-${user.role || 'user'}">${user.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
                            <td class="status-${user.status || 'ativo'}">${user.status === 'ativo' ? 'Ativo' : 'Inativo'}</td>
                            <td>${user.company || 'Não informado'}</td>
                            <td>${new Date(user.createdAt).toLocaleDateString('pt-PT')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="summary-grid">
            <div class="table-container">
                <h3>🏢 Usuários por Empresa</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Empresa</th>
                            <th>Quantidade</th>
                            <th>Percentual</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(companiesStats).map(([company, count]) => `
                            <tr>
                                <td>${company}</td>
                                <td>${count}</td>
                                <td>${((count / totalUsers) * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="table-container">
                <h3>📅 Usuários Cadastrados por Mês</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mês</th>
                            <th>Quantidade</th>
                            <th>Percentual</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(monthlyStats)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([month, count]) => `
                            <tr>
                                <td>${month}</td>
                                <td>${count}</td>
                                <td>${((count / totalUsers) * 100).toFixed(1)}%</td>
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
        'Content-Disposition': 'inline; filename="relatorio-usuarios.html"',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
