"use client";
import React, { useState } from "react";
import { 
  Box, 
  Modal, 
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from "@mui/material";
import BaseTable from "./BaseTable";

export default function CustomersTable({ customers = [], isLoading = false }) {

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);

  const handleEdit = (customer) => {
    setEditCustomer({ ...customer });
    setEditModalOpen(true);
  };

  const handleExpand = (customer) => {
    setModalCustomer(customer);
    setModalOpen(true);
  };

  const handleDetails = (customer) => {
    setModalCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = (customer) => {
    if (!window.confirm('Tem certeza que deseja remover este cliente?')) return;
    fetch(`/api/customers/${customer._id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        window.location.reload();
      })
      .catch(() => {
        alert('Erro ao deletar cliente.');
      });
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`/api/customers/${editCustomer._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCustomer),
      });

      if (response.ok) {
        setEditModalOpen(false);
        window.location.reload();
      } else {
        alert('Erro ao salvar cliente');
      }
    } catch (error) {
      alert('Erro ao salvar cliente');
      console.error(error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'text-green-600 bg-green-100';
      case 'inativo': return 'text-red-600 bg-red-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const columns = [
    {
      accessor: 'customerName',
      label: 'Nome',
      align: 'left',
    },
    {
      accessor: 'email',
      label: 'Email',
      align: 'left',
      render: (row) => row.email || 'N/A'
    },
    {
      accessor: 'phone',
      label: 'Telefone',
      align: 'left',
      render: (row) => row.phone || 'N/A'
    },
    {
      accessor: 'location',
      label: 'Localização',
      align: 'left',
      render: (row) => row.location || 'N/A'
    },
    {
      accessor: 'category',
      label: 'Categoria',
      align: 'left',
      render: (row) => row.category || 'N/A'
    },
    {
      accessor: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {getStatusText(row.status)}
        </span>
      )
    },
    {
      accessor: 'createdAt',
      label: 'Data Registro',
      align: 'left',
      render: (row) => new Date(row.createdAt).toLocaleDateString('pt-PT')
    }
  ];

  const handlePdf = (customer) => {
    window.open(`/api/customers/pdf?id=${customer._id}`, '_blank');
  };

  return (
    <>
      <BaseTable
        data={customers}
        columns={columns}
        loading={isLoading}
        onEdit={handleEdit}
        onDetails={handleDetails}
        onDelete={handleDelete}
        onPdf={handlePdf}
        actions={{
          edit: true,
          delete: true,
          details: true,
          pdf: true
        }}
      />

      {/* Modal de Edição */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" component="h2" className="text-blue-800 font-bold mb-4">
            Editar Cliente
          </Typography>
          
          {editCustomer && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={editCustomer.name || ''}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={editCustomer.cliente || ''}
                  onChange={(e) => handleEditChange('cliente', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={editCustomer.tipo || ''}
                    label="Tipo"
                    onChange={(e) => handleEditChange('tipo', e.target.value)}
                  >
                    <MenuItem value="importacao">Importação</MenuItem>
                    <MenuItem value="exportacao">Exportação</MenuItem>
                    <MenuItem value="transito">Trânsito</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editCustomer.status || 'pendente'}
                    label="Status"
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  >
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="em_andamento">Em Andamento</MenuItem>
                    <MenuItem value="concluido">Concluído</MenuItem>
                    <MenuItem value="cancelado">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  rows={3}
                  value={editCustomer.observacoes || ''}
                  onChange={(e) => handleEditChange('observacoes', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleEditSave}
                    sx={{ bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
                  >
                    Salvar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {modalCustomer && (
            <>
              <Typography variant="h6" component="h2" gutterBottom>
                Detalhes do Cliente
              </Typography>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Nome</Typography>
                    <Typography variant="body1">{modalCustomer.name || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Cliente</Typography>
                    <Typography variant="body1">{modalCustomer.cliente || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Data</Typography>
                    <Typography variant="body1">{new Date(modalCustomer.createdAt).toLocaleDateString('pt-PT')}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Typography variant="body1" className={getStatusColor(modalCustomer.status)}>
                      {getStatusText(modalCustomer.status)}
                    </Typography>
                  </div>
                </div>

                {modalCustomer.observacoes && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Observações</Typography>
                    <Typography variant="body2">{modalCustomer.observacoes}</Typography>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Tipo</Typography>
                    <Typography variant="body1">
                      {modalCustomer.tipo === 'importacao' ? 'Importação' :
                       modalCustomer.tipo === 'exportacao' ? 'Exportação' : 
                       modalCustomer.tipo === 'transito' ? 'Trânsito' : modalCustomer.tipo || '-'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Valor</Typography>
                    <Typography variant="h6" color="primary">
                      {(modalCustomer.valorTotal || modalCustomer.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT
                    </Typography>
                  </div>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
