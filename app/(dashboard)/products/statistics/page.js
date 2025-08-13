"use client";
import { useEffect, useState } from "react";
import ProductsDashboardAnalytics from '../../../../components/ProductsDashboardAnalytics';

export default function ProductsStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Buscar dados de produtos
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProductsData(data.products || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
      });

    // Buscar dados de vendas para análises relacionadas
    fetch('/api/sales')
      .then(res => res.json())
      .then(data => {
        setSalesData(data.sales || []);
      })
      .catch(error => console.error('Erro ao buscar vendas:', error));
  }, []);

  if (loading) return <div className="text-center mt-16">Carregando estatísticas...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-indigo-700 text-center drop-shadow">
            Dashboard de Produtos
          </h1>
        </div>

        {/* Dashboard Analytics Moderno - Interface Completa */}
        <div className="mb-10">
          <ProductsDashboardAnalytics productsData={productsData} salesData={salesData} />
        </div>
      </div>
    </div>
  );
}