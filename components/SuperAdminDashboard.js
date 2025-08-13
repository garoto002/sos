"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/empresas")
      .then((res) => res.json())
      .then((data) => {
        setEmpresas(data.empresas || []);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Painel do Super Admin</h1>
      <Link href="/superadmin/empresas/create" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Nova Empresa</Link>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nome</th>
              <th className="p-2">Email</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa._id} className="border-t">
                <td className="p-2">{empresa.nome}</td>
                <td className="p-2">{empresa.email}</td>
                <td className="p-2">
                  <Link href={`/superadmin/empresas/${empresa._id}`}>Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
