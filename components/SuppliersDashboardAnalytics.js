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
  LocalShipping,
  Business,
  Person,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#ddd6fe', '#ede9fe', '#f3f4f6'];

export default function SuppliersDashboardAnalytics({ suppliers = [] }) {
  
  // Calcular KPIs
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'ativo').length;
  const inactiveSuppliers = suppliers.filter(s => s.status === 'inativo').length;
  const companiesWithMultipleSuppliers = [...new Set(suppliers.map(s => s.company))].filter(company => 
    suppliers.filter(s => s.company === company).length > 1
  ).length;
  const totalCompanies = [...new Set(suppliers.map(s => s.company))].length;
  const avgSuppliersPerCompany = totalCompanies > 0 ? (totalSuppliers / totalCompanies).toFixed(1) : 0;

  // Evolução mensal de cadastros
  const monthlyData = suppliers.reduce((acc, supplier) => {
    const date = new Date(supplier.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, total: 0, active: 0, inactive: 0 };
    }
    
    acc[monthKey].total += 1;
    if (supplier.status === 'ativo') acc[monthKey].active += 1;
    if (supplier.status === 'inativo') acc[monthKey].inactive += 1;
    
    return acc;
  }, {});

  const evolutionData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  // Distribuição por categoria
  const categoryData = suppliers.reduce((acc, supplier) => {
    const category = supplier.category || 'Sem categoria';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Distribuição por status
  const statusData = [
    { name: 'Ativos', value: activeSuppliers, color: '#10b981' },
    { name: 'Inativos', value: inactiveSuppliers, color: '#ef4444' },
    { name: 'Pendentes', value: suppliers.filter(s => s.status === 'pendente').length, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  // Top países
  const countryData = suppliers.reduce((acc, supplier) => {
    const country = supplier.country || 'Não informado';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <LocalShipping className="text-purple-600 text-5xl" />
            Dashboard de Fornecedores
          </h1>
          <p className="text-gray-600 text-lg">
            Análise completa e estatísticas dos fornecedores cadastrados
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total de Fornecedores</p>
                <p className="text-3xl font-bold">{totalSuppliers}</p>
              </div>
              <LocalShipping className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Fornecedores Ativos</p>
                <p className="text-3xl font-bold">{activeSuppliers}</p>
              </div>
              <Person className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Fornecedores Inativos</p>
                <p className="text-3xl font-bold">{inactiveSuppliers}</p>
              </div>
              <Person className="text-4xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Empresas</p>
                <p className="text-3xl font-bold">{totalCompanies}</p>
              </div>
              <Business className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Empresas c/ Múltiplos</p>
                <p className="text-3xl font-bold">{companiesWithMultipleSuppliers}</p>
              </div>
              <Business className="text-4xl text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Média por Empresa</p>
                <p className="text-3xl font-bold">{avgSuppliersPerCompany}</p>
              </div>
              <LocalShipping className="text-4xl text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Evolução Mensal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart className="text-purple-600" />
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
                  formatter={(value, name) => [value, name === 'total' ? 'Total' : name === 'active' ? 'Ativos' : 'Inativos']}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stackId="1"
                  stroke="#7c3aed" 
                  fill="#7c3aed" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição por Categoria */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="text-purple-600" />
              Fornecedores por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segunda linha de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status dos Fornecedores */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Person className="text-purple-600" />
              Status dos Fornecedores
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

          {/* Top Países */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LocationOn className="text-purple-600" />
              Top 5 Países
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCountries}>
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
                  formatter={(value, name) => [value, 'Fornecedores']}
                  labelFormatter={(value) => `País: ${value}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="#7c3aed" 
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
