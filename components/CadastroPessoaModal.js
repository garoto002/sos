import React, { useState } from "react";

export default function CadastroPessoaModal({ open, onClose, onCadastrado }) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    foto: null,
    status: "perdido",
    ultimoLocal: "",
    roupa: "",
    contacto: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });
      const res = await fetch("/api/pessoas", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.pessoa) {
        setMessage("Cadastro realizado!");
        setForm({
          nome: "",
          descricao: "",
          foto: null,
          status: "perdido",
          ultimoLocal: "",
          roupa: "",
          contacto: ""
        });
        if (onCadastrado) onCadastrado(data.pessoa);
        setTimeout(onClose, 1000);
      } else {
        setMessage(data.error || "Erro ao cadastrar.");
      }
    } catch {
      setMessage("Erro de conexão.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-5 border border-zinc-700 animate-fadeIn"
        style={{ minWidth: 320 }}
      >
        <h2 className="text-2xl font-bold text-blue-400 mb-2 text-center">Cadastrar Pessoa</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            name="nome"
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white bg-zinc-800 placeholder-zinc-400"
          />
          <input
            name="descricao"
            type="text"
            placeholder="Descrição / características"
            value={form.descricao}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white bg-zinc-800 placeholder-zinc-400"
          />
          <input
            name="ultimoLocal"
            type="text"
            placeholder="Último local visto"
            value={form.ultimoLocal}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white bg-zinc-800 placeholder-zinc-400"
          />
          <input
            name="roupa"
            type="text"
            placeholder="Roupa / aparência"
            value={form.roupa}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white bg-zinc-800 placeholder-zinc-400"
          />
          <input
            name="contacto"
            type="text"
            placeholder="Contato para informações"
            value={form.contacto}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white bg-zinc-800 placeholder-zinc-400"
          />
          <input
            name="foto"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800 text-white file:text-white file:bg-blue-600 file:border-none file:rounded-lg"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800 text-white"
          >
            <option value="perdido">Perdido</option>
            <option value="achado">Achado</option>
          </select>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 text-white font-bold shadow hover:bg-zinc-600 transition"
          >
            Cancelar
          </button>
        </div>
        {message && (
          <div className="text-center text-blue-400 font-semibold mt-2 animate-fadeIn">
            {message}
          </div>
        )}
      </form>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
      `}</style>
    </div>
  );
}
