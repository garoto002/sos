"use client";
import PageHeader from '@/components/PageHeader';
import SuppliersCards from '@/components/SuppliersCard';
import SuppliersTable from '@/components/SuppliersTable';
import { useEffect, useState } from "react";
import Link from "next/link";
import { LocalShipping, Assessment, AddCircle, BarChart, Inventory2 } from '@mui/icons-material';
import { Add, ShoppingCart } from '@mui/icons-material';

export default function SuppliersPage() {
  const [viewMode, setViewMode] = useState('cards');
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center drop-shadow">Fornecedores</h1>
        {/* Cards de resumo analítico */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-100">
            <Inventory2 className="text-white text-4xl mb-2" />
            <span className="text-2xl font-bold text-white mb-1">Fornecedores</span>
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
            <span className="text-2xl font-bold text-white mb-1">Novo Fornecedor</span>
            <span className="text-white font-medium">Adicionar</span>
          </div>
        </div>
        {/* Atalhos */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Link href="/suppliers/create" className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-blue-400 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl shadow font-bold transition">
            <AddCircle className="text-white" /> Novo Fornecedor
          </Link>
          <Link href="/suppliers/report" className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl shadow font-bold transition">
            <Assessment className="text-white" /> Relatório
          </Link>
          <Link href="/suppliers/statistics" className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-fuchsia-400 hover:from-pink-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl shadow font-bold transition">
            <BarChart className="text-white" /> Estatísticas
          </Link>
        </div>
        {/* Alternância Cards/Tabela */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded font-bold shadow ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-600'}`}
            onClick={() => setViewMode('cards')}
          >
            Ver em Cards
          </button>
          <button
            className={`px-4 py-2 rounded font-bold shadow ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-600'}`}
            onClick={() => setViewMode('table')}
          >
            Ver em Tabela
          </button>
        </div>
        {/* Lista de fornecedores moderna */}
        {viewMode === 'cards' ? <SuppliersCards /> : <SuppliersTable />}
      </div>
    </div>
  );
}
