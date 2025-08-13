"use client";

import React, { useState, useEffect } from 'react';
import ModulePageLayout from '@/components/ModulePageLayout';
import PageHeader from "@/components/PageHeader";
import Link from 'next/link';
import { 
  Drawer, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import {
  FilterList,
  Add,
  Person,
  Group,
  AdminPanelSettings,
  CheckCircle,
  Cancel,
  BarChart as BarChartIcon,
  ViewModule,
  TableChart,
  PictureAsPdf,
  Close
} from '@mui/icons-material';
import UsersCardsNew from '@/components/UsersCardsNew';
import UsersTableNew from '@/components/UsersTableNew';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Estados dos filtros
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    company: '',
    startDate: '',
    endDate: ''
  });

  // Buscar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          // A API retorna { users, empresas }, então pegamos só users
          const usersArray = Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : [];
          setUsers(usersArray);
          setFilteredUsers(usersArray);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...users];

    if (filters.search) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    if (filters.company) {
      filtered = filtered.filter(user => 
        user.company?.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(user => 
        new Date(user.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(user => 
        new Date(user.createdAt) <= new Date(filters.endDate + 'T23:59:59')
      );
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: '',
      company: '',
      startDate: '',
      endDate: ''
    });
  };

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  // Calcular KPIs - com verificação de segurança
  const safeFilteredUsers = Array.isArray(filteredUsers) ? filteredUsers : [];
  const totalUsers = safeFilteredUsers.length;
  const activeUsers = safeFilteredUsers.filter(u => u.status === 'ativo').length;
  const adminUsers = safeFilteredUsers.filter(u => u.role === 'admin').length;
  const userUsers = safeFilteredUsers.filter(u => u.role === 'user').length;

  // Gerar PDF com filtros
  const generatePDF = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    window.open(`/api/users/pdf?${queryParams.toString()}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
              <Person className="text-blue-600 text-4xl" />
              Gestão de Usuários
            </h1>
            <p className="text-gray-600">
              Gerencie usuários do sistema com filtros avançados e relatórios
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
            {/* Botão de Filtros */}
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
              className="relative"
            >
              Filtros
              {activeFiltersCount > 0 && (
                <Chip
                  label={activeFiltersCount}
                  size="small"
                  color="primary"
                  className="ml-2"
                />
              )}
            </Button>

            {/* Toggle View Mode */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === 'cards' ? 'contained' : 'text'}
                size="small"
                startIcon={<ViewModule />}
                onClick={() => setViewMode('cards')}
                className="min-w-0"
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'text'}
                size="small"
                startIcon={<TableChart />}
                onClick={() => setViewMode('table')}
                className="min-w-0"
              >
                Tabela
              </Button>
            </div>

            {/* Botão Estatísticas */}
            <Link href="/users/statistics" passHref>
              <Button
                variant="outlined"
                startIcon={<BarChartIcon />}
                color="info"
              >
                Estatísticas
              </Button>
            </Link>

            {/* Botão PDF */}
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={generatePDF}
              color="error"
            >
              PDF
            </Button>

            {/* Botão Novo Usuário */}
            <Link href="/users/create" passHref>
              <Button
                variant="contained"
                startIcon={<Add />}
                color="primary"
              >
                Novo Usuário
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold">
                    {totalUsers}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Total de Usuários
                  </Typography>
                </div>
                <Group className="text-4xl opacity-80" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold">
                    {activeUsers}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Usuários Ativos
                  </Typography>
                </div>
                <CheckCircle className="text-4xl opacity-80" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold">
                    {adminUsers}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Administradores
                  </Typography>
                </div>
                <AdminPanelSettings className="text-4xl opacity-80" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold">
                    {userUsers}
                  </Typography>
                  <Typography variant="body2" className="opacity-90">
                    Usuários Comuns
                  </Typography>
                </div>
                <Person className="text-4xl opacity-80" />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {viewMode === 'cards' ? (
            <UsersCardsNew users={safeFilteredUsers} onUserUpdate={() => window.location.reload()} />
          ) : (
            <UsersTableNew users={safeFilteredUsers} onUserUpdate={() => window.location.reload()} />
          )}
        </div>

        {/* Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: { width: 400, maxWidth: '90vw' }
          }}
        >
          <Box className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h6" className="font-bold">
                Filtros Avançados
              </Typography>
              <IconButton onClick={() => setFilterDrawerOpen(false)}>
                <Close />
              </IconButton>
            </div>

            <div className="space-y-4">
              <TextField
                fullWidth
                label="Buscar por nome ou email"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                variant="outlined"
                size="small"
              />

              <FormControl fullWidth size="small">
                <InputLabel>Função</InputLabel>
                <Select
                  value={filters.role}
                  label="Função"
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="user">Usuário</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Empresa"
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Data inicial"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                size="small"
              />

              <TextField
                fullWidth
                label="Data final"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </div>

            <Divider className="my-6" />

            <div className="flex gap-3">
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
              >
                Limpar
              </Button>
              <Button
                variant="contained"
                onClick={() => setFilterDrawerOpen(false)}
                fullWidth
              >
                Aplicar
              </Button>
            </div>
          </Box>
        </Drawer>
      </div>
    </div>
  );
}