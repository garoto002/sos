"use client";
import { Delete, Edit, LocalShipping, PictureAsPdf, Info, Visibility } from "@mui/icons-material";
import { Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardActions, CardContent, CardHeader, Collapse, Container, IconButton, List, ListItem, ListItemText, Typography, Drawer, Button, TextField, Modal, Box, FormControl } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

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


export default function SuppliersCards({ onEdit, onDelete, onDetails, onPdf, ...props }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSupplier, setModalSupplier] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [minPurchases, setMinPurchases] = useState("");
  const [maxPurchases, setMaxPurchases] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    setIsLoadingSuppliers(true);
    fetch("/api/suppliers")
      .then((res) => res.json())
      .then((data) => {
        setSuppliers(data.suppliers || []);
        setIsLoadingSuppliers(false);
      })
      .catch(() => setIsLoadingSuppliers(false));
  }, []);

  const handleOpenModal = (supplier) => {
    setModalSupplier(supplier);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalSupplier(null);
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este fornecedor?')) return;
    setIsLoadingSuppliers(true);
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuppliers(prev => prev.filter(s => s._id !== id));
      }
    } catch (e) {}
    setIsLoadingSuppliers(false);
  };
  const filteredSuppliers = suppliers.filter(supplier => {
    return (
      (!search || (supplier.supplierName && supplier.supplierName.toLowerCase().includes(search.toLowerCase()))) &&
      (!category || (supplier.category && supplier.category.toLowerCase().includes(category.toLowerCase()))) &&
      (!phone || (supplier.phone && supplier.phone.toLowerCase().includes(phone.toLowerCase()))) &&
      (!minPurchases || (supplier.purchases || []).length >= parseInt(minPurchases)) &&
      (!maxPurchases || (supplier.purchases || []).length <= parseInt(maxPurchases))
    );
  });

  return (
    <>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Typography variant="h5" sx={{fontSize: '16px', textTransform: "uppercase", padding: '8px 16px'}}>
          Filtrar Fornecedores
        </Typography>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Nome" value={search} onChange={e => setSearch(e.target.value)} />
        </FormControl>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Categoria" value={category} onChange={e => setCategory(e.target.value)} />
        </FormControl>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
        </FormControl>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Compras mín." type="number" value={minPurchases} onChange={e => setMinPurchases(e.target.value)} />
        </FormControl>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Compras máx." type="number" value={maxPurchases} onChange={e => setMaxPurchases(e.target.value)} />
        </FormControl>
      </Drawer>
      <Container maxWidth="xl" sx={{marginTop: '24px'}}>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button disabled={isLoadingSuppliers} onClick={() => setMenuOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
            Filtrar
          </button>
          <div className="flex flex-col md:flex-row gap-4">
            <span className="text-lg font-semibold text-blue-700">Fornecedores: {filteredSuppliers.length}</span>
            <span className="text-lg font-semibold text-green-600">Volume de compras: {filteredSuppliers.reduce((acc, s) => acc + (s.purchases || []).reduce((a, p) => a + (p.totalAfterDiscount || 0), 0), 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => {
              const totalPurchases = (supplier.purchases || []).length;
              const totalValue = (supplier.purchases || []).reduce((acc, p) => acc + (p.totalAfterDiscount || 0), 0);
              return (
                <div key={supplier._id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full border border-blue-100 relative">
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <IconButton
                      title="PDF"
                      aria-label="PDF"
                      onClick={() => onPdf && onPdf(supplier)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                    >
                      <PictureAsPdf fontSize="medium" />
                    </IconButton>
                    <IconButton
                      title="Editar"
                      aria-label="Editar"
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
                      onClick={() => onEdit && onEdit(supplier)}
                    >
                      <Edit fontSize="medium" />
                    </IconButton>
                    <IconButton
                      title="Detalhes"
                      aria-label="Detalhes"
                      onClick={() => onDetails && onDetails(supplier)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                    >
                      <Info fontSize="medium" />
                    </IconButton>
                    <IconButton
                      title="Deletar"
                      aria-label="Deletar"
                      onClick={() => onDelete && onDelete(supplier)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
                    >
                      <Delete fontSize="medium" />
                    </IconButton>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-800 truncate">{supplier.supplierName}</h2>
                        <div className="text-green-700 font-semibold text-base">{totalValue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</div>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{totalPurchases} compras</span>
                    </div>
                    <div className="text-gray-500 text-sm mb-1">Nuit: <span className="font-semibold text-gray-700">{supplier.nuit}</span></div>
                    <div className="text-gray-500 text-sm mb-1">Categoria: <span className="font-semibold text-yellow-700">{supplier.category}</span></div>
                    <div className="text-gray-500 text-sm mb-1">Avenida: <span className="font-semibold text-pink-700">{supplier.avenue}</span></div>
                    <div className="text-gray-500 text-sm mb-1">Bairro: <span className="font-semibold text-fuchsia-700">{supplier.bairro}</span></div>
                    <div className="text-gray-500 text-sm mb-1">Rua: <span className="font-semibold text-blue-700">{supplier.street}</span></div>
                    <div className="text-gray-500 text-sm mb-1">Telefone: <span className="font-semibold text-blue-700">{supplier.phone}</span></div>
                    <div className="text-gray-500 text-sm mb-1">Email: <span className="font-semibold text-green-700">{supplier.email}</span></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-center py-12 col-span-full">Nenhum fornecedor encontrado.</div>
          )}
        </div>
        {isLoadingSuppliers && (
          <p className="mt-16 text-center">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-6" />
          </p>
        )}
        {/* Modal Detalhes */}
        <div>
          {modalOpen && modalSupplier && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Detalhes do Fornecedor</h2>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Nome:</span> {modalSupplier.supplierName}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Categoria:</span> {modalSupplier.category || '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Nuit:</span> <span className="text-blue-700 font-bold">{modalSupplier.nuit}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Telefone:</span> <span className="text-blue-700 font-bold">{modalSupplier.phone}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Email:</span> <span className="text-green-700 font-bold">{modalSupplier.email}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Avenida:</span> <span className="text-pink-700 font-bold">{modalSupplier.avenue}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Bairro:</span> <span className="text-fuchsia-700 font-bold">{modalSupplier.bairro}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Rua:</span> <span className="text-blue-700 font-bold">{modalSupplier.street}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Compras:</span> <span className="text-blue-700 font-bold">{(modalSupplier.purchases || []).length}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Valor:</span> <span className="text-green-700 font-bold">{(modalSupplier.purchases || []).reduce((acc, p) => acc + (p.totalAfterDiscount || 0), 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}