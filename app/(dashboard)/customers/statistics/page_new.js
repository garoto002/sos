"use client";
import { useEffect, useState } from "react";
import CustomersDashboardAnalytics from '../../../../components/CustomersDashboardAnalytics';

export default function CustomersStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [customersData, setCustomersData] = useState([]);
  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    // Buscar dados de desembaraços
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomersData(data.customers || data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar desembaraços:', error);
        setLoading(false);
      });

    // Buscar dados de clientes (extrair clientes únicos dos desembaraços)
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        const customers = data.customers || data || [];
        // Extrair clientes únicos dos desembaraços
        const uniqueClients = [...new Set(customers.map(customer => customer.cliente))].filter(Boolean);
        setClientsData(uniqueClients.map(cliente => ({ name: cliente, cliente })));
      })
      .catch(error => console.error('Erro ao buscar clientes:', error));
  }, []);

  if (loading) return <div className="text-center mt-16">Carregando estatísticas...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-emerald-700 text-center drop-shadow">
            Dashboard de Desembaraços
          </h1>
        </div>

        {/* Dashboard Analytics Moderno - Interface Completa para Customers */}
        <div className="mb-10">
          <CustomersDashboardAnalytics customersData={customersData} clientsData={clientsData} />
        </div>
      </div>
    </div>
  );
}
