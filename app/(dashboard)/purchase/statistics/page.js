
"use client";
import { useEffect, useState } from "react";
import IndicatorsRow from '../../../../components/IndicatorsRow';
import AdvancedFilters from '../../../../components/AdvancedFilters';
import EvolutionChart from '../../../../components/EvolutionChart';
import PurchasesCards from '../../../../components/PurchasesCards';

// Função para exportar relatório CSV
function exportReport({ filteredPurchases, totalVolume, totalPurchases, bestSupplier, bestSupplierQty }) {
  const headers = [
    'Data', 'Fornecedor', 'Produtos', 'Total', 'Desconto', 'Total Final'
  ];
  const rows = filteredPurchases.map(purchase => [
    new Date(purchase.createdAt).toLocaleDateString(),
    purchase.supplierName || '-',
    purchase.products.map(p => `${p.product} (x${p.quantity})`).join('; '),
    purchase.subtotal?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || 0,
    (purchase.discount || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }),
    purchase.totalAfterDiscount?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || 0
  ]);
  const summaryRows = [
    [],
    ['Resumo dos Indicadores'],
    ['Volume de Compras', totalVolume.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })],
    ['Nº de Compras', totalPurchases],
    ['Fornecedor Top', bestSupplier],
    ['Valor Fornecedor Top', bestSupplierQty.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })],
  ];
  const csv = [headers, ...rows, ...summaryRows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `relatorio-compras-${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function PurchaseStatisticsPage() {
  const [chartType, setChartType] = useState('line');
  const [periodType, setPeriodType] = useState('month');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIndicators, setSelectedIndicators] = useState({
    total: true,
    ticket: true,
    desconto: false,
    compras: false,
    fornecedoresUnicos: false,
    produtosDiferentes: false,
    maiorCompra: false,
    menorCompra: false,
    unidadesMaisCompradas: false,
    unidadesMenosCompradas: false,
  });
  const [summaryPurchases, setSummaryPurchases] = useState([]);
  useEffect(() => {
    fetch('/api/purchases')
      .then(res => res.json())
      .then(data => {
        setSummaryPurchases(data.purchases || []);
      });
  }, []);

  // Função para agrupar compras por período
  function groupPurchasesByPeriod(purchases, period) {
    const groups = {};
    purchases.forEach(purchase => {
      const date = new Date(purchase.createdAt);
      let key = '';
      if (period === 'year') {
        key = date.getFullYear();
      } else if (period === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (period === 'quarter') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
      } else {
        key = date.toLocaleDateString();
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(purchase);
    });
    return groups;
  }

  // Função para calcular indicadores
  function calcIndicators(purchases) {
    const total = purchases.reduce((sum, p) => sum + (p.totalAfterDiscount || 0), 0);
    const ticket = purchases.length ? total / purchases.length : 0;
    const desconto = purchases.reduce((sum, p) => sum + (p.discount || 0), 0);
    const fornecedoresUnicos = new Set();
    const produtosComprados = {};
    let maiorCompra = 0;
    let menorCompra = null;
    purchases.forEach(purchase => {
      if (purchase.supplierName) fornecedoresUnicos.add(purchase.supplierName);
      if (purchase.totalAfterDiscount > maiorCompra) maiorCompra = purchase.totalAfterDiscount;
      if (menorCompra === null || purchase.totalAfterDiscount < menorCompra) menorCompra = purchase.totalAfterDiscount;
      purchase.products.forEach(p => {
        produtosComprados[p.product] = (produtosComprados[p.product] || 0) + p.quantity;
      });
    });
    const produtosDiferentes = Object.keys(produtosComprados).length;
    const unidadesMaisCompradas = Object.values(produtosComprados).length > 0 ? Math.max(...Object.values(produtosComprados)) : 0;
    const unidadesMenosCompradas = Object.values(produtosComprados).length > 0 ? Math.min(...Object.values(produtosComprados)) : 0;
    return {
      total,
      ticket,
      desconto,
      compras: purchases.length,
      fornecedoresUnicos: fornecedoresUnicos.size,
      produtosDiferentes,
      maiorCompra,
      menorCompra: menorCompra === null ? 0 : menorCompra,
      unidadesMaisCompradas,
      unidadesMenosCompradas
    };
  }

  // Função para obter dados de evolução
  const getEvolutionData = () => {
    let purchases = summaryPurchases;
    if (startDate) {
      purchases = purchases.filter(purchase => new Date(purchase.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      purchases = purchases.filter(purchase => new Date(purchase.createdAt) <= new Date(endDate + 'T23:59:59'));
    }
    const grouped = groupPurchasesByPeriod(purchases, periodType);
    return Object.entries(grouped).map(([period, purchases]) => {
      const ind = calcIndicators(purchases);
      return { period, ...ind };
    }).sort((a, b) => a.period.localeCompare(b.period));
  };

  const handleIndicatorChange = (indicator) => {
    setSelectedIndicators(prev => ({ ...prev, [indicator]: !prev[indicator] }));
  };

  // KPIs principais para cards e exportação
  const totalPurchases = summaryPurchases.length;
  const totalVolume = summaryPurchases.reduce((sum, p) => sum + (p.totalAfterDiscount || 0), 0);
  const fornecedoresTotais = {};
  summaryPurchases.forEach(purchase => {
    if (purchase.supplierName) {
      fornecedoresTotais[purchase.supplierName] = (fornecedoresTotais[purchase.supplierName] || 0) + (purchase.totalAfterDiscount || 0);
    }
  });
  const topSuppliers = Object.entries(fornecedoresTotais).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const bestSupplier = topSuppliers[0]?.name || '-';
  const bestSupplierQty = topSuppliers[0]?.value || 0;

  // Filtro para exportação
  const filteredPurchases = (() => {
    let purchases = summaryPurchases;
    if (startDate) purchases = purchases.filter(purchase => new Date(purchase.createdAt) >= new Date(startDate));
    if (endDate) purchases = purchases.filter(purchase => new Date(purchase.createdAt) <= new Date(endDate + 'T23:59:59'));
    return purchases;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-indigo-700 text-center drop-shadow">Estatísticas de Compras</h1>
          <button
            onClick={() => exportReport({
              filteredPurchases,
              totalVolume,
              totalPurchases,
              bestSupplier,
              bestSupplierQty
            })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition"
            style={{ minWidth: 180 }}
          >
            Gerar Relatório CSV
          </button>
        </div>

        {/* Indicadores e gráficos principais */}
        <IndicatorsRow
          volumeCompras={totalVolume}
          ticketMedioCompras={totalPurchases > 0 ? totalVolume / totalPurchases : 0}
          totalDescontosCompras={summaryPurchases.reduce((sum, p) => sum + (p.discount || 0), 0)}
          totalCompras={totalPurchases}
          fornecedorTop={bestSupplier}
          valorFornecedorTop={bestSupplierQty}
          fornecedoresUnicos={new Set(summaryPurchases.map(p => p.supplierName))}
          produtosDiferentesComprados={new Set(summaryPurchases.flatMap(p => p.products.map(pr => pr.product)))}
          maiorCompra={Math.max(...summaryPurchases.map(p => p.totalAfterDiscount || 0), 0)}
          menorCompra={Math.min(...summaryPurchases.map(p => p.totalAfterDiscount || Infinity))}
          fornecedorMaisComprou={{ nome: bestSupplier, valor: bestSupplierQty }}
          fornecedorMenosComprou={topSuppliers[topSuppliers.length - 1]?.name || '-'}
          valorFornecedorMenosComprou={topSuppliers[topSuppliers.length - 1]?.value || 0}
          getEvolutionData={getEvolutionData}
          summaryPurchases={summaryPurchases}
        />

        {/* Filtros avançados (modularizado) */}
        <AdvancedFilters
          periodType={periodType}
          setPeriodType={setPeriodType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedIndicators={selectedIndicators}
          handleIndicatorChange={handleIndicatorChange}
        />

        {/* Gráfico de evolução dos indicadores (modularizado) */}
        <EvolutionChart
          chartType={chartType}
          setChartType={setChartType}
          getEvolutionData={getEvolutionData}
          selectedIndicators={selectedIndicators}
        />

        {/* ... */}
      </div>
    </div>
  );
}
