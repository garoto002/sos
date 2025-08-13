"use client";

import { useEffect, useState } from "react";

export default function UsuarioDetails({ empresaId, usuarioId }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/usuarios/${usuarioId}?empresaId=${empresaId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data.usuario);
        setIsLoading(false);
      });
  }, [empresaId, usuarioId]);

  if (isLoading) return <p>Carregando...</p>;
  if (!usuario) return <p>Usuário não encontrado.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{usuario.firstName} {usuario.lastName}</h2>
      <p className="mb-2">Email: {usuario.email}</p>
      <p>Permissão: {usuario.role}</p>
      <p>ID: {usuario._id}</p>
      {/* Adicione mais ações administrativas aqui */}
    </div>
  );
}
