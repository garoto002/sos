"use client";

import { Add, Assessment, ShoppingCart, Inventory2 } from '@mui/icons-material';
import PageHeader from '@/components/PageHeader';
import StockAdjustmentsTable  from '@/components/StockAdjustmentsTable';
import ModulePageLayout from '@/components/ModulePageLayout';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BarChartIcon from '@mui/icons-material/BarChart';
import Link from 'next/link';
import React from 'react'

export default function page() {
  // Botões utilitários (estatísticas e imprimir PDF)
  const tools = (
    <>
      <Link href="/stock-adjustments/statistics" passHref>
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
        onClick={() => window.open('/api/stock-adjustments/pdf', '_blank')}
      >
        <PictureAsPdfIcon fontSize="small" /> PDF
      </button>
    </>
  );

  return (
    <ModulePageLayout
      title="Ajustes de Estoque"
      description="Aqui você vai listar e visualizar os ajustes de estoque registrados no sistema"
      tools={tools}
    >
      {/* Cards de resumo analítico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-indigo-100">
          <Inventory2 className="text-white text-4xl mb-2" />
          <span className="text-2xl font-bold text-white mb-1">Ajustes</span>
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
          <span className="text-2xl font-bold text-white mb-1">Novo Ajuste</span>
          <span className="text-white font-medium">Adicionar</span>
        </div>
      </div>
      <section className='mt-8'>
          <StockAdjustmentsTable ></StockAdjustmentsTable >
      </section>
    </ModulePageLayout>
  );
}