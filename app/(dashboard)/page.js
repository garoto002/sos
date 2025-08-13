"use client";
import { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Home() {
  const { data: session } = useSession();
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Buscar dados de vendas
    fetch("/api/sales")
      .then(response => response.json())
      .then(data => {
        const chartData = data.sales.map(sale => ({
          name: new Date(sale.createdAt),
          totalSales: sale.subtotal,
          category: sale.category,
        }));
        setSalesData(chartData);
      })
      .catch(error => console.error('Erro ao buscar os dados do gráfico de vendas:', error));
    // Buscar produtos
    fetch("/api/products")
      .then(response => response.json())
      .then(data => setProducts(data.products || []))
      .catch(error => console.error('Erro ao buscar produtos:', error));
    // Buscar fornecedores
    fetch("/api/suppliers")
      .then(response => response.json())
      .then(data => setSuppliers(data.suppliers || []))
      .catch(error => console.error('Erro ao buscar fornecedores:', error));
    // Buscar usuários
    fetch("/api/users")
      .then(response => response.json())
      .then(data => setUsers(data.users || []))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  // Faturamento total
  const totalFaturamento = salesData.reduce((acc, sale) => acc + (sale.totalSales || 0), 0);
  // Produtos com estoque baixo
  const lowStockProducts = products.filter(p => p.quantityInStock < p.stockMinimum);
  // Top produtos vendidos (por quantidade)
  const productSalesCount = {};
  salesData.forEach(sale => {
    if (sale.products && Array.isArray(sale.products)) {
      sale.products.forEach(item => {
        productSalesCount[item.product] = (productSalesCount[item.product] || 0) + item.quantity;
      });
    }
  });
  const topProducts = Object.entries(productSalesCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="flex flex-col items-center mb-8">
        <Image 
          src="/images/logo-sistema-empresarial.png" 
          width={120} 
          height={120} 
          className="bg-zinc-900 block mx-auto p-2 rounded-md"
          alt="Logo"
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Olá, {session?.user.name}!</h1>
        <p className="text-gray-500">Bem-vindo ao seu painel de Gestão de Vendas</p>
      </div>

      {/* Atalhos rápidos */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <a href="/sales/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Nova Venda</a>
        <a href="/products/create" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Novo Produto</a>
        <a href="/suppliers/create" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Novo Fornecedor</a>
        <a href="/users/create" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Novo Usuário</a>
        <a href="/sales-report" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Relatório de Vendas</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Vendas</span>
          <span className="text-2xl font-bold text-indigo-600">{salesData.length}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Produtos</span>
          <span className="text-2xl font-bold text-green-600">{products.length}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Fornecedores</span>
          <span className="text-2xl font-bold text-yellow-500">{suppliers.length}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Usuários</span>
          <span className="text-2xl font-bold text-pink-500">{users.length}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Faturamento Total</span>
          <span className="text-2xl font-bold text-blue-500">MZN {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Card de produtos com estoque baixo */}
      {lowStockProducts.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl shadow flex flex-col md:flex-row items-center justify-between">
          <span className="text-red-700 font-semibold">Produtos com estoque baixo:</span>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            {lowStockProducts.map(p => (
              <span key={p._id} className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">{p.name} ({p.quantityInStock})</span>
            ))}
          </div>
        </div>
      )}
      {/* Gráfico de top produtos vendidos */}
      {topProducts.length > 0 && (
        <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Produtos Vendidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#f59e42" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de evolução de vendas */}
      <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Evolução das Vendas</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={salesData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tickFormatter={date => new Date(date).toLocaleDateString()} tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip labelFormatter={date => new Date(date).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="totalSales" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} fillOpacity={1} fill="url(#colorSales)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de vendas por mês */}
      <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Vendas por Mês</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={(() => {
              // Agrupa vendas por mês/ano
              const monthly = {};
              salesData.forEach(sale => {
                const d = new Date(sale.name);
                const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
                monthly[key] = (monthly[key] || 0) + (sale.totalSales || 0);
              });
              return Object.entries(monthly).map(([name, total]) => ({ name, total }));
            })()}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
