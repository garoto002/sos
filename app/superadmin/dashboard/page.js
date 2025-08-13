"use client";


import SuperadminStatsCard from "@/components/SuperadminStatsCard";
import { PieChartSVG, BarChartSVG } from "@/components/SuperadminSVGCharts";
import { useEffect, useState } from "react";

export default function SuperadminDashboard() {
  const [stats, setStats] = useState(null);
  const [usersEvolution, setUsersEvolution] = useState([]);
  const [usersByEmpresa, setUsersByEmpresa] = useState([]);
  const [usersByStatus, setUsersByStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminsByEmpresa, setAdminsByEmpresa] = useState([]);
  const [adminsEvolution, setAdminsEvolution] = useState([]);
  const [adminsByStatus, setAdminsByStatus] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);

  useEffect(() => {
    fetch("/api/superadmin/dashboard")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Erro ao buscar estatísticas");
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
        // Evolução de usuários cadastrados (últimos 30)
        if (data.users && Array.isArray(data.users)) {
          const sorted = [...data.users].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setUsersEvolution(
            sorted.slice(-30).map((user) => ({
              label: new Date(user.createdAt).toLocaleDateString("pt-BR"),
              value: 1,
            }))
          );
          // Por empresa
          const byEmpresa = {};
          sorted.forEach((user) => {
            const empresa = user.empresaName || user.empresaId || "?";
            byEmpresa[empresa] = (byEmpresa[empresa] || 0) + 1;
          });
          setUsersByEmpresa(Object.entries(byEmpresa).map(([label, value]) => ({ label, value })));
          // Por status
          const byStatus = {};
          let active = 0, inactive = 0;
          sorted.forEach((user) => {
            const status = user.status || "ativo";
            byStatus[status] = (byStatus[status] || 0) + 1;
            if (status === "ativo") active++;
            else inactive++;
          });
          setUsersByStatus(Object.entries(byStatus).map(([label, value]) => ({ label, value })));
          setActiveUsers(active);
          setInactiveUsers(inactive);
        }
        // Empresas
        if (data.empresas && Array.isArray(data.empresas)) {
          setTotalEmpresas(data.empresas.length);
        }
        // Admins por empresa, evolução e status
        if (data.users && Array.isArray(data.users)) {
          const admins = data.users.filter(u => u.role === 'admin');
          // Por empresa
          const byEmpresa = {};
          admins.forEach((admin) => {
            const empresa = admin.empresaName || admin.empresaId || "?";
            byEmpresa[empresa] = (byEmpresa[empresa] || 0) + 1;
          });
          setAdminsByEmpresa(Object.entries(byEmpresa).map(([label, value]) => ({ label, value })));
          // Evolução
          const sortedAdmins = [...admins].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setAdminsEvolution(
            sortedAdmins.slice(-30).map((admin) => ({
              label: new Date(admin.createdAt).toLocaleDateString("pt-BR"),
              value: 1,
            }))
          );
          // Por status
          const byStatus = {};
          sortedAdmins.forEach((admin) => {
            const status = admin.status || "ativo";
            byStatus[status] = (byStatus[status] || 0) + 1;
          });
          setAdminsByStatus(Object.entries(byStatus).map(([label, value]) => ({ label, value })));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Erro ao buscar estatísticas");
        setLoading(false);
      });
  }, []);

  if (loading) return <main className="p-8">Carregando...</main>;
  if (error) return <main className="p-8 text-red-600">{error}</main>;
  if (!stats || typeof stats !== 'object' || !stats.usersByRole) return <main className="p-8">Sem dados.</main>;

  return (
    <main className="p-2 md:p-8 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 drop-shadow text-center md:text-left mb-4 md:mb-0">Dashboard Geral do Superadmin</h1>
        <div className="flex gap-4">
          <a href="/superadmin/usuarios" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow transition-all text-lg">
            Gerenciar Usuários
          </a>
          <button
            onClick={async () => {
              if (typeof window !== 'undefined') {
                const { signOut } = await import('next-auth/react');
                signOut({ callbackUrl: '/auth/login' });
              }
            }}
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow transition-all text-lg"
          >
            Sair
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-10">
        <SuperadminStatsCard title="Empresas" value={totalEmpresas} icon={"🏢"} color="border-yellow-400" />
        <SuperadminStatsCard title="Usuários Ativos" value={activeUsers} icon={"✅"} color="border-green-400" />
        <SuperadminStatsCard title="Usuários Inativos" value={inactiveUsers} icon={"⛔"} color="border-red-400" />
        <SuperadminStatsCard title="Admins" value={adminsByEmpresa.reduce((a, b) => a + b.value, 0)} icon={"🛡️"} color="border-blue-400" />
        <SuperadminStatsCard title="Total Usuários" value={Object.values(stats.usersByRole).reduce((a, b) => a + b, 0)} icon={"👥"} color="border-indigo-400" />
      </div>

      {/* Nova seção: Lista de empresas cadastradas */}
      <div className="bg-white rounded-xl shadow p-4 mb-10">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Empresas Cadastradas</h2>
        {stats.empresas && stats.empresas.length > 0 ? (
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
                {stats.empresas.map((empresa) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-indigo-700">Usuários por Tipo</h2>
          <PieChartSVG data={Object.entries(stats.usersByRole).map(([role, value]) => ({ label: role, value }))} label="Usuários por Tipo" />
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-blue-700">Usuários por Empresa</h2>
          <BarChartSVG data={usersByEmpresa} label="Usuários por Empresa" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-green-700">Evolução dos Cadastros</h2>
          <BarChartSVG data={usersEvolution} label="Evolução dos Cadastros" />
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-purple-700">Usuários por Status</h2>
          <BarChartSVG data={usersByStatus} label="Usuários por Status" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-blue-700">Admins por Empresa</h2>
          <BarChartSVG data={adminsByEmpresa} label="Admins por Empresa" />
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-green-700">Evolução de Admins</h2>
          <BarChartSVG data={adminsEvolution} label="Evolução de Admins" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-purple-700">Admins por Status</h2>
          <BarChartSVG data={adminsByStatus} label="Admins por Status" />
        </div>
      </div>
    </main>
  );
}
