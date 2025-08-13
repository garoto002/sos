"use client";
import { useEffect, useState } from "react";

export default function PurchaseReportPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/purchases')
      .then(res => res.json())
      .then(data => {
        setPurchases(data.purchases || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-16">Carregando relatório...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow">Relatório de Compras</h1>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-100">
          <table className="w-full text-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-200 to-blue-100 text-indigo-900">
                <th className="p-3 text-left font-bold">Data</th>
                <th className="p-3 text-left font-bold">Fornecedor</th>
                <th className="p-3 text-left font-bold">Produtos</th>
                <th className="p-3 text-left font-bold">Valor Total</th>
                <th className="p-3 text-left font-bold">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-8">Nenhuma compra registrada.</td></tr>
              ) : (
                purchases.map((purchase, idx) => (
                  <tr key={purchase._id} className={idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                    <td className="p-3 text-gray-700">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-indigo-700 font-bold">{purchase.supplierName}</td>
                    <td className="p-3">
                      <ul className="list-disc pl-4">
                        {purchase.products.map((prod, i) => (
                          <li key={i} className="text-blue-700 font-semibold">{prod.product} <span className="text-xs text-gray-500">({prod.quantity})</span></li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-green-700 font-bold">{purchase.totalAfterDiscount} MT</td>
                    <td className="p-3 text-gray-700">{purchase.user?.firstName} {purchase.user?.lastName}</td>
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
