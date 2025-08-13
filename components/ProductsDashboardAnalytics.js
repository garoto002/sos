import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Inventory, Category, LocalShipping, AttachMoney, Warning, CheckCircle } from '@mui/icons-material';
import { useState } from 'react';

const COLORS = ['#6366f1', '#10b981', '#f59e42', '#ef4444', '#f472b6', '#0ea5e9', '#a21caf'];

// Componente para cards de indicadores
const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200", 
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-red-50 text-red-600 border-red-200"
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
      {trend !== undefined && (
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

export default function ProductsDashboardAnalytics({ productsData, salesData }) {
  const [activeChart, setActiveChart] = useState('categories');

  // Calcular métricas principais
  const totalProducts = productsData?.length || 0;
  const totalStock = productsData?.reduce((acc, product) => acc + (product.stock || 0), 0) || 0;
  const totalValue = productsData?.reduce((acc, product) => acc + ((product.price || 0) * (product.stock || 0)), 0) || 0;
  const avgPrice = totalProducts > 0 ? productsData.reduce((acc, product) => acc + (product.price || 0), 0) / totalProducts : 0;
  
  // Produtos com estoque baixo (<=5)
  const lowStockProducts = productsData?.filter(product => (product.stock || 0) <= 5) || [];
  const lowStockCount = lowStockProducts.length;
  
  // Produtos sem estoque
  const outOfStockProducts = productsData?.filter(product => (product.stock || 0) === 0) || [];
  const outOfStockCount = outOfStockProducts.length;

  // Análise por categorias
  const categoriesStats = {};
  productsData?.forEach(product => {
    const category = product.category || 'Sem categoria';
    if (!categoriesStats[category]) {
      categoriesStats[category] = {
        count: 0,
        totalStock: 0,
        totalValue: 0,
        avgPrice: 0
      };
    }
    categoriesStats[category].count++;
    categoriesStats[category].totalStock += product.stock || 0;
    categoriesStats[category].totalValue += (product.price || 0) * (product.stock || 0);
    categoriesStats[category].avgPrice += product.price || 0;
  });

  // Finalizar cálculos de categorias
  Object.keys(categoriesStats).forEach(category => {
    categoriesStats[category].avgPrice = categoriesStats[category].avgPrice / categoriesStats[category].count;
  });

  const categoriesData = Object.entries(categoriesStats).map(([name, stats]) => ({
    name,
    count: stats.count,
    totalStock: stats.totalStock,
    totalValue: stats.totalValue,
    avgPrice: stats.avgPrice
  }));

  // Análise por fornecedores
  const suppliersStats = {};
  productsData?.forEach(product => {
    const supplier = product.supplier || 'Sem fornecedor';
    if (!suppliersStats[supplier]) {
      suppliersStats[supplier] = {
        count: 0,
        totalValue: 0
      };
    }
    suppliersStats[supplier].count++;
    suppliersStats[supplier].totalValue += (product.price || 0) * (product.stock || 0);
  });

  const suppliersData = Object.entries(suppliersStats).map(([name, stats]) => ({
    name,
    count: stats.count,
    totalValue: stats.totalValue
  })).sort((a, b) => b.totalValue - a.totalValue).slice(0, 10);

  // Análise de produtos mais valiosos
  const topValueProducts = productsData
    ?.map(product => ({
      name: product.name,
      value: (product.price || 0) * (product.stock || 0),
      stock: product.stock || 0,
      price: product.price || 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) || [];

  // Distribuição de estoque
  const stockDistribution = [
    { name: 'Sem Estoque', count: outOfStockCount, color: '#ef4444' },
    { name: 'Estoque Baixo (1-5)', count: productsData?.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length || 0, color: '#f59e42' },
    { name: 'Estoque Médio (6-20)', count: productsData?.filter(p => (p.stock || 0) > 5 && (p.stock || 0) <= 20).length || 0, color: '#10b981' },
    { name: 'Estoque Alto (>20)', count: productsData?.filter(p => (p.stock || 0) > 20).length || 0, color: '#6366f1' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const chartOptions = [
    { key: 'categories', label: 'Por Categoria', chart: 'bar' },
    { key: 'suppliers', label: 'Por Fornecedor', chart: 'pie' },
    { key: 'topProducts', label: 'Mais Valiosos', chart: 'bar' },
    { key: 'stockDist', label: 'Distribuição de Estoque', chart: 'pie' }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'categories':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'totalValue' ? formatCurrency(value) : value,
                name === 'count' ? 'Produtos' : name === 'totalValue' ? 'Valor Total' : 'Estoque Total'
              ]} />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" name="Produtos" />
              <Bar dataKey="totalStock" fill="#10b981" name="Estoque Total" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'suppliers':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={suppliersData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => `${entry.name}: ${entry.count}`}
              >
                {suppliersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'topProducts':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topValueProducts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#f59e42" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'stockDist':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockDistribution}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.count}`}
              >
                {stockDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total de Produtos"
          value={totalProducts.toLocaleString('pt-PT')}
          icon={Inventory}
          color="blue"
        />
        <MetricCard
          title="Estoque Total"
          value={totalStock.toLocaleString('pt-PT')}
          subtitle="unidades"
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Valor Total"
          value={formatCurrency(totalValue)}
          subtitle="em estoque"
          icon={AttachMoney}
          color="purple"
        />
        <MetricCard
          title="Preço Médio"
          value={formatCurrency(avgPrice)}
          icon={AttachMoney}
          color="blue"
        />
        <MetricCard
          title="Estoque Baixo"
          value={lowStockCount}
          subtitle="≤ 5 unidades"
          icon={Warning}
          color="orange"
        />
        <MetricCard
          title="Sem Estoque"
          value={outOfStockCount}
          subtitle="produtos"
          icon={Warning}
          color="red"
        />
      </div>

      {/* Gráficos Interativos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {chartOptions.map(option => (
            <button
              key={option.key}
              onClick={() => setActiveChart(option.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeChart === option.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <div className="h-80">
          {renderChart()}
        </div>
      </div>

      {/* Tabelas de Detalhes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Produtos por Valor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Produtos Mais Valiosos</h3>
          <div className="space-y-3">
            {topValueProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.stock} unidades × {formatCurrency(product.price)}</p>
                </div>
                <p className="font-bold text-green-600">{formatCurrency(product.value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos com Estoque Baixo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos com Estoque Baixo</h3>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category || 'Sem categoria'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{product.stock || 0} un.</p>
                  <p className="text-sm text-gray-600">{formatCurrency(product.price || 0)}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum produto com estoque baixo</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
