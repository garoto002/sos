"use client";
import React, { useState, useEffect } from 'react';
import ModulePageLayout from '@/components/ModulePageLayout';
import PurchasesCardsNew from '@/components/PurchasesCardsNew';
import PurchasesTableNew from '@/components/PurchasesTableNew';
import { 
  Fab, 
  ToggleButton, 
  ToggleButtonGroup, 
  Drawer, 
  Box, 
  TextField, 
  Button 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from 'next/link';
import { Add, Assessment, ShoppingCart, Inventory2 } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function PurchasePage() {
  const [viewMode, setViewMode] = useState('cards');
  const [filterOpen, setFilterOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados dos filtros
  const [search, setSearch] = useState('');
  const [supplier, setSupplier] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');

  // Carregar dados
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/purchases')
      .then(res => res.json())
      .then(data => {
        const purchasesData = data.purchases || data || [];
        setPurchases(Array.isArray(purchasesData) ? purchasesData : []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar compras:', error);
        setPurchases([]);
        setIsLoading(false);
      });
  }, []);

  // Função de filtros
  const getFilteredPurchases = () => {
    if (!Array.isArray(purchases)) return [];
    
    return purchases.filter(purchase => {
      // Filtro por pesquisa (supplier, referenceNumber)
      if (search && !(
        (purchase.supplier || '').toLowerCase().includes(search.toLowerCase()) ||
        (purchase.referenceNumber || '').toLowerCase().includes(search.toLowerCase())
      )) {
        return false;
      }

      // Filtro por fornecedor
      if (supplier && !(purchase.supplier || '').toLowerCase().includes(supplier.toLowerCase())) {
        return false;
      }

      // Filtro por data
      if (startDate) {
        const purchaseDate = new Date(purchase.createdAt || purchase.date);
        if (purchaseDate < new Date(startDate)) return false;
      }
      if (endDate) {
        const purchaseDate = new Date(purchase.createdAt || purchase.date);
        if (purchaseDate > new Date(endDate + 'T23:59:59')) return false;
      }

      // Filtro por valor total
      const total = purchase.totalAmount || purchase.total || 0;
      if (minTotal && total < parseFloat(minTotal)) return false;
      if (maxTotal && total > parseFloat(maxTotal)) return false;

      return true;
    });
  };

  const filteredPurchases = getFilteredPurchases();

  // Limpar filtros
  const clearFilters = () => {
    setSearch('');
    setSupplier('');
    setStartDate('');
    setEndDate('');
    setMinTotal('');
    setMaxTotal('');
  };

  // KPIs
  const kpis = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-100">
        <ShoppingCart className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Compras</span>
        <span className="text-white font-medium">Resumo geral</span>
      </div>
      <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-green-100">
        <Assessment className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Estatísticas</span>
        <span className="text-white font-medium">Analítico</span>
      </div>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-yellow-100">
        <Inventory2 className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Produtos</span>
        <span className="text-white font-medium">Relacionados</span>
      </div>
      <div className="bg-gradient-to-r from-pink-400 to-fuchsia-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-pink-100">
        <Add className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Nova Compra</span>
        <span className="text-white font-medium">Adicionar</span>
      </div>
    </div>
  );

  // Atalhos
  const shortcuts = (
    <>
      <Link href="/purchase/statistics" className="bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-50 transition flex items-center gap-2">
        <Assessment className="text-indigo-400" /> Estatísticas de Compras
      </Link>
      <Link href="/report" className="bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-50 transition flex items-center gap-2">
        <ShoppingCart className="text-blue-400" /> Relatório de Compras
      </Link>
      <Link href="/products" className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-lg font-medium shadow hover:bg-green-50 transition flex items-center gap-2">
        <Inventory2 className="text-green-400" /> Produtos
      </Link>
    </>
  );

  // Botão de ação principal
  const actions = (
    <Link href='/purchase/create' passHref>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </Link>
  );

  // Função para gerar PDF com filtros
  const handlePdfExport = () => {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (supplier) params.append('supplier', supplier);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (minTotal) params.append('minTotal', minTotal.toString());
    if (maxTotal) params.append('maxTotal', maxTotal.toString());
    
    const url = `/api/purchases/pdf${params.toString() ? '?' + params.toString() : ''}`;
    window.open(url, '_blank');
  };

  // Alternância Cards/Lista
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
        <ToggleButton value="list" aria-label="List">Lista</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );

  // Botões utilitários
  const tools = (
    <>
      <Link href="/purchase/statistics" passHref>
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
          <h3 className="text-lg font-semibold mb-4">Filtrar Compras</h3>
          
          <TextField
            fullWidth
            margin="normal"
            label="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Fornecedor ou número de referência"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Fornecedor"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Nome do fornecedor"
          />

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
            value={minTotal}
            onChange={(e) => setMinTotal(e.target.value)}
            placeholder="0.00"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Valor Máximo"
            type="number"
            value={maxTotal}
            onChange={(e) => setMaxTotal(e.target.value)}
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
        title="Entradas de Mercadorias"
        description="Aqui você vai listar e visualizar as aquisições (compras de mercadoria) registradas no sistema"
        kpis={kpis}
        shortcuts={shortcuts}
        filters={filters}
        actions={actions}
        tools={tools}
      >
        <section className='mt-8'>
          {viewMode === 'cards' ? (
            <PurchasesCardsNew purchases={filteredPurchases} isLoading={isLoading} />
          ) : (
            <PurchasesTableNew purchases={filteredPurchases} isLoading={isLoading} />
          )}
        </section>
      </ModulePageLayout>
    </>
  );
}