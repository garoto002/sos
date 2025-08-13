"use client";
import { useEffect, useState } from "react";

export default function CustomersReportPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-16">Carregando relatório...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow">Relatório de Desalfandegamento</h1>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-100">
          <table className="w-full text-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-200 to-blue-100 text-indigo-900">
                <th className="p-3 text-left font-bold">Data</th>
                <th className="p-3 text-left font-bold">Tipo</th>
                <th className="p-3 text-left font-bold">Descrição</th>
                <th className="p-3 text-left font-bold">Valor</th>
                <th className="p-3 text-left font-bold">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-8">Nenhum registro de desalfandegamento.</td></tr>
              ) : (
                customers.map((customer, idx) => (
                  <tr key={customer._id} className={idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                    <td className="p-3 text-gray-700">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-indigo-700 font-bold">{customer.type}</td>
                    <td className="p-3">{customer.description}</td>
                    <td className="p-3 text-green-700 font-bold">{customer.value} MT</td>
                    <td className="p-3 text-gray-700">{customer.user?.firstName} {customer.user?.lastName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
