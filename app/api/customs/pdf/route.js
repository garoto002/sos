import { NextResponse } from 'next/server';
import connectToDB from '../../../../utils/DAO';
import Custom from '../../../../models/customModel';
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
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minValue = searchParams.get('minValue');
    const maxValue = searchParams.get('maxValue');
    
    // Construir filtro
    let filter = { empresaId: user.empresaId };
    
    // Se for um PDF individual de um desembaraço específico
    if (id) {
      filter._id = id;
    } else {
      // Aplicar filtros de busca geral
      if (search) {
        filter.$or = [
          { numero: { $regex: search, $options: 'i' } },
          { cliente: { $regex: search, $options: 'i' } },
          { observacoes: { $regex: search, $options: 'i' } }
        ];
      }
      if (status) {
        filter.status = status;
      }
      if (type) {
        filter.tipo = type;
      }
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59');
      }
      if (minValue || maxValue) {
        filter.valorTotal = {};
        if (minValue) filter.valorTotal.$gte = parseFloat(minValue);
        if (maxValue) filter.valorTotal.$lte = parseFloat(maxValue);
      }
    }
    
    // Buscar todos os desembaraços
    const customers = await Custom.find(filter).sort({ createdAt: -1 });

    if (!customers || customers.length === 0) {
      return NextResponse.json({ error: 'Nenhum desembaraço encontrado' }, { status: 404 });
    }
    
    // Calcular totais
    const totalCustomers = customers.length;
    const totalValue = customers.reduce((sum, customer) => sum + (customer.valorTotal || customer.valor || 0), 0);
    const totalWeight = customers.reduce((sum, customer) => sum + (customer.peso || 0), 0);
    const averageValue = totalCustomers > 0 ? totalValue / totalCustomers : 0;

    // Desembaraços por status
    const statusStats = {
      concluido: customers.filter(c => c.status === 'concluido').length,
      em_andamento: customers.filter(c => c.status === 'em_andamento').length,
      pendente: customers.filter(c => c.status === 'pendente').length,
      cancelado: customers.filter(c => c.status === 'cancelado').length
    };
    
    // Desembaraços por tipo
    const typeStats = {
      importacao: customers.filter(c => c.tipo === 'importacao').length,
      exportacao: customers.filter(c => c.tipo === 'exportacao').length,
      transito: customers.filter(c => c.tipo === 'transito').length
    };
    
    // Desembaraços por cliente
    const clientsStats = {};
    customers.forEach(customer => {
      const client = customer.cliente || 'Sem cliente';
      if (!clientsStats[client]) {
        clientsStats[client] = { count: 0, totalValue: 0 };
      }
      clientsStats[client].count++;
      clientsStats[client].totalValue += customer.valorTotal || customer.valor || 0;
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

    const getStatusText = (status) => {
      switch (status) {
        case 'concluido': return 'Concluído';
        case 'em_andamento': return 'Em Andamento';
        case 'pendente': return 'Pendente';
        case 'cancelado': return 'Cancelado';
        default: return 'Indefinido';
      }
    };

    const getTypeText = (type) => {
      switch (type) {
        case 'importacao': return 'Importação';
        case 'exportacao': return 'Exportação';
        case 'transito': return 'Trânsito';
        default: return type || 'N/A';
      }
    };
    
    // Gerar HTML do relatório
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Desembaraços</title>
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
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
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
            .stats {
                padding: 30px;
            }
            .stats h2 {
                color: #1e293b;
                border-bottom: 3px solid #059669;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            .stats-item {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #059669;
            }
            .stats-item h4 {
                margin: 0 0 5px 0;
                color: #1e293b;
            }
            .customers-table {
                padding: 30px;
            }
            .customers-table h2 {
                color: #1e293b;
                border-bottom: 3px solid #059669;
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
                background: #059669;
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
            .status-concluido {
                color: #16a34a;
                font-weight: 600;
            }
            .status-em_andamento {
                color: #2563eb;
                font-weight: 600;
            }
            .status-pendente {
                color: #ca8a04;
                font-weight: 600;
            }
            .status-cancelado {
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
                <h1>🛃 Relatório de Desembaraços</h1>
                <p>Gerado em ${formatDate(new Date())}</p>
            </div>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>Total de Desembaraços</h3>
                    <div class="value">${totalCustomers}</div>
                </div>
                <div class="summary-card">
                    <h3>Valor Total</h3>
                    <div class="value">${formatCurrency(totalValue)}</div>
                </div>
                <div class="summary-card">
                    <h3>Peso Total</h3>
                    <div class="value">${totalWeight.toLocaleString('pt-PT')} kg</div>
                </div>
                <div class="summary-card">
                    <h3>Valor Médio</h3>
                    <div class="value">${formatCurrency(averageValue)}</div>
                </div>
                <div class="summary-card">
                    <h3>Concluídos</h3>
                    <div class="value" style="color: #16a34a;">${statusStats.concluido}</div>
                </div>
                <div class="summary-card">
                    <h3>Em Andamento</h3>
                    <div class="value" style="color: #2563eb;">${statusStats.em_andamento}</div>
                </div>
            </div>
            
            <div class="stats">
                <h2>📊 Estatísticas por Tipo</h2>
                <div class="stats-grid">
                    <div class="stats-item">
                        <h4>Importação</h4>
                        <p><strong>${typeStats.importacao}</strong> desembaraços</p>
                    </div>
                    <div class="stats-item">
                        <h4>Exportação</h4>
                        <p><strong>${typeStats.exportacao}</strong> desembaraços</p>
                    </div>
                    <div class="stats-item">
                        <h4>Trânsito</h4>
                        <p><strong>${typeStats.transito}</strong> desembaraços</p>
                    </div>
                </div>
                
                <h2>👥 Top Clientes</h2>
                <div class="stats-grid">
                    ${Object.entries(clientsStats).slice(0, 6).map(([client, stats]) => `
                        <div class="stats-item">
                            <h4>${client}</h4>
                            <p><strong>${stats.count}</strong> desembaraços</p>
                            <p>Valor: <strong>${formatCurrency(stats.totalValue)}</strong></p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="customers-table">
                <h2>📝 Lista Detalhada de Desembaraços</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Data</th>
                            <th>Número</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Peso (kg)</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customers.map((custom, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${formatDate(custom.createdAt || custom.data)}</td>
                                <td><strong>${custom.numero || custom.customName || 'N/A'}</strong></td>
                                <td>${custom.cliente || 'N/A'}</td>
                                <td>${getTypeText(custom.tipo)}</td>
                                <td class="status-${custom.status || 'pendente'}">
                                    ${getStatusText(custom.status)}
                                </td>
                                <td>${custom.peso ? custom.peso.toLocaleString('pt-PT') : '-'}</td>
                                <td><strong>${formatCurrency(custom.valorTotal || custom.valor || 0)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="footer">
                <p>Relatório gerado automaticamente pelo Sistema de Gestão Empresarial</p>
                <p>Total de ${totalCustomers} desembaraços • Valor total: ${formatCurrency(totalValue)}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'inline; filename="relatorio-desembaracos.html"',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de desembaraços:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
