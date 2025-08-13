"use client";
import { useEffect, useState } from "react";

export default function SuppliersReportPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/suppliers')
      .then(res => res.json())
      .then(data => {
        setSuppliers(data.suppliers || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-16">Carregando relatório...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow">Relatório de Fornecedores</h1>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-100">
          <table className="w-full text-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-200 to-blue-100 text-indigo-900">
                <th className="p-3 text-left font-bold">Nome</th>
                <th className="p-3 text-left font-bold">Telefone</th>
                <th className="p-3 text-left font-bold">Email</th>
                <th className="p-3 text-left font-bold">Total de Compras</th>
                <th className="p-3 text-left font-bold">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-8">Nenhum fornecedor registrado.</td></tr>
              ) : (
                suppliers.map((supplier, idx) => {
                  const totalPurchases = (supplier.purchases || []).length;
                  const totalValue = (supplier.purchases || []).reduce((acc, p) => acc + (p.totalAfterDiscount || 0), 0);
                  return (
                    <tr key={supplier._id} className={idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                      <td className="p-3 text-indigo-700 font-bold">{supplier.supplierName || supplier.name}</td>
                      <td className="p-3">{supplier.phone}</td>
                      <td className="p-3">{supplier.email}</td>
                      <td className="p-3 text-blue-700 font-bold">{totalPurchases}</td>
                      <td className="p-3 text-green-700 font-bold">{totalValue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
