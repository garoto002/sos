"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CompanyDistributionChart, CompanyGrowthChart, CompanyActivityChart } from './SuperadminSVGCharts';
import { Grid, Card, CardContent, Typography, Button, Box, Divider, IconButton, Tooltip } from '@mui/material';
import { 
  Business, 
  Group, 
  TrendingUp, 
  Add as AddIcon,
  Refresh as RefreshIcon,
  AssignmentTurnedIn as ActiveIcon,
  AssignmentLate as InactiveIcon
} from '@mui/icons-material';

const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card sx={{ height: '100%', bgcolor: `${color}.50` }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
          <Typography variant="h4" sx={{ my: 1, color: `${color}.700` }}>{value}</Typography>
          {subtitle && <Typography variant="body2" color="textSecondary">{subtitle}</Typography>}
        </Box>
        <Icon sx={{ fontSize: 40, color: `${color}.400` }} />
      </Box>
    </CardContent>
  </Card>
);

export default function SuperAdminDashboard() {
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmpresas: 0,
    empresasAtivas: 0,
    totalUsuarios: 0,
    crescimentoMensal: 0
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [empresasRes, statsRes] = await Promise.all([
        fetch("/api/empresas").then(res => res.json()),
        fetch("/api/superadmin/stats").then(res => res.json())
      ]);

      setEmpresas(empresasRes.empresas || []);
      setStats(statsRes || {});
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dados para os gráficos
  const empresasPorStatus = [
    { name: 'Ativas', value: stats.empresasAtivas },
    { name: 'Inativas', value: stats.totalEmpresas - stats.empresasAtivas }
  ];

  const crescimentoMensal = [
    { month: 'Jan', empresas: 10, usuarios: 45 },
    { month: 'Fev', empresas: 12, usuarios: 52 },
    { month: 'Mar', empresas: 15, usuarios: 58 },
    { month: 'Abr', empresas: 18, usuarios: 63 },
    { month: 'Mai', empresas: 20, usuarios: 70 },
    { month: 'Jun', empresas: stats.totalEmpresas, usuarios: stats.totalUsuarios }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Painel do Super Admin
        </Typography>
        <Box>
          <Tooltip title="Atualizar dados">
            <IconButton onClick={loadData} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/superadmin/empresas/create"
            sx={{ ml: 2 }}
          >
            Nova Empresa
          </Button>
        </Box>
      </Box>

      {/* Cards de Métricas */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total de Empresas"
            value={stats.totalEmpresas}
            icon={Business}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Empresas Ativas"
            value={stats.empresasAtivas}
            icon={ActiveIcon}
            color="success"
            subtitle={`${((stats.empresasAtivas / stats.totalEmpresas) * 100).toFixed(1)}% do total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total de Usuários"
            value={stats.totalUsuarios}
            icon={Group}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Crescimento Mensal"
            value={`${stats.crescimentoMensal}%`}
            icon={TrendingUp}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Distribuição de Empresas</Typography>
              <CompanyDistributionChart data={empresasPorStatus} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Crescimento</Typography>
              <CompanyGrowthChart data={crescimentoMensal} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Empresas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Empresas Registradas</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Empresa</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Usuários</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {empresas.map((empresa) => (
                  <tr key={empresa._id} className="hover:bg-gray-50">
                    <td className="p-4">{empresa.nome}</td>
                    <td className="p-4">{empresa.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        empresa.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {empresa.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">{empresa.totalUsuarios || 0}</td>
                    <td className="p-4 text-right">
                      <Button
                        component={Link}
                        href={`/superadmin/empresas/${empresa._id}`}
                        size="small"
                        variant="outlined"
                      >
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}