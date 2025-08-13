import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import IndicatorOverviewModal from './IndicatorOverviewModal';
import { useState } from 'react';


export default function IndicatorsRow(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [chartType, setChartType] = useState('line');
  // Filtros para os overviews
  // Listas para filtros dinâmicos
  // Suporte para compras e vendas
  const summary = props.summaryPurchases || props.summarySales || [];
  const allProducts = Array.from(new Set(summary.flatMap(item => item.products?.map(p => p.product) || [])));
  const allSuppliers = Array.from(new Set(summary.map(item => item.supplierName).filter(Boolean)));
  const allClients = Array.from(new Set(summary.map(item => item.customName).filter(Boolean)));
  const [overviewFilters, setOverviewFilters] = useState({
    periodType: 'month',
    startDate: '',
    endDate: '',
    product: '',
    client: ''
  });

  // Função para obter evolução real do indicador
  function getIndicatorEvolution(indicator) {
    if (!indicator || !props.getEvolutionData) return [];
    let data = props.getEvolutionData();
    if (isFornecedores) {
      // Só filtra por período para fornecedores
      if (overviewFilters.startDate) {
        data = data.filter(d => new Date(d.period) >= new Date(overviewFilters.startDate));
      }
      if (overviewFilters.endDate) {
        data = data.filter(d => new Date(d.period) <= new Date(overviewFilters.endDate + 'T23:59:59'));
      }
      // Para cada indicador, retorna o valor correto
      return data.map(d => ({ period: d.period, value: d[indicator.key] ?? 0 }));
    } else {
      // ...lógica antiga de vendas/compras...
      if (overviewFilters.startDate) {
        data = data.filter(d => new Date(d.period) >= new Date(overviewFilters.startDate));
      }
      if (overviewFilters.endDate) {
        data = data.filter(d => new Date(d.period) <= new Date(overviewFilters.endDate + 'T23:59:59'));
      }
      if (overviewFilters.product && ['produtoMaisVendido','produtoMenosVendido'].includes(indicator.key)) {
        data = data.filter(d => d.produtoMaisVendido === overviewFilters.product || d.produtoMenosVendido === overviewFilters.product);
      }
      if (overviewFilters.client && indicator.key === 'clienteMaisComprou') {
        data = data.filter(d => d.clienteMaisComprou?.nome === overviewFilters.client);
      }
      switch (indicator.key) {
        case 'produtoMaisVendido':
          return data.map(d => ({
            period: d.period,
            value: d.unidadesMaisVendidas || 0,
            label: d.produtoMaisVendido || '-'
          }));
        case 'produtoMenosVendido':
          return data.map(d => ({
            period: d.period,
            value: d.unidadesMenosVendidas || 0,
            label: d.produtoMenosVendido || '-'
          }));
        case 'clienteMaisComprou':
          return data.map(d => ({
            period: d.period,
            value: d.clienteMaisComprou?.valor || 0,
            label: d.clienteMaisComprou?.nome || '-'
          }));
        case 'produtosDiferentes':
          return data.map(d => ({ period: d.period, value: d.produtosDiferentes || 0 }));
        case 'clientesUnicos':
          return data.map(d => ({ period: d.period, value: d.clientesUnicos || 0 }));
        default:
          return data.map(d => ({ period: d.period, value: d[indicator.key] ?? 0 }));
      }
    }
  }

  // Indicadores de fornecedores
  const isFornecedores =
    props.totalFornecedores !== undefined ||
    props.categorias !== undefined ||
    props.fornecedorMaisAntigo !== undefined ||
    props.fornecedorMaisRecente !== undefined ||
    props.nomeMaisLongo !== undefined;

  let indicators = [];
  if (isFornecedores) {
    indicators = [
      {
        key: 'totalFornecedores',
        label: 'Total de Fornecedores',
        value: props.totalFornecedores,
        desc: 'Quantidade total de fornecedores cadastrados.',
        isCurrency: false,
      },
      {
        key: 'categorias',
        label: 'Categorias de Fornecedores',
        value: props.categorias,
        desc: 'Quantidade de categorias distintas de fornecedores.',
        isCurrency: false,
      },
      {
        key: 'fornecedorMaisAntigo',
        label: 'Fornecedor Mais Antigo',
        value: props.fornecedorMaisAntigo,
        desc: 'Fornecedor cadastrado há mais tempo.',
        isCurrency: false,
      },
      {
        key: 'fornecedorMaisRecente',
        label: 'Fornecedor Mais Recente',
        value: props.fornecedorMaisRecente,
        desc: 'Fornecedor cadastrado mais recentemente.',
        isCurrency: false,
      },
      {
        key: 'nomeMaisLongo',
        label: 'Nome Mais Longo',
        value: props.nomeMaisLongo,
        desc: 'Fornecedor com o nome mais longo.',
        isCurrency: false,
      },
    ];
  } else {
    // ...código antigo de vendas e compras...
    const isCompras = !!props.volumeCompras || !!props.totalCompras;
    indicators = isCompras ? [
      // ...indicadores de compras...
    ] : [
      // ...indicadores de vendas...
    ];
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-2 tracking-tight">
        {isFornecedores ? 'Resumo Visual dos Fornecedores' : 'Resumo Visual das Vendas'}
      </h2>
      <p className="text-base text-blue-800 mb-6 opacity-80">
        {isFornecedores
          ? 'Clique em qualquer indicador para ver sua evolução detalhada e aplicar filtros dinâmicos sobre fornecedores.'
          : 'Clique em qualquer indicador para ver sua evolução detalhada e aplicar filtros dinâmicos.'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {indicators.map(ind => (
          <button
            key={ind.key}
            className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-4 flex flex-col items-center hover:scale-105 transition cursor-pointer border-2 border-transparent hover:border-blue-400 focus:outline-none"
            title={ind.desc}
            onClick={() => {
              setSelectedIndicator(ind);
              setModalOpen(true);
              setChartType('line');
            }}
          >
            <span className="text-xs text-blue-700 font-semibold mb-1 text-center">{ind.label}</span>
            <span className="text-2xl font-extrabold text-blue-900 mb-1 text-center">
              {ind.isCurrency && typeof ind.value === 'number'
                ? ind.value.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })
                : ind.value}
            </span>
            {ind.extra && <span className="text-xs text-blue-500">{ind.extra}</span>}
          </button>
        ))}
      </div>

      {/* Modal de overview do indicador */}
      <IndicatorOverviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        indicator={selectedIndicator}
        data={selectedIndicator ? getIndicatorEvolution(selectedIndicator) : []}
        chartType={chartType}
        setChartType={setChartType}
        filters={overviewFilters}
        setFilters={setOverviewFilters}
        allProducts={isFornecedores ? [] : allProducts}
        allClients={isFornecedores ? [] : allClients}
      />
    </section>
  );
}