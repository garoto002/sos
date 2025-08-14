import { NextResponse } from 'next/server';
import connectToDB from '../../../../utils/DAO';
import Customer from '../../../../models/customerModel';
import User from '../../../../models/userModel';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Construir filtro
    let filter = { empresaId: user.empresaId };
    
    // Se for um PDF individual de um cliente específico
    if (id) {
      filter._id = id;
    } else {
      // Aplicar filtros de busca geral
      if (search) {
        filter.$or = [
          { customerName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }
      if (status) {
        filter.status = status;
      }
      if (category) {
        filter.category = category;
      }
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Buscar clientes
    const customers = await Customer.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    
    if (customers.length === 0) {
      return NextResponse.json({ error: 'Nenhum cliente encontrado' }, { status: 404 });
    }
    
    // Gerar HTML para PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Clientes</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #f5f5f5;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold;
          }
          .header p { 
            margin: 5px 0 0 0; 
            font-size: 14px; 
            opacity: 0.9;
          }
          .summary {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .summary h2 {
            color: #333;
            margin-top: 0;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
          }
          .stat-item {
            text-align: center;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .customer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .customer-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
          }
          .customer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          .customer-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 0;
          }
          .customer-status {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-ativo { background: #d4edda; color: #155724; }
          .status-inativo { background: #f8d7da; color: #721c24; }
          .status-pendente { background: #fff3cd; color: #856404; }
          .customer-info {
            margin: 10px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
          }
          .info-label {
            color: #666;
            font-weight: 500;
          }
          .info-value {
            color: #333;
            font-weight: normal;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
          }
          @media print {
            body { background-color: white; }
            .customer-grid { 
              grid-template-columns: repeat(2, 1fr); 
              gap: 15px; 
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Clientes</h1>
          <p>Gerado em ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}</p>
          <p>Usuário: ${user.name} | Email: ${user.email}</p>
        </div>

        <div class="summary">
          <h2>Resumo Geral</h2>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">${customers.length}</div>
              <div class="stat-label">Total de Clientes</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${customers.filter(c => c.status === 'ativo').length}</div>
              <div class="stat-label">Clientes Ativos</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${customers.filter(c => c.status === 'inativo').length}</div>
              <div class="stat-label">Clientes Inativos</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${customers.filter(c => c.status === 'pendente').length}</div>
              <div class="stat-label">Clientes Pendentes</div>
            </div>
          </div>
        </div>

        <div class="customer-grid">
          ${customers.map(customer => `
            <div class="customer-card">
              <div class="customer-header">
                <h3 class="customer-name">${customer.customerName}</h3>
                <span class="customer-status status-${customer.status || 'ativo'}">
                  ${customer.status || 'ativo'}
                </span>
              </div>
              
              <div class="customer-info">
                ${customer.email ? `
                  <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${customer.email}</span>
                  </div>
                ` : ''}
                
                <div class="info-row">
                  <span class="info-label">Telefone:</span>
                  <span class="info-value">${customer.phone || 'N/A'}</span>
                </div>
                
                ${customer.location ? `
                  <div class="info-row">
                    <span class="info-label">Localização:</span>
                    <span class="info-value">${customer.location}</span>
                  </div>
                ` : ''}
                
                ${customer.address ? `
                  <div class="info-row">
                    <span class="info-label">Endereço:</span>
                    <span class="info-value">${customer.address}</span>
                  </div>
                ` : ''}
                
                ${customer.category ? `
                  <div class="info-row">
                    <span class="info-label">Categoria:</span>
                    <span class="info-value">${customer.category}</span>
                  </div>
                ` : ''}
                
                ${customer.nuit ? `
                  <div class="info-row">
                    <span class="info-label">NUIT:</span>
                    <span class="info-value">${customer.nuit}</span>
                  </div>
                ` : ''}
                
                <div class="info-row">
                  <span class="info-label">Criado em:</span>
                  <span class="info-value">${new Date(customer.createdAt).toLocaleDateString('pt-PT')}</span>
                </div>
                
                ${customer.notes ? `
                  <div class="info-row">
                    <span class="info-label">Observações:</span>
                    <span class="info-value">${customer.notes}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo Sistema de Gestão Empresarial</p>
          <p>Dados confidenciais - Uso interno apenas</p>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('Erro ao gerar PDF de clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar PDF' },
      { status: 500 }
    );
  }
}
