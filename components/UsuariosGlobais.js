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
        setUsuarios(Array.isArray(data.users) ? data.users.map(user => ({
          ...user,
          status: user.status || 'active' // garante que status tem um valor padrão
        })) : []);
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
          setEmpresas((data.empresas || []).map(empresa => ({
            ...empresa,
            status: empresa.status || 'active' // garante que status tem um valor padrão
          })));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Gestão de Usuários
              </h2>
              <p className="text-gray-600 mt-1">Gerencie usuários e suas permissões no sistema</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/superadmin/empresas/create" 
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Nova Empresa
              </Link>
              <button 
                onClick={() => setShowUserForm(true)} 
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Usuário
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Empresas Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Empresas Cadastradas
                  </h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {empresas.length}
                  </span>
                </div>
                
                {empresas && empresas.length > 0 ? (
                  <div className="space-y-3">
                    {empresas.map((empresa) => (
                      <div key={empresa._id} className={`p-4 rounded-xl transition-colors ${
                        (empresa.status || 'active') === 'inactive' 
                          ? 'bg-gray-100 hover:bg-gray-200 opacity-75' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        {empresa.coverImage?.url && (
                          <div className="mb-4 -mx-4 -mt-4">
                            <div className="relative h-24 overflow-hidden rounded-t-xl">
                              <img
                                src={empresa.coverImage.url}
                                alt={empresa.coverImage.alt || `Capa de ${empresa.nome}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${
                              (empresa.status || 'active') === 'inactive' 
                                ? 'bg-gray-100' 
                                : 'bg-indigo-100'
                            }`}>
                              {empresa.logo?.url ? (
                                <img
                                  src={empresa.logo.url}
                                  alt={empresa.logo.alt || `Logo de ${empresa.nome}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className={`font-semibold text-lg ${
                                  (empresa.status || 'active') === 'inactive' 
                                    ? 'text-gray-600' 
                                    : 'text-indigo-600'
                                }`}>
                                  {empresa.nome?.[0]?.toUpperCase() || '?'}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {empresa.nome || 'Sem nome'}
                                </p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  (empresa.status || 'active') === 'inactive' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {(empresa.status || 'active') === 'inactive' ? 'Inativa' : 'Ativa'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {empresa.email || 'Sem email'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const currentStatus = empresa.status || 'active';
                                const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
                                fetch(`/api/empresas/${empresa._id}/status`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ status: newStatus }),
                                }).then(res => {
                                  if (res.ok) window.location.reload();
                                  else alert('Erro ao alterar status da empresa.');
                                });
                              }}
                              className={`text-sm font-medium ${
                                (empresa.status || 'active') === 'active'
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {(empresa.status || 'active') === 'active' ? 'Desativar' : 'Ativar'}
                            </button>
                            <Link
                              href={`/superadmin/empresas/${empresa._id}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma empresa</h3>
                    <p className="mt-1 text-sm text-gray-500">Comece adicionando uma nova empresa ao sistema.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Users Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Usuários do Sistema
                  </h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {usuarios.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {usuarios.length === 0 ? (
                    <div className="text-center py-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário</h3>
                      <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo usuário ao sistema.</p>
                    </div>
                  ) : (
                    usuarios.map(user => (
                      <div key={user._id} className={`p-4 rounded-xl transition-colors ${
                        (user.status || 'active') === 'inactive' 
                          ? 'bg-gray-100 hover:bg-gray-200 opacity-75' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              (user.status || 'active') === 'inactive' 
                                ? 'bg-gray-100' 
                                : 'bg-indigo-100'
                            }`}>
                              <span className={`font-semibold text-lg ${
                                (user.status || 'active') === 'inactive' 
                                  ? 'text-gray-600' 
                                  : 'text-indigo-600'
                              }`}>
                                {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {user.role}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  (user.status || 'active') === 'inactive' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {(user.status || 'active') === 'inactive' ? 'Inativo' : 'Ativo'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link 
                              href={`/superadmin/usuarios/${user._id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Detalhes
                            </Link>
                            <Link 
                              href={`/superadmin/usuarios/${user._id}/edit`}
                              className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => {
                                const currentStatus = user.status || 'active';
                                const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
                                fetch(`/api/users/${user._id}/status`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ status: newStatus }),
                                }).then(res => {
                                  if (res.ok) window.location.reload();
                                  else alert('Erro ao alterar status do usuário.');
                                });
                              }}
                              className={`text-sm font-medium ${
                                (user.status || 'active') === 'active'
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {(user.status || 'active') === 'active' ? 'Desativar' : 'Ativar'}
                            </button>
                            <button 
                              onClick={() => handleDelete(user._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Deletar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Form Modal */}
        {showUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button 
                onClick={() => setShowUserForm(false)} 
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4">Criar Novo Usuário</h3>
              <label className="block mb-2 font-semibold">Empresa</label>
              <select 
                className="border p-2 w-full mb-4" 
                value={selectedEmpresa} 
                onChange={e => setSelectedEmpresa(e.target.value)} 
                required
              >
                <option value="">Selecione a empresa</option>
                {empresas.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.nome || emp.razaoSocial || emp._id}
                  </option>
                ))}
              </select>
              {selectedEmpresa && (
                <UsuarioForm 
                  empresaId={selectedEmpresa} 
                  onSuccess={() => { 
                    setShowUserForm(false); 
                    window.location.reload(); 
                  }} 
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}