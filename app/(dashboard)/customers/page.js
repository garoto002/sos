"use client";

import React, { useState, useEffect } from 'react';
import ModulePageLayout from '@/components/ModulePageLayout';
import CustomersCards from '@/components/CustomersCardsNew';
import CustomersTable from '@/components/CustomersTableNew';
import { Fab, ToggleButton, ToggleButtonGroup, Drawer, FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from 'next/link';
import { Add, Assessment, Person, Business } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function CustomersPage() {
  const [viewMode, setViewMode] = useState('cards');
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados dos filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Função para filtrar clientes
  const getFilteredCustomers = () => {
    let filtered = [...customers];

    if (nameFilter) {
      filtered = filtered.filter(customer => 
        customer.name && customer.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (emailFilter) {
      filtered = filtered.filter(customer => 
        customer.email && customer.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    if (phoneFilter) {
      filtered = filtered.filter(customer => 
        customer.phone && customer.phone.includes(phoneFilter)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(customer => customer.type === typeFilter);
    }

    return filtered;
  };

  const filteredCustomers = getFilteredCustomers();

  // KPIs
  const kpis = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-blue-100">
        <Person className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Clientes</span>
        <span className="text-white font-medium">Lista</span>
      </div>
      <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-green-100">
        <Assessment className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Estatísticas</span>
        <span className="text-white font-medium">Análise</span>
      </div>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-yellow-100">
        <Business className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Empresas</span>
        <span className="text-white font-medium">Parceiros</span>
      </div>
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-pink-100">
        <Add className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Novo Cliente</span>
        <span className="text-white font-medium">Adicionar</span>
      </div>
    </div>
  );

  // Atalhos
  const shortcuts = <></>;

  // Botão de ação principal
  const actions = (
    <Link href='/customers/create' passHref>
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
      <button
        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2"
        title="Estatísticas"
      >
        <BarChartIcon fontSize="small" /> Estatísticas
      </button>
      <button
        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2"
        title="Imprimir PDF"
        onClick={() => window.open('/api/customers/pdf', '_blank')}
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
          <h3 className="text-lg font-semibold mb-4">Filtrar Clientes</h3>
          
          <TextField
            fullWidth
            margin="normal"
            label="Nome"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Filtrar por nome"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            placeholder="Filtrar por email"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Telefone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            placeholder="Filtrar por telefone"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Tipo"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="company">Empresa</MenuItem>
            </Select>
          </FormControl>

          <div className="flex gap-2 mt-4">
            <Button 
              variant="outlined" 
              onClick={() => {
                setNameFilter("");
                setEmailFilter("");
                setPhoneFilter("");
                setTypeFilter("all");
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
        title="Lista de Clientes"
        description="Gerencie seus clientes e veja informações detalhadas"
        kpis={kpis}
        shortcuts={shortcuts}
        filters={filters}
        actions={actions}
        tools={tools}
      >
        <section className='mt-8'>
          {viewMode === 'cards' ? (
            <CustomersCards customers={filteredCustomers} isLoading={isLoading} />
          ) : (
            <CustomersTable customers={filteredCustomers} isLoading={isLoading} />
          )}
        </section>
      </ModulePageLayout>
    </>
  );
}
