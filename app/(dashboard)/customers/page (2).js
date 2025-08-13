"use client";
import React, { useState, useEffect } from 'react';
import ModulePageLayout from '@/components/ModulePageLayout';
import CustomersCardsNew from '@/components/CustomersCardsNew';
import CustomersTableNew from '@/components/CustomersTableNew';
import { 
  Fab, 
  ToggleButton, 
  ToggleButtonGroup, 
  Drawer, 
  Box, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from 'next/link';
import { Add, Assessment, ShoppingCart, Inventory2 } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function CustomersPage() {
  const [viewMode, setViewMode] = useState('cards');
  const [filterOpen, setFilterOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados dos filtros
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [type, setType] = useState('');

  // Carregar dados
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        const customersData = data.customers || data || [];
        setCustomers(Array.isArray(customersData) ? customersData : []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar customers:', error);
        setCustomers([]);
        setIsLoading(false);
      });
  }, []);

  // Função de filtros
  const getFilteredCustomers = () => {
    if (!Array.isArray(customers)) return [];
    
    return customers.filter(customer => {
      // Filtro por pesquisa (numero, cliente, observacoes)
      if (search && !(
        (customer.numero || '').toLowerCase().includes(search.toLowerCase()) ||
        (customer.cliente || '').toLowerCase().includes(search.toLowerCase()) ||
        (customer.observacoes || '').toLowerCase().includes(search.toLowerCase())
      )) {
        return false;
      }

      // Filtro por status
      if (status && custom.status !== status) {
        return false;
      }

      // Filtro por tipo
      if (type && custom.tipo !== type) {
        return false;
      }

      // Filtro por data
      if (startDate) {
        const customDate = new Date(custom.createdAt || custom.data);
        if (customDate < new Date(startDate)) return false;
      }
      if (endDate) {
        const customDate = new Date(custom.createdAt || custom.data);
        if (customDate > new Date(endDate + 'T23:59:59')) return false;
      }

      // Filtro por valor
      const value = custom.valorTotal || custom.valor || 0;
      if (minValue && value < parseFloat(minValue)) return false;
      if (maxValue && value > parseFloat(maxValue)) return false;

      return true;
    });
  };

  const filteredCustomers = getFilteredCustomers();

  // Limpar filtros
  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setType('');
    setStartDate('');
    setEndDate('');
    setMinValue('');
    setMaxValue('');
  };
  // Função para gerar PDF com filtros
  const handlePdfExport = () => {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (minValue) params.append('minValue', minValue.toString());
    if (maxValue) params.append('maxValue', maxValue.toString());

    const url = `/api/customers/pdf${params.toString() ? '?' + params.toString() : ''}`;
    window.open(url, '_blank');
  };

  // KPIs cards
  const kpis = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-100">
        <Inventory2 className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Desembaraço</span>
        <span className="text-white font-medium">Resumo geral</span>
      </div>
      <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-green-100">
        <Assessment className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Estatísticas</span>
        <span className="text-white font-medium">Analítico</span>
      </div>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-yellow-100">
        <ShoppingCart className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Produtos</span>
        <span className="text-white font-medium">Relacionados</span>
      </div>
      <div className="bg-gradient-to-r from-pink-400 to-fuchsia-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-pink-100">
        <Add className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Novo Desembaraço</span>
        <span className="text-white font-medium">Adicionar</span>
      </div>
    </div>
  );

  // Atalhos rápidos (padrão: vazio para manter slot)
  const shortcuts = <></>;

  // Botão de ação principal (novo registro)
  const actions = (
    <Link href='/customers/create' passHref>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </Link>
  );

  // Alternância Cards/Tabela
  const filters = (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setFilterOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2"
      >
        <FilterListIcon fontSize="small" /> Filtrar
      </button>
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
      <Link href="/customers/statistics" passHref>
        <button
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2"
          title="Estatísticas"
        >
          <BarChartIcon fontSize="small" /> Estatísticas
        </button>
      </Link>
      <button
        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2"
        title="Imprimir PDF"
        onClick={handlePdfExport}
      >
        <PictureAsPdfIcon fontSize="small" /> PDF
      </button>
    </>
  );

  return (
    <>
      {/* Drawer de Filtros */}
      <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Box sx={{ width: 350, padding: 3 }}>
          <h3 className="text-lg font-semibold mb-4">Filtrar Desembaraços</h3>
          
          <TextField
            fullWidth
            margin="normal"
            label="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Número, cliente ou observações"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="em_andamento">Em Andamento</MenuItem>
              <MenuItem value="concluido">Concluído</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Tipo"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="importacao">Importação</MenuItem>
              <MenuItem value="exportacao">Exportação</MenuItem>
              <MenuItem value="transito">Trânsito</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Data Inicial"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Data Final"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Valor Mínimo"
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            placeholder="0.00"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Valor Máximo"
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder="0.00"
          />

          <div className="flex gap-2 mt-4">
            <Button 
              variant="outlined" 
              onClick={clearFilters} 
              fullWidth
            >
              Limpar
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setFilterOpen(false)} 
              fullWidth
            >
              Aplicar
            </Button>
          </div>
        </Box>
      </Drawer>

      <ModulePageLayout
        title="Desalfandegamento"
        description="Aqui você pode visualizar e gerenciar todos os registros de desalfandegamento do sistema."
        kpis={kpis}
        shortcuts={shortcuts}
        filters={filters}
        actions={actions}
        tools={tools}
      >
        <section className='mt-8'>
          {viewMode === 'cards' ? (
            <CustomersCardsNew customers={filteredCustomers} isLoading={isLoading} />
          ) : (
            <CustomersTableNew customers={filteredCustomers} isLoading={isLoading} />
          )}
        </section>
      </ModulePageLayout>
    </>
  );
}