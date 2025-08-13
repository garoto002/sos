"use client";
import React, { useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Container, 
  IconButton, 
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
import { Delete, PictureAsPdf, Edit, Info, ExpandMore } from "@mui/icons-material";

export default function CustomersCards({ customers = [], isLoading = false, onEdit, onDelete, onExportPDF }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [expanded, setExpanded] = useState([]);

  const formatNumbers = (value) => {
    return value.toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2, 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const handleEditClick = (customer) => {
    setEditCustomer({ ...customer });
    setEditModalOpen(true);
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
        alert('Erro ao salvar Cliente');
      }
    } catch (error) {
      alert('Erro ao salvar Cliente');
      console.error(error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return 'text-green-600';
      case 'em_andamento': return 'text-blue-600';
      case 'pendente': return 'text-yellow-600';
      case 'cancelado': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'concluido': return 'Concluído';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return 'Indefinido';
    }
  };

  return (
    <Container maxWidth="xl" sx={{marginTop: '24px'}}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <span className="text-lg font-semibold text-blue-700">Clientes Registados: {customers.length}</span>
          <span className="text-lg font-semibold text-green-600">
            Valor Total: {customers.reduce((total, customer) => total + (customer.valorTotal || customer.valor || 0), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Carregando Clientes...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum Cliente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <Card key={customer._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{customer.numero || customer.customerName || 'Cliente'}</h3>
                    <p className="text-sm text-gray-500">
                      {customer.cliente || 'Cliente não informado'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumbers(customer.valorTotal || customer.valor || 0)} MT
                    </p>
                    <p className="text-sm text-gray-500">Valor</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-semibold text-gray-800">
                      {formatDate(customer.createdAt || customer.data)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${getStatusColor(customer.status)}`}>
                      {getStatusText(customer.status)}
                    </span>
                  </div>
                  {customer.tipo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-semibold text-gray-800">
                        {customer.tipo === 'importacao' ? 'Importação' :
                         customer.tipo === 'exportacao' ? 'Exportação' : 
                         customer.tipo === 'transito' ? 'Trânsito' : customer.tipo}
                      </span>
                    </div>
                  )}
                  {customer.peso && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span className="font-semibold text-blue-600">{customer.peso} kg</span>
                    </div>
                  )}
                </div>

                {/* Observações */}
                {customer.observacoes && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Observações</span>
                      <IconButton 
                        size="small" 
                        onClick={() => handleExpandClick(index)}
                        className={`transform transition-transform ${expanded[index] ? 'rotate-180' : ''}`}
                      >
                        <ExpandMore />
                      </IconButton>
                    </div>
                    {expanded[index] && (
                      <div className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                        {customer.observacoes}
                      </div>
                    )}
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-4">
                  <IconButton
                    title="PDF"
                    aria-label="PDF"
                    onClick={() => {
                      if (onExportPDF) {
                        onExportPDF(customer);
                      } else {
                        // Como não há API individual, vamos gerar com dados filtrados
                        window.open(`/api/customers/pdf?id=${customer._id}`, '_blank');
                      }
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                  >
                    <PictureAsPdf fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Editar"
                    aria-label="Editar"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
                    onClick={() => {
                      if (onEdit) {
                        onEdit(customer);
                      } else {
                        handleEditClick(customer);
                      }
                    }}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton 
                    title="Detalhes" 
                    aria-label="Detalhes" 
                    onClick={() => { setModalCustomer(customer); setModalOpen(true); }} 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                  >
                    <Info fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Deletar"
                    aria-label="Deletar"
                    disabled={isLoading}
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover este cliente?')) {
                        if (typeof customer._id !== 'undefined') {
                          fetch(`/api/customers/${customer._id}`, { method: 'DELETE' })
                            .then((res) => {
                              if (!res.ok) throw new Error();
                              window.location.reload();
                            })
                            .catch(() => alert('Erro ao deletar cliente.'));
                        }
                      }
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
                  >
                    <Delete fontSize="medium" />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Peso (kg)"
                  type="number"
                  fullWidth
                  value={editCustomer.peso || ''}
                  onChange={(e) => handleEditChange('peso', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Valor Total"
                  type="number"
                  fullWidth
                  value={editCustomer.valorTotal || ''}
                  onChange={(e) => handleEditChange('valorTotal', parseFloat(e.target.value) || 0)}
                />
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
                    <Typography variant="body1">{formatDate(modalCustomer.createdAt || modalCustomer.data)}</Typography>
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
                    <Typography variant="subtitle2" color="textSecondary">Peso</Typography>
                    <Typography variant="body1">{modalCustomer.peso ? `${modalCustomer.peso} kg` : '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Valor Total</Typography>
                    <Typography variant="h6" color="primary">
                      {formatNumbers(modalCustomer.valorTotal || modalCustomer.valor || 0)} MT
                    </Typography>
                  </div>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
