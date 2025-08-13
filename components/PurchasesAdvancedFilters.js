import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, PictureAsPdf, Info } from '@mui/icons-material';

export default function PurchasesAdvancedFilters({
  categories = [],
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  supplierName,
  setSupplierName,
  selectedCategory,
  setSelectedCategory,
  filterOption,
  setFilterOption,
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
  selectedYear,
  setSelectedYear,
  onEdit,
  onDelete,
  onDetails,
  onPdf
}) {
  return (
    <Box className="flex flex-wrap gap-4 mb-4 items-end">
      {/* Botões de ação padrão */}
      <Box className="flex gap-4 justify-center">
        <Tooltip title="PDF">
          <IconButton
            onClick={onPdf}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
            size="small"
          >
            <PictureAsPdf fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton
            onClick={onEdit}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
            size="small"
          >
            <Edit fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Detalhes">
          <IconButton
            onClick={onDetails}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
            size="small"
          >
            <Info fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deletar">
          <IconButton
            onClick={onDelete}
            className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
            size="small"
          >
            <Delete fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Box>
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel id="filterByLabel">Período</InputLabel>
        <Select
          labelId="filterByLabel"
          value={filterOption}
          label="Período"
          onChange={e => {
            setFilterOption(e.target.value);
            setSelectedMonth && setSelectedMonth('');
            setSelectedDay && setSelectedDay('');
            setSelectedYear && setSelectedYear('');
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
        label="Nome do Fornecedor"
        size="small"
        value={supplierName}
        onChange={e => setSupplierName(e.target.value)}
      />
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel id="categoryLabel">Categoria</InputLabel>
        <Select
          labelId="categoryLabel"
          value={selectedCategory}
          label="Categoria"
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Cadastrado a partir de"
        type="date"
        size="small"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Cadastrado até"
        type="date"
        size="small"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
}
