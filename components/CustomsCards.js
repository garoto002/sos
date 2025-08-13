"use client";
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Badge from '@mui/material/Badge';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Edit, Delete, PictureAsPdf, Info } from '@mui/icons-material';
import BaseTable from './BaseTable';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Drawer, FormControl, TextField } from "@mui/material";


const CustomersCards = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  // Filtering
  const filteredCustomers = customers.filter(c => {
    return (
      (!search || (c.customName && c.customName.toLowerCase().includes(search.toLowerCase()))) &&
      (!minValue || c.value >= parseFloat(minValue)) &&
      (!maxValue || c.value <= parseFloat(maxValue))
    );
  });

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este registro?')) return;
    setIsLoadingCustomers(true);
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c._id !== id));
      }
    } catch (e) {}
    setIsLoadingCustomers(false);
  };

  // Fetch data
  useEffect(() => {
    setIsLoadingCustomers(true);
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers || []);
        setIsLoadingCustomers(false);
      })
      .catch(() => setIsLoadingCustomers(false));
  }, []);

  // KPIs
  const total = filteredCustomers.length;
  const totalValue = filteredCustomers.reduce((acc, c) => acc + (c.value || 0), 0);

  // Modal open
  const handleOpenModal = (customer) => {
    setModalCustomer(customer);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalCustomer(null);
  };

  // Table columns for BaseTable
  const columns = [
    { label: 'Nome', render: (row) => row.customerName || row.description || '-' },
    { label: 'Tipo', render: (row) => row.type || 'N/A' },
    { label: 'Valor', render: (row) => Number(row.value || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) },
    { label: 'Usuário', render: (row) => row.user ? `${row.user.firstName} ${row.user.lastName}` : '-' },
    { label: 'Data', render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-' },
    {
      label: 'Ações',
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <IconButton
            title="PDF"
            aria-label="PDF"
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg shadow transition"
            onClick={() => window.open(`/api/customers/${row._id}/pdf`, '_blank')}
          >
            <i className="fas fa-file-pdf" />
          </IconButton>
          <IconButton
            title="Expandir"
            aria-label="Expandir"
            onClick={() => handleOpenModal(row)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
          >
            <ExpandMoreIcon fontSize="medium" />
          </IconButton>
          <IconButton
            title="Editar"
            aria-label="Editar"
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
            onClick={() => window.location.href = `/customers/${row._id}`}
          >
            <Edit fontSize="medium" />
          </IconButton>
          <IconButton
            title="Deletar"
            aria-label="Deletar"
            disabled={isLoadingCustomers}
            onClick={() => handleDelete(row._id)}
            className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
          >
            <Delete fontSize="medium" />
          </IconButton>
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Typography variant="h5" sx={{fontSize: '16px', textTransform: "uppercase", padding: '8px 16px'}}>
          Filtrar Registros
        </Typography>
        <FormControl sx={{margin: '8px 16px'}}>
          <TextField label="Nome/Descrição" value={search} onChange={e => setSearch(e.target.value)} />
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
          <button disabled={isLoadingCustomers} onClick={() => setMenuOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
            Filtrar
          </button>
          <div className="flex flex-col md:flex-row gap-4">
            <span className="text-lg font-semibold text-blue-700">Registros: {total}</span>
            <span className="text-lg font-semibold text-green-600">Valor total: {totalValue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
          </div>
        </div>
        {/* Cards grid view (mantido para visualização tipo cards) */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer._id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full border border-blue-100">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-800 truncate">{customer.customerName || customer.description || 'Sem descrição'}</h2>
                      <div className="text-green-700 font-semibold text-base">{Number(customer.value || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{customer.type || 'N/A'}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">Data: <span className="font-semibold text-gray-700">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}</span></div>
                  <div className="text-gray-500 text-sm mb-1">Usuário: <span className="font-semibold text-green-700">{customer.user?.firstName} {customer.user?.lastName}</span></div>
                </div>
                <div className="flex gap-2 mt-4">
                                    <IconButton
                                        title="PDF"
                                        aria-label="PDF"
                                        onClick={() => onPdf && onPdf(custom)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                                    >
                                        <PictureAsPdf fontSize="medium" />
                                    </IconButton>
                                    <IconButton
                                        title="Editar"
                                        aria-label="Editar"
                                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
                                        onClick={() => onEdit && onEdit(custom)}
                                    >
                                        <Edit fontSize="medium" />
                                    </IconButton>
                                    <IconButton
                                        title="Detalhes"
                                        aria-label="Detalhes"
                                        onClick={() => onDetails && onDetails(custom)}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                                    >
                                        <Info fontSize="medium" />
                                    </IconButton>
                                    <IconButton
                                        title="Deletar"
                                        aria-label="Deletar"
                                        onClick={() => onDelete && onDelete(custom)}
                                        className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
                                    >
                                        <Delete fontSize="medium" />
                                    </IconButton>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-12 col-span-full">Nenhum registro encontrado.</div>
          )}
        </div>
        {/* Tabela BaseTable para visualização tabular uniforme */}
        <BaseTable
          columns={columns}
          data={filteredCustomers}
          loading={isLoadingCustomers}
          emptyMessage="Nenhum registro encontrado."
        />
        {isLoadingCustomers && (
          <p className="mt-16 text-center">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-6" />
          </p>
        )}
        {/* Modal Detalhes */}
        <div>
          {modalOpen && modalCustom && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Detalhes do Registro</h2>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Nome:</span> {modalCustom.customName || modalCustom.description || '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Tipo:</span> {modalCustom.type || 'N/A'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Valor:</span> <span className="text-green-700 font-bold">{Number(modalCustom.value || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Usuário:</span> <span className="text-green-700 font-bold">{modalCustom.user?.firstName} {modalCustom.user?.lastName}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Descrição:</span> <span className="text-indigo-700 font-bold">{modalCustom.description || '-'}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Registado em:</span> <span className="text-blue-700 font-bold">{modalCustom.createdAt ? new Date(modalCustom.createdAt).toLocaleDateString() : '-'}</span></div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default CustomersCards;