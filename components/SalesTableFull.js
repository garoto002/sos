import React, { useState, useMemo } from 'react';
import { IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { PictureAsPdf, Edit, Info, Delete } from '@mui/icons-material';
import { handlePrintPDF } from './SalesCards';

export default function SalesTableFull({ sales = [], isLoading = false, onDelete, onEdit, onDetails }) {
  // Filtros avançados
  const [filterOption, setFilterOption] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customName, setCustomName] = useState('');
  const [product, setProduct] = useState('');
  const [minSaleValue, setMinSaleValue] = useState('');
  const [maxSaleValue, setMaxSaleValue] = useState('');

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const meetsMonthFilter = filterOption === 'month' ? selectedMonth && new Date(sale.createdAt).getMonth() + 1 === parseInt(selectedMonth) : true;
      const meetsDayFilter = filterOption === 'day' ? selectedDay && new Date(sale.createdAt).getDate() === parseInt(selectedDay) : true;
      const meetsYearFilter = filterOption === 'year' ? selectedYear && new Date(sale.createdAt).getFullYear() === parseInt(selectedYear) : true;
      const meetsStartDate = startDate ? new Date(sale.createdAt) >= new Date(startDate) : true;
      const meetsEndDate = endDate ? new Date(sale.createdAt) <= new Date(endDate) : true;
      const meetsCustomName = customName ? sale.customName?.toLowerCase().includes(customName.toLowerCase()) : true;
      const meetsProduct = product ? sale.products.some(p => p.product.toLowerCase().includes(product.toLowerCase())) : true;
      const meetsMinValue = minSaleValue ? sale.totalAfterDiscount >= parseFloat(minSaleValue) : true;
      const meetsMaxValue = maxSaleValue ? sale.totalAfterDiscount <= parseFloat(maxSaleValue) : true;
      return (
        meetsMonthFilter && meetsDayFilter && meetsYearFilter && meetsStartDate && meetsEndDate && meetsCustomName && meetsProduct && meetsMinValue && meetsMaxValue
      );
    });
  }, [sales, filterOption, selectedMonth, selectedDay, selectedYear, startDate, endDate, customName, product, minSaleValue, maxSaleValue]);

  // Helper for period label
  const getPeriodLabel = () => {
    switch (filterOption) {
      case 'month':
        return `Mês: ${selectedMonth ? new Date(2022, parseInt(selectedMonth, 10) - 1, 1).toLocaleString('pt-PT', { month: 'long' }) : ''}`;
      case 'day':
        return `Dia: ${selectedDay}`;
      case 'year':
        return `Ano: ${selectedYear}`;
      default:
        return 'Todos';
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-6 border border-blue-100">
      <Box className="flex flex-wrap gap-4 mb-4 items-end">
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="filterByLabel">Período</InputLabel>
          <Select
            labelId="filterByLabel"
            value={filterOption}
            label="Período"
            onChange={e => {
              setFilterOption(e.target.value);
              setSelectedMonth('');
              setSelectedDay('');
              setSelectedYear('');
            }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="year">Ano</MenuItem>
            <MenuItem value="month">Mês</MenuItem>
            <MenuItem value="day">Dia</MenuItem>
          </Select>
        </FormControl>
        {filterOption === 'month' && (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="monthLabel">Mês</InputLabel>
            <Select
              labelId="monthLabel"
              value={selectedMonth}
              label="Mês"
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <MenuItem key={month} value={month}>{new Date(2022, month - 1, 1).toLocaleString('pt-PT', { month: 'long' })}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {filterOption === 'day' && (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="dayLabel">Dia</InputLabel>
            <Select
              labelId="dayLabel"
              value={selectedDay}
              label="Dia"
              onChange={e => setSelectedDay(e.target.value)}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {filterOption === 'year' && (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="yearLabel">Ano</InputLabel>
            <Select
              labelId="yearLabel"
              value={selectedYear}
              label="Ano"
              onChange={e => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => 2023 + i).map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          label="A partir de"
          type="date"
          size="small"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Até"
          type="date"
          size="small"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Cliente"
          size="small"
          value={customName}
          onChange={e => setCustomName(e.target.value)}
        />
        <TextField
          label="Produto"
          size="small"
          value={product}
          onChange={e => setProduct(e.target.value)}
        />
        <TextField
          label="Valor Mínimo"
          type="number"
          size="small"
          value={minSaleValue}
          onChange={e => setMinSaleValue(e.target.value)}
        />
        <TextField
          label="Valor Máximo"
          type="number"
          size="small"
          value={maxSaleValue}
          onChange={e => setMaxSaleValue(e.target.value)}
        />
        {/* Botão de exportação PDF removido, agora centralizado na página principal */}
      </Box>
      <div className="overflow-x-auto">
        <table className="w-full border border-blue-200 rounded-xl text-xs whitespace-nowrap">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900">
              <th className="px-2 py-1">#</th>
              <th className="px-2 py-1">Cliente</th>
              <th className="px-2 py-1">Produto</th>
              <th className="px-2 py-1 text-right">Preço</th>
              <th className="px-2 py-1 text-right">Qtd</th>
              <th className="px-2 py-1 text-right">IVA</th>
              <th className="px-2 py-1 text-right">Total</th>
              <th className="px-2 py-1 text-right">Subtotal</th>
              <th className="px-2 py-1 text-right">Desconto</th>
              <th className="px-2 py-1 text-right">Total Final</th>
              <th className="px-2 py-1">Data</th>
              <th className="px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={12} className="text-center py-8 text-gray-400">Carregando...</td></tr>
            ) : filteredSales.length === 0 ? (
              <tr><td colSpan={12} className="text-center py-8 text-gray-400">Nenhuma venda encontrada.</td></tr>
            ) : (
              filteredSales.flatMap((sale, i) => (
                sale.products.map((product, idx) => (
                  <tr key={sale._id + '-' + idx} className="border-b border-blue-100 hover:bg-blue-50 transition">
                    <td className="px-2 py-1 font-semibold text-blue-700 text-center">{idx === 0 ? i + 1 : ''}</td>
                    <td className="px-2 py-1">{idx === 0 ? (sale.customName || '-') : ''}</td>
                    <td className="px-2 py-1">{product.product}</td>
                    <td className="px-2 py-1 text-right">{Number(product.price).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 })}</td>
                    <td className="px-2 py-1 text-right">{Number(product.quantity).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}</td>
                    <td className="px-2 py-1 text-right">{(Number(product.ivaRate) * 100).toFixed(0)}%</td>
                    <td className="px-2 py-1 text-right">{Number(product.totalPrice).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 })}</td>
                    <td className="px-2 py-1 text-right">{idx === 0 && sale.subtotal != null ? Number(sale.subtotal).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) : ''}</td>
                    <td className="px-2 py-1 text-right">{idx === 0 && sale.discount != null ? Number(sale.discount).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) : ''}</td>
                    <td className="px-2 py-1 text-right">{idx === 0 && sale.totalAfterDiscount != null ? Number(sale.totalAfterDiscount).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) : ''}</td>
                    <td className="px-2 py-1 text-center">{idx === 0 ? (sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('pt-PT') : '-') : ''}</td>
                    <td className="px-2 py-1 flex gap-1 justify-center">
                      <IconButton size="small" title="PDF" onClick={() => window.open(`/api/sales/${sale._id}/pdf`, '_blank')}><PictureAsPdf fontSize="small" /></IconButton>
                      <IconButton size="small" title="Editar" onClick={() => onEdit && onEdit(sale)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" title="Detalhes" onClick={() => onDetails && onDetails(sale)}><Info fontSize="small" /></IconButton>
                      <IconButton size="small" title="Deletar" onClick={() => onDelete && onDelete(sale)}><Delete fontSize="small" /></IconButton>
                    </td>
                  </tr>
                ))
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
