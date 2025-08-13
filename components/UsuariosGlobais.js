"use client";
import { useEffect, useState } from 'react';
import UsuarioForm from './UsuarioForm';
import Link from 'next/link';

export default function UsuariosGlobais() {
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsuarios(Array.isArray(data.users) ? data.users : []);
        setLoading(false);
      })
      .catch(() => {
        setUsuarios([]);
        setLoading(false);
      });
    fetch('/api/empresas')
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setEmpresas(data.empresas || []);
        } else {
          setEmpresas([]);
        }
      });
  }, []);

  function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      fetch(`/api/users/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) window.location.reload();
          else alert('Erro ao deletar usuário.');
        });
    }
  }

  return (

    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Gestão de Empresas e Usuários</h2>
        <div className="flex gap-2">
          <Link href="/superadmin/empresas/create" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow">Nova Empresa</Link>
          <button onClick={() => setShowUserForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow">Novo Usuário</button>
        </div>
      </div>

      {/* Nova seção: Empresas cadastradas */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h3 className="text-lg font-bold mb-4 text-indigo-700">Empresas Cadastradas</h3>
        {empresas && empresas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">CNPJ</th>
                  <th className="px-4 py-2 text-left">E-mail</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa._id} className="border-b">
                    <td className="px-4 py-2">{empresa.nome}</td>
                    <td className="px-4 py-2">{empresa.cnpj}</td>
                    <td className="px-4 py-2">{empresa.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma empresa cadastrada.</p>
        )}
      </div>

      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowUserForm(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl">&times;</button>
            <h3 className="text-lg font-bold mb-4">Criar Novo Usuário</h3>
            <label className="block mb-2 font-semibold">Empresa</label>
            <select className="border p-2 w-full mb-4" value={selectedEmpresa} onChange={e => setSelectedEmpresa(e.target.value)} required>
              <option value="">Selecione a empresa</option>
              {empresas.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.nome || emp.razaoSocial || emp._id}</option>
              ))}
            </select>
            {selectedEmpresa && <UsuarioForm empresaId={selectedEmpresa} onSuccess={() => { setShowUserForm(false); window.location.reload(); }} />}
          </div>
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {loading ? (
          <li>Carregando...</li>
        ) : usuarios.length === 0 ? (
          <li className="text-gray-500 py-4 text-center">Nenhum usuário encontrado.</li>
        ) : (
          usuarios.map(user => (
            <li key={user._id} className="py-4 flex justify-between items-center">
              <span>{user.firstName} {user.lastName} <span className="text-gray-500 text-sm">({user.email})</span> <span className="text-xs bg-gray-200 rounded px-2 ml-2">{user.role}</span></span>
              <div>
                <Link href={`/superadmin/usuarios/${user._id}`} className="text-blue-600 hover:underline mr-4">Detalhes</Link>
                <Link href={`/superadmin/usuarios/${user._id}/edit`} className="text-yellow-600 hover:underline mr-4">Editar</Link>
                <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">Deletar</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
