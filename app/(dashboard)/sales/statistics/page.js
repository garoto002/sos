
"use client";
import { useEffect, useState } from "react";
import { Button, CircularProgress } from '@mui/material';
import { PictureAsPdf, FilterList } from '@mui/icons-material';
import DashboardAnalytics from '../../../../components/DashboardAnalytics';

export default function SalesStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Estados para filtros
  const [dateRange, setDateRange] = useState('month');
  const [customerDateStart, setCustomerDateStart] = useState('');
  const [customerDateEnd, setCustomerDateEnd] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [groupBy, setGroupBy] = useState('day');

  // Função para gerar relatório
  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      
      const response = await fetch('/api/sales/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange,
          customerDateStart,
          customerDateEnd,
          minValue,
          maxValue,
          paymentMethod,
          groupBy
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      // Converter resposta para blob
      const blob = await response.blob();
      
      // Criar URL do blob
      const url = window.URL.createObjectURL(blob);
      
      // Criar link e fazer download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio-vendas.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Limpar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGeneratingReport(false);
    }
  };

  useEffect(() => {
    // Buscar dados de vendas
    fetch('/api/sales')
      .then(res => res.json())
      .then(data => {
        setSalesData(data.sales || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar vendas:', error);
        setLoading(false);
      });

    // Buscar dados de clientes
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setClientsData(data.customers || data || []);
      })
      .catch(error => console.error('Erro ao buscar clientes:', error));
  }, []);

  if (loading) return <div className="text-center mt-16">Carregando estatísticas...</div>;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden flex flex-col">
      {/* Cabeçalho com Filtros */}
      <div className="bg-white/50 backdrop-blur border-b border-indigo-100 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-indigo-700">
            Dashboard de Vendas
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Período */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-indigo-200 bg-white/80"
            >
              <option value="today">Hoje</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="year">Este Ano</option>
              <option value="custom">Período Personalizado</option>
            </select>

            {/* Filtros */}
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => document.getElementById('filtersPanel').classList.toggle('hidden')}
              className="bg-white/80"
            >
              Filtros
            </Button>

            {/* Botão Relatório */}
            <Button
              variant="contained"
              color="primary"
              startIcon={generatingReport ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
              onClick={handleGenerateReport}
              disabled={generatingReport}
            >
              {generatingReport ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>
        </div>

        {/* Painel de Filtros */}
        <div id="filtersPanel" className="hidden mt-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm mb-1">Data Inicial</label>
                  <input
                    type="date"
                    value={customDateStart}
                    onChange={(e) => setCustomDateStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Data Final</label>
                  <input
                    type="date"
                    value={customDateEnd}
                    onChange={(e) => setCustomDateEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm mb-1">Valor Mínimo</label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Valor Máximo</label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Forma de Pagamento</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              >
                <option value="all">Todas</option>
                <option value="cash">Dinheiro</option>
                <option value="card">Cartão</option>
                <option value="transfer">Transferência</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto p-4">
        <DashboardAnalytics 
          salesData={salesData} 
          clientsData={clientsData}
          dateRange={dateRange}
          customDateStart={customDateStart}
          customDateEnd={customDateEnd}
          minValue={minValue}
          maxValue={maxValue}
          paymentMethod={paymentMethod}
          groupBy={groupBy}
        />
      </div>
    </div>
  );
}
