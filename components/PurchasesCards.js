"use client";

import React, { useState, useEffect } from "react";
import { formatMetical } from '../utils/formatMetical';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Container, Divider, Drawer, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Delete } from "@mui/icons-material";
import { Edit, Info, PictureAsPdf } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export default function PurchasesCards() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPurchase, setModalPurchase] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Filtros locais (pode ser expandido conforme necessário)
  const [search, setSearch] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  useEffect(() => {
    setIsLoadingPurchases(true);
    fetch("/api/purchases")
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data.purchases || []);
        setIsLoadingPurchases(false);
      })
      .catch(() => setIsLoadingPurchases(false));
  }, []);

  // Filtro
  const filteredPurchases = purchases.filter(p => {
    return (
      (!search || (p.supplierName && p.supplierName.toLowerCase().includes(search.toLowerCase()))) &&
      (!minValue || p.totalAfterDiscount >= parseFloat(minValue)) &&
      (!maxValue || p.totalAfterDiscount <= parseFloat(maxValue))
    );
  });

  // KPIs
  const total = filteredPurchases.length;
  const totalValue = filteredPurchases.reduce((acc, p) => acc + (p.totalAfterDiscount || 0), 0);

  // Modal
  const handleOpenModal = (purchase) => {
    setModalPurchase(purchase);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalPurchase(null);
  };

  // Delete
  const handleDeletePurchase = async (id) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPurchases(prev => prev.filter(p => p._id !== id));
      }
    } catch {}
    setIsDeleting(false);
  };

  return (
    <>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Typography variant="h5" sx={{fontSize: '16px', textTransform: "uppercase", padding: '8px 16px'}}>
          Filtrar Compras
        </Typography>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Fornecedor" value={search} onChange={e => setSearch(e.target.value)} />
        </FormControl>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Valor Mínimo" type="number" value={minValue} onChange={e => setMinValue(e.target.value)} />
        </FormControl>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Valor Máximo" type="number" value={maxValue} onChange={e => setMaxValue(e.target.value)} />
        </FormControl>
      </Drawer>
      <Container maxWidth="xl" sx={{marginTop: '24px'}}>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button disabled={isLoadingPurchases} onClick={() => setMenuOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
            Filtrar
          </button>
          <div className="flex flex-col md:flex-row gap-4">
            <span className="text-lg font-semibold text-blue-700">Compras: {total}</span>
            <span className="text-lg font-semibold text-green-600">Volume total: {formatMetical(totalValue)}</span>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full border border-blue-100">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-800 truncate">{purchase.supplierName || 'Sem fornecedor'}</h2>
                      <div className="text-green-700 font-semibold text-base">{formatMetical(purchase.totalAfterDiscount || 0)}</div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{purchase.status || 'N/A'}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">Data: <span className="font-semibold text-gray-700">{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : '-'}</span></div>
                  <div className="text-gray-500 text-sm mb-1">Usuário: <span className="font-semibold text-green-700">{purchase.user?.firstName} {purchase.user?.lastName}</span></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="flex gap-4 justify-center mb-2">
                    <IconButton
                      title="PDF"
                      aria-label="PDF"
                      onClick={() => onPdf && onPdf(purchase)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                    >
                      <PictureAsPdf fontSize="medium" />
                    </IconButton>
                    <IconButton
                      title="Editar"
                      aria-label="Editar"
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
                      onClick={() => onEdit && onEdit(purchase)}
                    >
                      <Edit fontSize="medium" />
                    </IconButton>
                    <IconButton
                      title="Detalhes"
                      aria-label="Detalhes"
                      onClick={() => onDetails && onDetails(purchase)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                    >
                      <Info fontSize="medium" />
                    </IconButton>
                    <IconButton
                      title="Deletar"
                      aria-label="Deletar"
                      onClick={() => onDelete && onDelete(purchase)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
                    >
                      <Delete fontSize="medium" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-12 col-span-full">Nenhuma compra encontrada.</div>
          )}
        </div>
        {isLoadingPurchases && (
          <p className="mt-16 text-center">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-6" />
          </p>
        )}
        {/* Modal Detalhes */}
        <div>
          {modalOpen && modalPurchase && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Detalhes da Compra</h2>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Fornecedor:</span> {modalPurchase.supplierName || '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Data:</span> {modalPurchase.createdAt ? new Date(modalPurchase.createdAt).toLocaleDateString() : '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Produtos:</span> {modalPurchase.products && modalPurchase.products.map(p => `${p.product} (${p.quantity})`).join(', ') || '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Subtotal:</span> <span className="text-indigo-700 font-bold">{formatMetical(modalPurchase.subtotal)}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">IVA:</span> <span className="text-blue-700 font-bold">{formatMetical(modalPurchase.totalIva)}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Desconto:</span> <span className="text-yellow-700 font-bold">{formatMetical(modalPurchase.discount)}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Total:</span> <span className="text-green-700 font-bold">{formatMetical(modalPurchase.totalAfterDiscount)}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Usuário:</span> <span className="text-pink-700 font-bold">{modalPurchase.user?.firstName} {modalPurchase.user?.lastName}</span></div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}