"use client";
import { useState } from "react";

export default function EmpresaForm({ onSuccess }) {
  const [nome, setNome] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch("/api/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, razaoSocial, cnpj, endereco, telefone, email }),
    });
    setIsLoading(false);
    setSuccess(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Nova Empresa</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2" placeholder="Nome fantasia" value={nome} onChange={e => setNome(e.target.value)} required />
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2" placeholder="Razão social" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} />
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2" placeholder="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)} />
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} />
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-full shadow-lg transition-all duration-300 font-semibold text-lg w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
        {success && <p className="text-green-600 mt-2 text-center">Empresa criada com sucesso!</p>}
      </form>
    </div>
  );
}
