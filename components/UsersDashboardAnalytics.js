"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  Person,
  Group,
  AdminPanelSettings,
  CheckCircle,
  Cancel,
  Business
} from '@mui/icons-material';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

export default function UsersDashboardAnalytics({ users = [] }) {
  
  // Calcular KPIs
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ativo').length;
  const inactiveUsers = users.filter(u => u.status === 'inativo').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const regularUsers = users.filter(u => u.role === 'user').length;
  const totalCompanies = [...new Set(users.map(u => u.company))].filter(c => c).length;

  // Evolução mensal de cadastros
  const monthlyData = users.reduce((acc, user) => {
    const date = new Date(user.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, total: 0, admins: 0, users: 0 };
    }
    
    acc[monthKey].total += 1;
    if (user.role === 'admin') acc[monthKey].admins += 1;
    if (user.role === 'user') acc[monthKey].users += 1;
    
    return acc;
  }, {});

  const evolutionData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  // Distribuição por função
  const roleData = [
    { name: 'Administradores', value: adminUsers, color: '#8b5cf6' },
    { name: 'Usuários', value: regularUsers, color: '#3b82f6' }
  ].filter(item => item.value > 0);

  // Distribuição por status
  const statusData = [
    { name: 'Ativos', value: activeUsers, color: '#10b981' },
    { name: 'Inativos', value: inactiveUsers, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Top empresas
  const companyData = users.reduce((acc, user) => {
    const company = user.company || 'Sem empresa';
    acc[company] = (acc[company] || 0) + 1;
    return acc;
  }, {});

  const topCompanies = Object.entries(companyData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Usuários por tipo de conta
  const accountTypeData = users.reduce((acc, user) => {
    const type = user.role === 'admin' ? 'Administradores' : 'Usuários Comuns';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const accountChartData = Object.entries(accountTypeData).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Group className="text-blue-600 text-5xl" />
            Dashboard de Usuários
          </h1>
          <p className="text-gray-600 text-lg">
            Análise completa e estatísticas dos usuários do sistema
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Usuários</p>
                <p className="text-3xl font-bold">{totalUsers}</p>
              </div>
              <Group className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Usuários Ativos</p>
                <p className="text-3xl font-bold">{activeUsers}</p>
              </div>
              <CheckCircle className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Usuários Inativos</p>
                <p className="text-3xl font-bold">{inactiveUsers}</p>
              </div>
              <Cancel className="text-4xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Administradores</p>
                <p className="text-3xl font-bold">{adminUsers}</p>
              </div>
              <AdminPanelSettings className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Usuários Comuns</p>
                <p className="text-3xl font-bold">{regularUsers}</p>
              </div>
              <Person className="text-4xl text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">Total de Empresas</p>
                <p className="text-3xl font-bold">{totalCompanies}</p>
              </div>
              <Business className="text-4xl text-cyan-200" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Evolução Mensal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart className="text-blue-600" />
              Evolução de Cadastros
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => `Mês: ${value}`}
                  formatter={(value, name) => [value, name === 'total' ? 'Total' : name === 'admins' ? 'Admins' : 'Usuários']}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="admins" 
                  stackId="2"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição por Função */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="text-blue-600" />
              Usuários por Função
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segunda linha de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status dos Usuários */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-blue-600" />
              Status dos Usuários
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [value, 'Quantidade']}
                  labelFormatter={(value) => `Status: ${value}`}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Empresas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Business className="text-blue-600" />
              Top 5 Empresas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCompanies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [value, 'Usuários']}
                  labelFormatter={(value) => `Empresa: ${value}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
