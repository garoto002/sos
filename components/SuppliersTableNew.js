"use client";
import React, { useState } from 'react';
import BaseTable from "./BaseTable";
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

export default function SuppliersTableNew({ suppliers = [], isLoading = false }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [detailsSupplier, setDetailsSupplier] = useState(null);

  const handleEdit = (supplier) => {
    setEditSupplier({ ...supplier });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`/api/suppliers/${editSupplier._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editSupplier),
      });

      if (response.ok) {
        setEditModalOpen(false);
        window.location.reload();
      } else {
        alert('Erro ao salvar fornecedor');
      }
    } catch (error) {
      alert('Erro ao salvar fornecedor');
      console.error(error);
    }
  };

  const handleDetails = (supplier) => {
    setDetailsSupplier(supplier);
    setDetailsModalOpen(true);
  };

  const handlePdf = (supplier) => {
    window.open(`/api/suppliers/pdf?id=${supplier._id}`, '_blank');
  };

  const handleDelete = (supplier) => {
    if (!window.confirm('Tem certeza que deseja remover este fornecedor?')) return;
    fetch(`/api/suppliers/${supplier._id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        window.location.reload();
      })
      .catch(() => {
        alert('Erro ao deletar fornecedor.');
      });
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
      accessor: 'supplierName',
      label: 'Nome',
      align: 'left',
    },
    {
      accessor: 'company',
      label: 'Empresa',
      align: 'left',
      render: (row) => row.company || 'N/A'
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
      accessor: 'country',
      label: 'País',
      align: 'left',
      render: (row) => row.country || 'N/A'
    },
    {
      accessor: 'createdAt',
      label: 'Data Registro',
      align: 'left',
      render: (row) => new Date(row.createdAt).toLocaleDateString('pt-PT')
    }
  ];

  return (
    <>
      <BaseTable
        data={suppliers}
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
          <Typography variant="h6" component="h2" className="mb-4 text-blue-700 font-bold">
            Editar Fornecedor
          </Typography>
          
          {editSupplier && (
            <div className="space-y-4">
              <TextField
                fullWidth
                label="Nome do Fornecedor"
                value={editSupplier.supplierName || ''}
                onChange={(e) => setEditSupplier({...editSupplier, supplierName: e.target.value})}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Empresa"
                value={editSupplier.company || ''}
                onChange={(e) => setEditSupplier({...editSupplier, company: e.target.value})}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editSupplier.email || ''}
                onChange={(e) => setEditSupplier({...editSupplier, email: e.target.value})}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Telefone"
                value={editSupplier.phone || ''}
                onChange={(e) => setEditSupplier({...editSupplier, phone: e.target.value})}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Endereço"
                value={editSupplier.address || ''}
                onChange={(e) => setEditSupplier({...editSupplier, address: e.target.value})}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Categoria"
                value={editSupplier.category || ''}
                onChange={(e) => setEditSupplier({...editSupplier, category: e.target.value})}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="País"
                value={editSupplier.country || ''}
                onChange={(e) => setEditSupplier({...editSupplier, country: e.target.value})}
                variant="outlined"
              />
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editSupplier.status || 'ativo'}
                  label="Status"
                  onChange={(e) => setEditSupplier({...editSupplier, status: e.target.value})}
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={editSupplier.notes || ''}
                onChange={(e) => setEditSupplier({...editSupplier, notes: e.target.value})}
                variant="outlined"
              />
              
              <div className="flex gap-2 justify-end mt-6">
                <Button 
                  variant="outlined" 
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-600 border-gray-300"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleEditSave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 500,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" component="h2" className="mb-4 text-blue-700 font-bold">
            Detalhes do Fornecedor
          </Typography>
          
          {detailsSupplier && (
            <div className="space-y-3">
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Nome:</span>
                <div className="text-gray-800 mt-1">{detailsSupplier.supplierName}</div>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Empresa:</span>
                <div className="text-gray-800 mt-1">{detailsSupplier.company || 'N/A'}</div>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Email:</span>
                <div className="text-gray-800 mt-1">{detailsSupplier.email || 'N/A'}</div>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Telefone:</span>
                <div className="text-gray-800 mt-1">{detailsSupplier.phone || 'N/A'}</div>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Endereço:</span>
                <div className="text-gray-800 mt-1">{detailsSupplier.address || 'N/A'}</div>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Categoria:</span>
                <div className="text-gray-800 mt-1">{detailsSupplier.category || 'N/A'}</div>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">País:</span>
                <div className="text-gray-800 mt-1">{detailsSupplier.country || 'N/A'}</div>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Status:</span>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detailsSupplier.status)}`}>
                    {getStatusText(detailsSupplier.status)}
                  </span>
                </div>
              </div>
              
              {detailsSupplier.notes && (
                <div className="border-b pb-2">
                  <span className="text-gray-600 font-medium">Observações:</span>
                  <div className="text-gray-800 mt-1">{detailsSupplier.notes}</div>
                </div>
              )}
              
              <div className="border-b pb-2">
                <span className="text-gray-600 font-medium">Data de Registro:</span>
                <div className="text-gray-800 mt-1">
                  {new Date(detailsSupplier.createdAt).toLocaleDateString('pt-PT')}
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  variant="contained" 
                  onClick={() => setDetailsModalOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
}
