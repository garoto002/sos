import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

export default function IndicatorOverviewModal({ open, onClose, indicator, data, chartType, setChartType, filters, setFilters, allProducts = [], allClients = [] }) {
  if (!indicator) return null;

  // Exemplo de opções de gráfico
  const chartOptions = [
    { value: "line", label: "Linha" },
    { value: "bar", label: "Barra" },
    { value: "pie", label: "Pizza" },
  ];

  // Exemplo de cores
  const COLORS = ["#6366f1", "#06b6d4", "#f59e42", "#f43f5e", "#84cc16", "#fbbf24"];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="font-bold text-blue-900 text-lg">{indicator.label || indicator.name} - Overview</span>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Filtros dinâmicos */}
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <label className="font-medium text-blue-700">Tipo de Gráfico:</label>
          <select value={chartType} onChange={e => setChartType(e.target.value)} className="border rounded px-2 py-1">
            {chartOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <label className="font-medium text-blue-700 ml-4">Período:</label>
          <select value={filters.periodType} onChange={e => setFilters(f => ({ ...f, periodType: e.target.value }))} className="border rounded px-2 py-1">
            <option value="year">Ano</option>
            <option value="quarter">Trimestre</option>
            <option value="month">Mês</option>
            <option value="day">Dia</option>
          </select>
          <label className="font-medium text-blue-700 ml-4">De:</label>
          <input type="date" value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} className="border rounded px-2 py-1" />
          <label className="font-medium text-blue-700 ml-2">Até:</label>
          <input type="date" value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} className="border rounded px-2 py-1" />
          {/* Filtros funcionais */}
          {['produtoMaisVendido','produtoMenosVendido'].includes(indicator.key) && (
            <>
              <label className="font-medium text-blue-700 ml-4">Produto:</label>
              <select value={filters.product} onChange={e => setFilters(f => ({ ...f, product: e.target.value }))} className="border rounded px-2 py-1">
                <option value="">Todos</option>
                {allProducts.map(prod => <option key={prod} value={prod}>{prod}</option>)}
              </select>
            </>
          )}
          {indicator.key === 'clienteMaisComprou' && (
            <>
              <label className="font-medium text-blue-700 ml-4">Cliente:</label>
              <select value={filters.client} onChange={e => setFilters(f => ({ ...f, client: e.target.value }))} className="border rounded px-2 py-1">
                <option value="">Todos</option>
                {allClients.map(cli => <option key={cli} value={cli}>{cli}</option>)}
              </select>
            </>
          )}
        </div>
        {/* Gráfico dinâmico */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" && (
              <LineChart data={data}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name={indicator.label || indicator.name} stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            )}
            {chartType === "bar" && (
              <BarChart data={data}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name={indicator.label || indicator.name} fill="#6366f1" />
              </BarChart>
            )}
            {chartType === "pie" && (
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="period" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
