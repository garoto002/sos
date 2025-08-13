"use client";

import { useEffect, useState } from "react";

export default function EmpresaDetails({ empresaId }) {
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/empresas/${empresaId}`)
      .then((res) => res.json())
      .then((data) => {
        setEmpresa(data.empresa);
        setIsLoading(false);
      });
  }, [empresaId]);

  if (isLoading) return <p>Carregando...</p>;
  if (!empresa) return <p>Empresa não encontrada.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{empresa.nome}</h2>
      <p className="mb-2">Email: {empresa.email}</p>
      <p>ID: {empresa._id}</p>
      {/* Adicione mais detalhes e ações administrativas aqui */}
    </div>
  );
}
