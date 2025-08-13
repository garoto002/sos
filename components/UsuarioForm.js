import { useState } from "react";


export default function UsuarioForm({ empresaId, onSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empresaId, firstName, lastName, email, role, password: password || undefined }),
    });
    const data = await res.json();
    setIsLoading(false);
    setSuccess(true);
    if (data && data.generatedPassword) setGeneratedPassword(data.generatedPassword);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Novo Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Primeiro nome" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Último nome" value={lastName} onChange={e => setLastName(e.target.value)} required />
          <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <select className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="financeiro">Financeiro</option>
          </select>
          <input className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Senha (opcional)" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-full shadow-lg transition-all duration-300 font-semibold text-lg w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
        {success && <p className="text-green-600 mt-2 text-center">Usuário criado com sucesso!</p>}
        {generatedPassword && (
          <p className="text-blue-600 mt-2 text-center">Senha gerada: <span className="font-mono">{generatedPassword}</span></p>
        )}
      </form>
    </div>
  );
}
