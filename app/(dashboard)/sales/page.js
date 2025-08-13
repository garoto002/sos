"use client";

import React, { useState, useEffect } from 'react';
import ModulePageLayout from '@/components/ModulePageLayout';
import SalesCards from '@/components/SalesCardsNew';
import SalesTable from '@/components/SalesTable';
import { Fab, ToggleButton, ToggleButtonGroup, Drawer, FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from 'next/link';
import { Add, Assessment, ShoppingCart, Inventory2 } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function SalesPage() {
  const [viewMode, setViewMode] = useState('cards');
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados dos filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [minSaleValue, setMinSaleValue] = useState("");
  const [maxSaleValue, setMaxSaleValue] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/sales')
      .then(res => res.json())
      .then(data => {
        setSales(data.sales);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Função para filtrar vendas
  const getFilteredSales = () => {
    let filtered = [...sales];

    // Filtro por período
    if (filterOption === "year" && selectedYear) {
      filtered = filtered.filter(sale => 
        new Date(sale.createdAt).getFullYear().toString() === selectedYear
      );
    }
    if (filterOption === "month" && selectedMonth && selectedYear) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getFullYear().toString() === selectedYear && 
               (saleDate.getMonth() + 1).toString() === selectedMonth;
      });
    }
    if (filterOption === "day" && selectedDay && selectedMonth && selectedYear) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getFullYear().toString() === selectedYear && 
               (saleDate.getMonth() + 1).toString() === selectedMonth &&
               saleDate.getDate().toString() === selectedDay;
      });
    }

    // Filtro por valor
    if (minSaleValue) {
      filtered = filtered.filter(sale => 
        (sale.totalAfterDiscount || 0) >= parseFloat(minSaleValue)
      );
    }
    if (maxSaleValue) {
      filtered = filtered.filter(sale => 
        (sale.totalAfterDiscount || 0) <= parseFloat(maxSaleValue)
      );
    }

    // Filtro por cliente
    if (customerName) {
      filtered = filtered.filter(sale => 
        sale.customerName && sale.customerName.toLowerCase().includes(customerName.toLowerCase())
      );
    }

    // Filtro por produto
    if (product) {
      filtered = filtered.filter(sale => 
        sale.products.some(p => 
          p.product && p.product.toLowerCase().includes(product.toLowerCase())
        )
      );
    }

    return filtered;
  };

  const filteredSales = getFilteredSales();

  // KPIs
  const kpis = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-100">
        <ShoppingCart className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Vendas</span>
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
        <span className="text-2xl font-bold text-white mb-1">Nova Venda</span>
        <span className="text-white font-medium">Adicionar</span>
      </div>
    </div>
  );

  // Atalhos
  const shortcuts = <></>;

  // Botão de ação principal
  const actions = (
    <Link href='/sales/create' passHref>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </Link>
  );

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
      <Link href="/sales/statistics" passHref>
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
        onClick={() => window.open('/api/sales/pdf', '_blank')}
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
          <h3 className="text-lg font-semibold mb-4">Filtrar Vendas</h3>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Filtrar Por</InputLabel>
            <Select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              label="Filtrar Por"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="year">Ano</MenuItem>
              <MenuItem value="month">Mês</MenuItem>
              <MenuItem value="day">Dia</MenuItem>
            </Select>
          </FormControl>

          {filterOption !== "all" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Ano</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label="Ano"
              >
                {[2024, 2025, 2026].map(year => (
                  <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {(filterOption === "month" || filterOption === "day") && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Mês</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label="Mês"
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                  <MenuItem key={month} value={month.toString()}>
                    {new Date(0, month - 1).toLocaleString('pt-BR', { month: 'long' })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {filterOption === "day" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Dia</InputLabel>
              <Select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                label="Dia"
              >
                {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                  <MenuItem key={day} value={day.toString()}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Cliente"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Filtrar por nome do cliente"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Produto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Filtrar por produto"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Valor Mínimo"
            type="number"
            value={minSaleValue}
            onChange={(e) => setMinSaleValue(e.target.value)}
            placeholder="Valor mínimo da venda"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Valor Máximo"
            type="number"
            value={maxSaleValue}
            onChange={(e) => setMaxSaleValue(e.target.value)}
            placeholder="Valor máximo da venda"
          />

          <div className="flex gap-2 mt-4">
            <Button 
              variant="outlined" 
              onClick={() => {
                setFilterOption("all");
                setSelectedYear("");
                setSelectedMonth("");
                setSelectedDay("");
                setMinSaleValue("");
                setMaxSaleValue("");
                setCustomerName("");
                setProduct("");
              }}
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
        title="Lista de Vendas"
        description="Aqui você vai listar e visualizar as vendas registadas no sistema"
        kpis={kpis}
        shortcuts={shortcuts}
        filters={filters}
        actions={actions}
        tools={tools}
      >
        <section className='mt-8'>
          {viewMode === 'cards' ? (
            <SalesCards sales={filteredSales} isLoading={isLoading} />
          ) : (
            <SalesTable sales={filteredSales} isLoading={isLoading} />
          )}
        </section>
      </ModulePageLayout>
    </>
  );
}