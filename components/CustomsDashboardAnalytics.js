import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Group, LocalShipping, Inventory, AttachMoney, Assessment } from '@mui/icons-material';

const COLORS = ['#10b981', '#6366f1', '#f59e42', '#ef4444', '#f472b6', '#0ea5e9', '#a21caf'];

// Componente para cards de indicadores - design compacto para layout em colunas
const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    green: "bg-green-50 text-green-600 border-green-200", 
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200"
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

export default function CustomersDashboardAnalytics({ customersData, clientsData }) {
  // Calcular métricas principais
  const totalValue = customersData?.reduce((acc, customer) => acc + (customer.valorTotal || customer.value || 0), 0) || 0;
  const totalCustomers = customersData?.length || 0;
  const activeClients = clientsData?.length || 0;
  const avgCustomerValue = totalCustomers > 0 ? totalValue / totalCustomers : 0;

  // Desembaraços por cliente
  const customersByClient = clientsData?.map(client => ({
    name: client.name || client.cliente || 'Cliente Sem Nome',
    value: customersData?.filter(customer => 
      customer.cliente === client.name || 
      customer.cliente === client.cliente
    ).reduce((acc, customer) => acc + (customer.valorTotal || customer.value || 0), 0) || 0
  })).filter(client => client.value > 0).slice(0, 6) || [];

  // Desembaraços por tipo
  const customersByType = customersData?.reduce((acc, customer) => {
    const type = customer.tipo || customer.type || 'Outros';
    const typeName = type === 'importacao' ? 'Importação' : 
                    type === 'exportacao' ? 'Exportação' : 
                    type === 'transito' ? 'Trânsito' : type;
    acc[typeName] = acc[typeName] || { name: typeName, value: 0 };
    acc[typeName].value += customer.valorTotal || customer.value || 0;
    return acc;
  }, {}) || {};

  const typeData = Object.values(customersByType).slice(0, 5);

  // Desembaraços por status
  const customersByStatus = customersData?.reduce((acc, customer) => {
    const status = customer.status || 'Pendente';
    const statusName = status === 'pendente' ? 'Pendente' :
                      status === 'em_andamento' ? 'Em Andamento' :
                      status === 'concluido' ? 'Concluído' :
                      status === 'cancelado' ? 'Cancelado' : status;
    acc[statusName] = acc[statusName] || { name: statusName, value: 0, count: 0 };
    acc[statusName].value += custom.valorTotal || custom.value || 0;
    acc[statusName].count += 1;
    return acc;
  }, {}) || {};

  const statusData = Object.values(customersByStatus);

  // Desembaraços por mês (últimos 6 meses simulados)
  const monthlyCustomers = [
    { month: 'Jul', customers: totalValue * 0.7, count: totalCustomers * 0.8 },
    { month: 'Ago', customers: totalValue * 0.8, count: totalCustomers * 0.9 },
    { month: 'Set', customers: totalValue * 0.9, count: totalCustomers * 0.85 },
    { month: 'Out', customers: totalValue * 1.1, count: totalCustomers * 1.2 },
    { month: 'Nov', customers: totalValue * 0.95, count: totalCustomers * 1.1 },
    { month: 'Dez', customers: totalValue, count: totalCustomers }
  ];

  // Top tipos por quantidade
  const topTypes = Object.values(customersByType)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Seção de KPIs - 6 Colunas */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
        <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
          <Assessment className="mr-2" />
          Métricas Principais
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Total Desembaraços"
            value={totalCustomers.toLocaleString()}
            subtitle="processos"
            icon={LocalShipping}
            color="emerald"
            trend={5.2}
          />
          <MetricCard
            title="Valor Total"
            value={`${totalValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT`}
            subtitle="movimentação"
            icon={AttachMoney}
            color="green"
            trend={3.8}
          />
          <MetricCard
            title="Clientes Ativos"
            value={activeClients.toLocaleString()}
            subtitle="únicos"
            icon={Group}
            color="blue"
            trend={-1.2}
          />
          <MetricCard
            title="Valor Médio"
            value={`${avgCustomValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT`}
            subtitle="por processo"
            icon={Assessment}
            color="purple"
            trend={2.1}
          />
          <MetricCard
            title="Tipos Ativos"
            value={typeData.length.toLocaleString()}
            subtitle="categorias"
            icon={Inventory}
            color="orange"
          />
          <MetricCard
            title="Taxa Conclusão"
            value={`${statusData.find(s => s.name === 'Concluído')?.count || 0}/${totalCustomers}`}
            subtitle={`${totalCustomers > 0 ? Math.round(((statusData.find(s => s.name === 'Concluído')?.count || 0) / totalCustomers) * 100) : 0}%`}
            icon={TrendingUp}
            color="emerald"
            trend={4.5}
          />
        </div>
      </div>

      {/* Gráficos Principais - Layout 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Evolução Mensal - Linha Dupla */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-emerald-600" />
            Evolução dos Desembaraços
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyCustomers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => [
                name === 'customers' ? `${value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT` : value.toLocaleString(),
                name === 'customers' ? 'Valor' : 'Quantidade'
              ]} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="customers" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Valor Total" />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} name="Quantidade" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Tipo - Pizza */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Inventory className="mr-2 text-emerald-600" />
            Distribuição por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={value => `${value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status dos Processos - Barras */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Assessment className="mr-2 text-emerald-600" />
            Status dos Processos
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(value, name) => [
                name === 'value' ? `${value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT` : `${value} processos`,
                name === 'value' ? 'Valor Total' : 'Quantidade'
              ]} />
              <Bar dataKey="count" fill="#10b981" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clientes - Barras Horizontais */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Group className="mr-2 text-emerald-600" />
            Top Clientes
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={customersByClient} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={value => `${value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT`} />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo Estatístico */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo Estatístico</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{totalCustomers}</p>
            <p className="text-sm text-gray-600">Total de Processos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{totalValue.toLocaleString('pt-PT', { minimumFractionDigits: 0 })} MT</p>
            <p className="text-sm text-gray-600">Valor Movimentado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{typeData.length}</p>
            <p className="text-sm text-gray-600">Tipos de Processo</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{activeClients}</p>
            <p className="text-sm text-gray-600">Clientes Ativos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
