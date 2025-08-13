import { useState, useEffect } from "react";

export default function UsuarioEditForm({ empresaId, usuarioId }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Editar Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Primeiro nome" name="firstName" value={usuario?.firstName || ''} onChange={handleChange} required />
          <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Último nome" name="lastName" value={usuario?.lastName || ''} onChange={handleChange} required />
          <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Email" name="email" value={usuario?.email || ''} onChange={handleChange} required />
          <select className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" name="role" value={usuario?.role || ''} onChange={handleChange} required>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="financeiro">Financeiro</option>
            <option value="estoque">Estoque</option>
          </select>
        </div>
        <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-full shadow-lg transition-all duration-300 font-semibold text-lg w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
        {success && <p className="text-green-600 mt-2 text-center">Usuário atualizado com sucesso!</p>}
      </form>
    </div>
  );
}
