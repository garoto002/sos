import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Group, ShoppingCart, Inventory, AttachMoney } from '@mui/icons-material';

const COLORS = ['#6366f1', '#10b981', '#f59e42', '#ef4444', '#f472b6', '#0ea5e9', '#a21caf'];

// Componente para cards de indicadores - design compacto para layout em colunas
const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200", 
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-lg font-bold text-gray-900 mt-1 truncate">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg flex-shrink-0 ml-2 ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          {trend > 0 ? (
            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
          )}
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-500 ml-1">vs anterior</span>
        </div>
      )}
    </div>
  );
};

export default function DashboardAnalytics({ salesData, clientsData }) {
  // Calcular métricas principais
  const totalSales = salesData?.reduce((acc, sale) => acc + (sale.totalAfterDiscount || 0), 0) || 0;
  const totalOrders = salesData?.length || 0;
  const activeClients = clientsData?.length || 0;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Agrupar vendas por cliente
  const salesByClient = clientsData?.map(client => ({
    name: client.customerName || client.name || 'Cliente Sem Nome',
    value: salesData?.filter(sale => 
      sale.customName === client.customerName || 
      sale.customName === client.name
    ).reduce((acc, sale) => acc + (sale.totalAfterDiscount || 0), 0) || 0
  })).filter(client => client.value > 0).slice(0, 6) || [];

  // Vendas por categoria de produtos (simulado baseado nos produtos vendidos)
  const salesByCategory = salesData?.reduce((acc, sale) => {
    const products = sale.products || [];
    products.forEach(product => {
      const category = product.category || 'Outros';
      acc[category] = acc[category] || { name: category, value: 0 };
      acc[category].value += product.totalPrice || 0;
    });
    return acc;
  }, {}) || {};

  const categoryData = Object.values(salesByCategory).slice(0, 5);

  // Vendas por mês (últimos 6 meses simulados)
  const monthlySales = [
    { month: 'Jul', sales: totalSales * 0.7, orders: totalOrders * 0.8 },
    { month: 'Ago', sales: totalSales * 0.8, orders: totalOrders * 0.9 },
    { month: 'Set', sales: totalSales * 0.9, orders: totalOrders * 0.85 },
    { month: 'Out', sales: totalSales * 1.1, orders: totalOrders * 1.2 },
    { month: 'Nov', sales: totalSales * 0.95, orders: totalOrders * 1.1 },
    { month: 'Dez', sales: totalSales, orders: totalOrders }
  ];

  // Top produtos (simulado)
  const topProducts = salesData?.flatMap(sale => sale.products || [])
    .reduce((acc, product) => {
      const name = product.product || product.name || 'Produto';
      acc[name] = acc[name] || { name, quantity: 0, revenue: 0 };
      acc[name].quantity += product.quantity || 0;
      acc[name].revenue += product.totalPrice || 0;
      return acc;
    }, {}) || {};

  const topProductsData = Object.values(topProducts)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Seção de KPIs - 6 Colunas */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <AttachMoney className="mr-2 text-blue-600" />
          Indicadores de Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Vendas Totais"
            value={totalSales.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
            subtitle="Este mês"
            trend={8.2}
            icon={AttachMoney}
            color="green"
          />
          <MetricCard
            title="Pedidos"
            value={totalOrders.toString()}
            subtitle="Total de vendas"
            trend={12.5}
            icon={ShoppingCart}
            color="blue"
          />
          <MetricCard
            title="Clientes Ativos"
            value={activeClients.toString()}
            subtitle="Clientes cadastrados"
            trend={-2.4}
            icon={Group}
            color="purple"
          />
          <MetricCard
            title="Ticket Médio"
            value={avgOrderValue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
            subtitle="Por pedido"
            trend={5.7}
            icon={Inventory}
            color="orange"
          />
          <MetricCard
            title="Produtos Vendidos"
            value={topProductsData.reduce((acc, p) => acc + p.quantity, 0).toString()}
            subtitle="Unidades totais"
            trend={15.3}
            icon={Inventory}
            color="blue"
          />
          <MetricCard
            title="Receita Diária"
            value={(totalSales / 30).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
            subtitle="Média mensal"
            trend={3.8}
            icon={TrendingUp}
            color="green"
          />
        </div>
      </div>

      {/* Seção Principal - Layout em 4 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Coluna 1-2: Evolução das Vendas (Ocupa 2 colunas) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="mr-2 text-green-600" />
            Evolução das Vendas
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) : value,
                  name === 'sales' ? 'Vendas (MZN)' : 'Número de Pedidos'
                ]}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fill="url(#colorSales)" name="Vendas (MZN)" />
              <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} fill="url(#colorOrders)" name="Pedidos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Coluna 3: Top Produtos */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Inventory className="mr-2 text-orange-600" />
            Top Produtos
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={topProductsData} layout="horizontal" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value) => [value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }), 'Receita']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                {topProductsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Coluna 4: Vendas por Cliente */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Group className="mr-2 text-purple-600" />
            Vendas por Cliente
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie 
                data={salesByClient} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="45%" 
                outerRadius={140}
                innerRadius={70}
                paddingAngle={3}
                label={({value, percent}) => `${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {salesByClient.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }), 'Vendas']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={80}
                formatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seção Inferior - 3 Colunas Expandidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Vendas por Categoria */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <ShoppingCart className="mr-2 text-blue-600" />
            Vendas por Categoria
          </h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }} 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }), 'Vendas']}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex flex-col items-center justify-center text-gray-500">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-lg font-medium">Aguardando Dados</p>
              <p className="text-sm text-center mt-2">
                Categorias aparecerão quando<br/>
                produtos forem categorizados
              </p>
            </div>
          )}
        </div>

        {/* Análise de Quantidade vs Receita */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Inventory className="mr-2 text-green-600" />
            Quantidade vs Receita
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'quantity' ? `${value} unidades` : value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }),
                  name === 'quantity' ? 'Quantidade' : 'Receita'
                ]}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="quantity" fill="#f59e42" name="Quantidade" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Receita (MZN)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de Tickets */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <AttachMoney className="mr-2 text-indigo-600" />
            Distribuição de Tickets
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                data={[
                  { name: 'Baixo (< 1000 MZN)', value: Math.floor(totalOrders * 0.3), fill: '#ef4444' },
                  { name: 'Médio (1000-5000 MZN)', value: Math.floor(totalOrders * 0.5), fill: '#f59e42' },
                  { name: 'Alto (> 5000 MZN)', value: Math.floor(totalOrders * 0.2), fill: '#10b981' }
                ]} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={120}
                innerRadius={50}
                paddingAngle={5}
                label={({value, percent}) => `${value} (${(percent * 100).toFixed(1)}%)`}
                labelLine={false}
              >
                {[0, 1, 2].map((index) => (
                  <Cell key={`cell-ticket-${index}`} fill={['#ef4444', '#f59e42', '#10b981'][index]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} pedidos`, 'Quantidade']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={60}
                formatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
