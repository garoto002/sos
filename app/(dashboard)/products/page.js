"use client";
import React, { useState, useEffect } from 'react';
import ModulePageLayout from '@/components/ModulePageLayout';
import PageHeader from "../../../components/PageHeader";
import ProductsTable from "../../../components/ProductsTable";
import ProductsCardsNew from "../../../components/ProductsCardsNew";
import { Fab, ToggleButton, ToggleButtonGroup, Drawer, FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from 'next/link';
import { Add, Assessment, Inventory2, ShoppingCart } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState('cards');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados dos filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Função para filtrar produtos
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filtro por nome/pesquisa
    if (search) {
      filtered = filtered.filter(product => 
        product.name && product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por categoria
    if (category) {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filtro por fornecedor
    if (supplier) {
      filtered = filtered.filter(product => 
        product.supplier && product.supplier.toLowerCase().includes(supplier.toLowerCase())
      );
    }

    // Filtro por estoque mínimo
    if (minStock) {
      filtered = filtered.filter(product => 
        (product.stock || 0) >= parseFloat(minStock)
      );
    }

    // Filtro por estoque máximo
    if (maxStock) {
      filtered = filtered.filter(product => 
        (product.stock || 0) <= parseFloat(maxStock)
      );
    }

    // Filtro por preço mínimo
    if (minPrice) {
      filtered = filtered.filter(product => 
        (product.price || 0) >= parseFloat(minPrice)
      );
    }

    // Filtro por preço máximo
    if (maxPrice) {
      filtered = filtered.filter(product => 
        (product.price || 0) <= parseFloat(maxPrice)
      );
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // KPIs
  const kpis = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-100">
        <Inventory2 className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Produtos</span>
        <span className="text-white font-medium">Resumo geral</span>
      </div>
      <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-green-100">
        <Assessment className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Estatísticas</span>
        <span className="text-white font-medium">Analítico</span>
      </div>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-yellow-100">
        <ShoppingCart className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Compras</span>
        <span className="text-white font-medium">Relacionados</span>
      </div>
      <div className="bg-gradient-to-r from-pink-400 to-fuchsia-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-pink-100">
        <Add className="text-white text-4xl mb-2" />
        <span className="text-2xl font-bold text-white mb-1">Novo Produto</span>
        <span className="text-white font-medium">Adicionar</span>
      </div>
    </div>
  );

  // Atalhos
  const shortcuts = <></>;

  // Botão de ação principal
  const actions = (
    <Link href='/products/create' passHref>
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

  // Função para gerar PDF com filtros
  const handlePdfExport = () => {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (supplier) params.append('supplier', supplier);
    if (minStock) params.append('minStock', minStock.toString());
    if (maxStock) params.append('maxStock', maxStock.toString());
    if (minPrice) params.append('minPrice', minPrice.toString());
    if (maxPrice) params.append('maxPrice', maxPrice.toString());
    
    const url = `/api/products/pdf${params.toString() ? '?' + params.toString() : ''}`;
    window.open(url, '_blank');
  };

  // Botões utilitários
  const tools = (
    <>
      <Link href="/products/statistics" passHref>
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
          <h3 className="text-lg font-semibold mb-4">Filtrar Produtos</h3>
          
          <TextField
            fullWidth
            margin="normal"
            label="Pesquisar Produto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Digite o nome do produto"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Filtrar por categoria"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Fornecedor"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Filtrar por fornecedor"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Estoque Mínimo"
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            placeholder="Estoque mínimo"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Estoque Máximo"
            type="number"
            value={maxStock}
            onChange={(e) => setMaxStock(e.target.value)}
            placeholder="Estoque máximo"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Preço Mínimo"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Preço mínimo"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Preço Máximo"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Preço máximo"
          />

          <div className="flex gap-2 mt-4">
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearch("");
                setCategory("");
                setSupplier("");
                setMinStock("");
                setMaxStock("");
                setMinPrice("");
                setMaxPrice("");
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
        title="Lista de Produtos"
        description="Aqui você vai listar e visualizar os produtos registados no sistema"
        kpis={kpis}
        shortcuts={shortcuts}
        filters={filters}
        actions={actions}
        tools={tools}
      >
        <section className='mt-8'>
          {viewMode === 'cards' ? (
            <ProductsCardsNew products={filteredProducts} isLoading={isLoading} />
          ) : (
            <ProductsTable products={filteredProducts} isLoading={isLoading} />
          )}
        </section>
      </ModulePageLayout>
    </>
  );
}