import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsuariosEmpresa({ empresaId }) {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/usuarios?empresaId=${empresaId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data.usuarios || []);
        setIsLoading(false);
      });
  }, [empresaId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-10 border border-blue-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extrabold mb-2 text-blue-900 drop-shadow">Usuários da Empresa</h2>
          {usuarios.length > 0 && (
            <p className="text-gray-600 text-lg">Empresa: <span className="font-semibold text-blue-700 text-xl">{usuarios[0].empresa || 'N/A'}</span></p>
          )}
        </div>
        <Link
          href={typeof window !== 'undefined' && window.location.pathname.includes('/superadmin')
            ? `/usuarios/create`
            : `/users/create`}
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg flex items-center gap-2"
        >
          <span className="material-icons">person_add</span>
          + Novo Usuário
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></span>
          <span className="ml-4 text-gray-500">Carregando...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-blue-200 rounded-2xl overflow-hidden shadow-xl">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900">
                <th className="p-4 text-left text-lg font-semibold">Nome</th>
                <th className="p-4 text-left text-lg font-semibold">Email</th>
                <th className="p-4 text-left text-lg font-semibold">Permissão</th>
                <th className="p-4 text-left text-lg font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id} className="border-t border-blue-100 hover:bg-blue-50 transition-all duration-200">
                  <td className="p-4 font-medium text-blue-900">{usuario.firstName} {usuario.lastName}</td>
                  <td className="p-4 text-blue-700">{usuario.email}</td>
                  <td className="p-4 capitalize text-blue-600 font-semibold">{usuario.role}</td>
                  <td className="p-4 flex gap-4">
                    <Link href={`/superadmin/empresas/${empresaId}/usuarios/${usuario._id}`} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow hover:bg-blue-200 transition">Ver</Link>
                    <Link href={`/superadmin/empresas/${empresaId}/usuarios/${usuario._id}/edit`} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full shadow hover:bg-yellow-200 transition">Editar</Link>
                    <button
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full shadow hover:bg-red-200 transition"
                      onClick={async () => {
                        if (confirm('Tem certeza que deseja excluir este usuário?')) {
                          await fetch(`/api/usuarios/${usuario._id}?empresaId=${empresaId}`, { method: 'DELETE' });
                          window.location.reload();
                        }
                      }}
                    >Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
