"use client";
import React, { useState, useEffect } from 'react';
import ModulePageLayout from '@/components/ModulePageLayout';
import SuppliersCardsNew from '@/components/SuppliersCardsNew';
import SuppliersTableNew from '@/components/SuppliersTableNew';
import { 
  Fab, 
  ToggleButton, 
  ToggleButtonGroup, 
  Drawer, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { 
  Add, 
  Assessment, 
  ShoppingCart, 
  BarChart, 
  Inventory2, 
  FilterList,
  Close,
  PictureAsPdf 
} from '@mui/icons-material';
import Link from 'next/link';

export default function SuppliersPage() {
  const [viewMode, setViewMode] = useState('cards');
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Estados dos filtros
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    status: '',
    category: '',
    country: '',
    startDate: '',
    endDate: ''
  });

  // Carregar dados dos fornecedores
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      setSuppliers(data.suppliers || []);
      setFilteredSuppliers(data.suppliers || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    const filtered = getFilteredSuppliers();
    setFilteredSuppliers(filtered);
  }, [filters, suppliers]);

  const getFilteredSuppliers = () => {
    if (!Array.isArray(suppliers)) return [];

    return suppliers.filter(supplier => {
      const matchesSearch = !filters.search || 
        supplier.supplierName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        supplier.company?.toLowerCase().includes(filters.search.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCompany = !filters.company || 
        supplier.company?.toLowerCase().includes(filters.company.toLowerCase());

      const matchesStatus = !filters.status || supplier.status === filters.status;

      const matchesCategory = !filters.category || 
        supplier.category?.toLowerCase().includes(filters.category.toLowerCase());

      const matchesCountry = !filters.country || 
        supplier.country?.toLowerCase().includes(filters.country.toLowerCase());

      const matchesStartDate = !filters.startDate || 
        new Date(supplier.createdAt) >= new Date(filters.startDate);

      const matchesEndDate = !filters.endDate || 
        new Date(supplier.createdAt) <= new Date(filters.endDate + 'T23:59:59');

      return matchesSearch && matchesCompany && matchesStatus && 
             matchesCategory && matchesCountry && matchesStartDate && matchesEndDate;
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      company: '',
      status: '',
      category: '',
      country: '',
      startDate: '',
      endDate: ''
    });
  };

  const handlePdfExport = () => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    window.open(`/api/suppliers/pdf?${params.toString()}`, '_blank');
  };
  // KPIs cards
  const kpis = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-100">
        <Inventory2 className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">{filteredSuppliers.length}</span>
        <span className="text-white font-medium">Fornecedores</span>
      </div>
      <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-green-100">
        <Assessment className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">{filteredSuppliers.filter(s => s.status === 'ativo').length}</span>
        <span className="text-white font-medium">Ativos</span>
      </div>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-yellow-100">
        <ShoppingCart className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">{new Set(filteredSuppliers.map(s => s.category)).size}</span>
        <span className="text-white font-medium">Categorias</span>
      </div>
      <div className="bg-gradient-to-r from-pink-400 to-fuchsia-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-pink-100">
        <Add className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Novo</span>
        <span className="text-white font-medium">Fornecedor</span>
      </div>
    </div>
  );

  // Botão de ação principal (novo fornecedor)
  const actions = (
    <Link href='/suppliers/create' passHref>
      <Fab color="primary" aria-label="add">
        <Add />
      </Fab>
    </Link>
  );

  // Filtros e alternância Cards/Tabela
  const filtersComponent = (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setDrawerOpen(true)}
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          Filtros {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
        </Button>
        <span className="text-sm text-gray-600">
          {filteredSuppliers.length} de {suppliers.length} fornecedores
        </span>
      </div>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(_, nextView) => nextView && setViewMode(nextView)}
        aria-label="Modo de visualização"
        size="small"
      >
        <ToggleButton value="cards" aria-label="Cards">Cards</ToggleButton>
        <ToggleButton value="table" aria-label="Table">Tabela</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );

  // Botões utilitários (estatísticas e imprimir PDF)
  const tools = (
    <>
      <Link href="/suppliers/statistics" passHref>
        <button
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2"
          title="Estatísticas"
        >
          <BarChart fontSize="small" /> Estatísticas
        </button>
      </Link>
      <button
        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2"
        title="Exportar PDF"
        onClick={handlePdfExport}
      >
        <PictureAsPdf fontSize="small" /> PDF
      </button>
    </>
  );

  return (
    <>
      <ModulePageLayout
        title="Fornecedores"
        description="Visualização e gestão dos fornecedores do sistema"
        kpis={kpis}
        shortcuts={<></>}
        filters={filtersComponent}
        actions={actions}
        tools={tools}
      >
        <section className='mt-8'>
          {viewMode === 'cards' ? 
            <SuppliersCardsNew suppliers={filteredSuppliers} isLoading={isLoading} /> : 
            <SuppliersTableNew suppliers={filteredSuppliers} isLoading={isLoading} />
          }
        </section>
      </ModulePageLayout>

      {/* Drawer de Filtros */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 400, p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Filtros Avançados
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Buscar fornecedor"
            placeholder="Nome, empresa ou email"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            fullWidth
          />

          <TextField
            label="Empresa"
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Categoria"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            fullWidth
          />

          <TextField
            label="País"
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            fullWidth
          />

          <TextField
            label="Data Início"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Data Fim"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              fullWidth
            >
              Limpar Filtros
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setDrawerOpen(false)}
              fullWidth
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}