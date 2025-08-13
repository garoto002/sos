"use client";
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import SalesTableRow from "./SalesTableRow";
import SalesTableFull from './SalesTableFull';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import exportSalesPDF from '../utils/exportSalesPDF';
import SalesGraphs from '@/components/SalesGraphs';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Collapse, Container, Divider, Drawer, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Modal, RadioGroup, Select, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CheckBox, Delete, Padding, PictureAsPdf, Edit, Info, Receipt } from "@mui/icons-material";
import SaleReceiptModal from './SaleReceiptModal';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

export function handlePrintPDF(sales, periodLabel, logoBase64) {
  // Optionally, you can provide a logo as base64 (e.g., import logo from '../public/images/logo.png')
  exportSalesPDF({
    sales,
    periodLabel,
    logoBase64,
  });
}

export default function SalesCards({ sales = [], isLoading = false, onEdit, onDelete, onExportPDF }) {
  // Estados para controle do modal de recibo
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [key, setKey] = useState(0); // Força re-renderização

  // Força uma re-renderização quando o componente montar
  useEffect(() => {
    setKey(prev => prev + 1);
  }, []);
  
  const handleOpenReceipt = (sale) => {
    setSelectedSale(sale);
    setReceiptModalOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptModalOpen(false);
    setSelectedSale(null);
  };

  const formatNumbers = (value) => {
    return value.toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2, 
    });
  };

  const handleExpandClick = (index) => {
    // Crie uma cópia do array de estados de expansão e atualize apenas o estado correspondente ao card clicado
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
};

  // Para deletar, pode-se emitir um evento para o pai ou recarregar via props
  const handleDeleteSale = (id, setIsDeleting) => {
    setIsDeleting(true);
    fetch("/api/sales/" + id, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ocorreu um erro deletando a venda com o id " + id);
        } else {
          return res;
        }
      })
      .then(() => {
        setIsDeleting(false);
        // Ideal: emitir evento para o pai recarregar as vendas
      })
      .catch((err) => {
        alert("Ocorreu um erro deletando a venda com o id " + id);
        setIsDeleting(false);
        console.log(err);
      });
  };

  const handleFilterChange = (field, value) => {
    if (field === "start") {
      setStartDate(value);
    } else if (field === "end") {
      setEndDate(value);
    } else if (field === "option") {
      setFilterOption(value);
      setSelectedMonth("");
      setSelectedDay("");
      setSelectedYear("");
    } else if (field === "month") {
      setSelectedMonth(value);
    } else if (field === "day") {
      setSelectedDay(value);
    } else if (field === "year") {
      setSelectedYear(value);
    } else if (field === "category") {
      setSelectedCategory(value);
    } else if (field === "minValue") {
      setMinSaleValue(value);
    } else if (field === "maxValue") {
      setMaxSaleValue(value);
    } else if (field === "customName") {
      setCustomName(value);
    } else if (field === "product") {
      setProduct(value);
    } else if (field === "mostSold") {
      setFilterByMostSold(!filterByMostSold);
    } else if (field === "leastSold") {
      setFilterByLeastSold(!filterByLeastSold);
    }

    const filteredSalesData = getFilteredSalesData();
    setGraphData(filteredSalesData);
  };

  const getFilteredSalesData = () => {
    const filteredSales = getFilteredSales();
    const labels = filteredSales.map((sale, index) => `Venda ${index + 1}`);
    const values = filteredSales.map((sale) => sale.totalAfterDiscount);

    return { labels, values };
  };

  const getFilteredSales = () => {
    const sortedSales = [...sales];

    sortedSales.sort((a, b) => {
      const totalQuantityA = a.products.reduce((acc, product) => acc + product.quantity, 0);
      const totalQuantityB = b.products.reduce((acc, product) => acc + product.quantity, 0);
      return totalQuantityB - totalQuantityA;
    });

    const mostSoldProduct = sortedSales.length > 0 ? sortedSales[0].products[0].product : "";
    const leastSoldProduct = sortedSales.length > 0 && sortedSales[sortedSales.length - 1].products.length > 0 ? sortedSales[sortedSales.length - 1].products[0].product : "";

    return sales.filter((sale) => {
      const meetsMostSoldFilter = filterByMostSold ? sale.products.some((product) => product.product === mostSoldProduct) : true;
      const meetsLeastSoldFilter = filterByLeastSold ? sale.products.some((product) => product.product === leastSoldProduct) : true;

      const meetsDateFilter =
        (startDate && new Date(sale.createdAt) >= new Date(startDate)) ||
        !startDate;
      const meetsEndDateFilter =
        (endDate && new Date(sale.createdAt) <= new Date(endDate)) || !endDate;

      const meetsMonthFilter =
        filterOption === "month"
          ? selectedMonth && new Date(sale.createdAt).getMonth() + 1 === parseInt(selectedMonth)
          : true;
      const meetsDayFilter =
        filterOption === "day"
          ? selectedDay && new Date(sale.createdAt).getDate() === parseInt(selectedDay)
          : true;
      const meetsYearFilter =
        filterOption === "year"
          ? selectedYear && new Date(sale.createdAt).getFullYear() === parseInt(selectedYear)
          : true;

      const meetsCategoryFilter = selectedCategory
        ? sale.products.some((product) => product.category === selectedCategory)
        : true;
      const meetsMinValueFilter = minSaleValue
        ? sale.totalAfterDiscount >= parseFloat(minSaleValue)
        : true;
      const meetsMaxValueFilter = maxSaleValue
        ? sale.totalAfterDiscount <= parseFloat(maxSaleValue)
        : true;
      const meetsCustomNameFilter = customName
        ? sale.customName.toLowerCase().includes(customName.toLowerCase())
        : true;
      const meetsProductFilter = product
        ? sale.products.some((saleProduct) =>
            saleProduct.product.toLowerCase().includes(product.toLowerCase())
          )
        : true;

      return (
        meetsDateFilter &&
        meetsEndDateFilter &&
        meetsMonthFilter &&
        meetsDayFilter &&
        meetsYearFilter &&
        meetsCategoryFilter &&
        meetsMinValueFilter &&
        meetsMaxValueFilter &&
        meetsCustomNameFilter &&
        meetsProductFilter &&
        meetsMostSoldFilter &&
        meetsLeastSoldFilter
      );
    });
  };

  const handleViewGraphs = () => {
    setShowGraphs(true);
  };

  const filteredSales = filteredSalesProp || getFilteredSales();

  const handlePrintPDFLocal = () => {
    handlePrintPDF(filteredSales, `Período: ${getPeriodLabel()}`);
  };

  const getPeriodLabel = () => {
    switch (filterOption) {
      case "month":
        return `Mês: ${new Date(2022, parseInt(selectedMonth, 10) - 1, 1).toLocaleString("pt-PT", { month: "long" })}`;
      case "day":
        return `Dia: ${parseInt(selectedDay, 10)}`;
      case "year":
        return `Ano: ${selectedYear}`;
      default:
        return "Todos";
    }
  };
  console.log(filteredSales)
  console.log(selectedMonth)
  return (
    <>
    <Drawer open={menuOpen} onClose={() => handleToggleMenu()}>
        <Typography variant="h5" sx={{fontSize: '16px', textTransform: "uppercase", padding: '8px 16px'}}>
          Filtrar Por
        </Typography>
     
        <FormControl  sx={{margin: '8px 16px'}}>
          <InputLabel id="filterByLabel">Período</InputLabel>
          <Select
            label="Período"
            id="filterOption"
            value={filterOption}
            onChange={(e) => handleFilterChange("option", e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="year">Ano</MenuItem>
            <MenuItem value="month">Mês</MenuItem>
            <MenuItem value="day">Dia</MenuItem>
          </Select>
        </FormControl>
        {filterOption === "month" && (
          <FormControl  sx={{margin: '8px 16px'}}>
            <InputLabel id="monthLabel">Mês</InputLabel>
            <Select
              label="Mês"
              labelId="monthLabel"
              id="selectedMonth"
              value={selectedMonth}
              onChange={(e) => handleFilterChange("month", e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <MenuItem key={month} value={month}>
                  {new Date(2022, month - 1, 1).toLocaleString("pt-PT", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {filterOption === "day" && (
          
          <FormControl  sx={{margin: '8px 16px'}}>
            <InputLabel id="dayLabel" >Dia</InputLabel>
            <Select
              label="Dia"
              labelId="dayLabel"
              value={selectedDay}
              onChange={(e) => handleFilterChange("day", e.target.value)}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
         
        )}
        {filterOption === "year" && (
         
          <FormControl sx={{margin: '8px 16px'}}>
            <InputLabel id="yearLabel">Ano</InputLabel>
            <Select
              label="Ano"
              labelId="yearLabel"
              id="selectedYear"
              value={selectedYear}
              onChange={(e) => handleFilterChange("year", e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => 2023 + i).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
       
        <FormControl sx={{margin: '16px'}}>
          <InputLabel shrink htmlFor="startDate" sx={{ marginTop: '-8px' }}>A partir de</InputLabel>
          <TextField 
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => handleFilterChange("start", e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />
        </FormControl>
            
        <FormControl sx={{margin: '16px 16px 8px'}}>
          <InputLabel shrink htmlFor="endDate" sx={{ MarginTop: '-8px' }}>Até</InputLabel>
          <TextField 
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => handleFilterChange("end", e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />
        </FormControl>
        
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField
            label="Cliente"
            type="text"
            id="customName"
            value={customName}
            onChange={(e) => handleFilterChange("customName", e.target.value)}
          />
        </FormControl>
        
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField
            label="Produto"
            type="text"
            id="product"
            value={product}
            onChange={(e) => handleFilterChange("product", e.target.value)}
          />
        </FormControl>
            
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField
            label="Valor Mínimo de venda"
            type="number"
            id="minSaleValue"
            value={minSaleValue}
            onChange={(e) => handleFilterChange("minValue", e.target.value)}
          />
        </FormControl>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField
            label="Valor Máximo de venda"
            type="number"
            id="maxSaleValue"
            value={maxSaleValue}
            onChange={(e) => handleFilterChange("maxValue", e.target.value)}
          />
        </FormControl>

        <Box component="span" sx={{margin: '8px 16px 2px'}}> 
          <label htmlFor="filterByMostSold" style={{fontSize: '16px', fontWeight: '4000', marginRight: '8px'}}>
            Produto mais vendido:
          </label>
          <input
            type="checkbox"
            id="filterByMostSold"
            checked={filterByMostSold}
            onChange={() => handleFilterChange("mostSold")}
          />
        </Box>
        <Box component="span" sx={{margin: '2px 16px 8px'}}>
          <label htmlFor="filterByMostSold" style={{fontSize: '16px', fontWeight: '4000', marginRight: '8px'}}>
            Produto menos vendido:
          </label>
          <input
            type="checkbox"
            id="filterByLeastSold"
            checked={filterByLeastSold}
            onChange={() => handleFilterChange("leastSold")}
          />
        </Box> 

    </Drawer>
    <Container maxWidth="xl" sx={{marginTop: '24px'}}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 mb-2 md:mb-0">
          <button disabled={isLoading} onClick={handleToggleMenu} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
            Filtrar
          </button>
          {/* Botão de exportação PDF removido, agora centralizado na página principal */}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <span className="text-lg font-semibold text-blue-700">Vendas Registadas: {filteredSales.length}</span>
          <span className="text-lg font-semibold text-green-600">Volume de vendas: {filteredSales.reduce((totalAfterDiscount, sale) => totalAfterDiscount + sale.totalAfterDiscount, 0)}</span>
        </div>
      </div>
        
      {showTable ? (
        <SalesTableFull sales={sales} isLoading={isLoading} />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredSales.map((sale, index) => (
            <div key={sale._id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full border border-blue-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 truncate">{sale.customName}</h2>
                    <div className="text-yellow-600 font-semibold text-base">{Number(sale.totalAfterDiscount).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{sale.products.length} produtos</span>
                </div>
                <div className="text-gray-500 text-sm mb-1">Produtos: <span className="font-semibold text-gray-700">{sale.products.map(p => p.product).join(', ') || '-'}</span></div>
                <div className="text-gray-500 text-sm mb-1">Data: <span className="font-semibold text-gray-700">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : '-'}</span></div>
                <div className="text-gray-500 text-sm mb-1">Cliente: <span className="font-semibold text-green-700">{sale.customName || '-'}</span></div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex gap-4 justify-center">
                  <IconButton
                    title="PDF"
                    aria-label="PDF"
                    onClick={() => onExportPDF ? onExportPDF(sale) : window.open(`/api/sales/${sale._id}/pdf`, '_blank')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                  >
                    <PictureAsPdf fontSize="medium" />
                  </IconButton>
                  <button
                    onClick={() => handleOpenReceipt(sale)}
                    className="flex items-center justify-center w-10 h-10 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg shadow transition"
                    title="Ver Recibo"
                  >
                    <span className="material-icons" style={{ fontSize: '20px' }}>receipt</span>
                  </button>
                  <IconButton
                    title="Editar"
                    aria-label="Editar"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
                    onClick={() => onEdit ? onEdit(sale) : window.location.href = `/sales/${sale._id}`}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton 
                    title="Detalhes" 
                    aria-label="Detalhes" 
                    onClick={() => { setModalSale(sale); setModalOpen(true); }} 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                  >
                    <Info fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Deletar"
                    aria-label="Deletar"
                    disabled={isLoading}
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover esta venda?')) {
                        if (typeof sale._id !== 'undefined') {
                          fetch(`/api/sales/${sale._id}`, { method: 'DELETE' })
                            .then((res) => {
                              if (!res.ok) throw new Error();
                              window.location.reload();
                            })
                            .catch(() => alert('Erro ao deletar venda.'));
                        }
                      }
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
                  >
                    <Delete fontSize="medium" />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal de Detalhes */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
            {modalSale && (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Detalhes da Venda</h2>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Cliente:</span> {modalSale.customName}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Data:</span> {modalSale.createdAt ? new Date(modalSale.createdAt).toLocaleDateString() : '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Produtos:</span> {modalSale.products.map(p => `${p.product} (${p.quantity})`).join(', ') || '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Subtotal:</span> <span className="text-indigo-700 font-bold">{Number(modalSale.subtotal).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">IVA:</span> <span className="text-blue-700 font-bold">{Number(modalSale.totalIva).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Desconto:</span> <span className="text-yellow-700 font-bold">{Number(modalSale.discount).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Total:</span> <span className="text-green-700 font-bold">{Number(modalSale.totalAfterDiscount).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Valor Pago:</span> <span className="text-blue-700 font-bold">{Number(modalSale.receivedAmount).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Valor em Dívida:</span> <span className="text-red-700 font-bold">{Number(modalSale.debtOrChange).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Descrição:</span> <span className="text-indigo-700 font-bold">{modalSale.description}</span></div>
                {modalSale.user && (
                  <div className="mb-2 text-gray-700">
                    <span className="font-semibold">Vendedor:</span>{" "}
                    {modalSale.user.name}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      {receiptModalOpen && (
        <SaleReceiptModal 
          open={receiptModalOpen}
          handleClose={handleCloseReceipt}
          sale={selectedSale}
        />
      )}
    </>
  );
}