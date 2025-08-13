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
  Grid,
  Chip
} from "@mui/material";
import { Delete, PictureAsPdf, Edit, Info, ExpandMore, Business, Email, Phone, LocationOn } from "@mui/icons-material";

export default function SuppliersCardsNew({ suppliers = [], isLoading = false, onEdit, onDelete, onExportPDF }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalSupplier, setModalSupplier] = useState(null);
  const [editSupplier, setEditSupplier] = useState(null);
  const [expanded, setExpanded] = useState([]);

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const handleEditClick = (supplier) => {
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

  const handleEditChange = (field, value) => {
    setEditSupplier(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'inativo': return 'error';
      case 'pendente': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  return (
    <Container maxWidth="xl" sx={{marginTop: '24px'}}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <span className="text-lg font-semibold text-blue-700">Fornecedores Registados: {suppliers.length}</span>
          <span className="text-lg font-semibold text-green-600">
            Ativos: {suppliers.filter(s => s.status === 'ativo').length}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Carregando fornecedores...</div>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Nenhum fornecedor encontrado</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier, index) => (
            <Card key={supplier._id || index} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardContent className="p-6">
                {/* Header do Card */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{supplier.supplierName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Business fontSize="small" className="text-gray-500" />
                      <span className="text-sm text-gray-600">{supplier.company || 'Empresa não informada'}</span>
                    </div>
                  </div>
                  <Chip 
                    label={getStatusText(supplier.status)} 
                    color={getStatusColor(supplier.status)}
                    size="small"
                  />
                </div>

                {/* Informações principais */}
                <div className="space-y-2 mb-4">
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <Email fontSize="small" className="text-gray-500" />
                      <span className="text-sm text-gray-600">{supplier.email}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <Phone fontSize="small" className="text-gray-500" />
                      <span className="text-sm text-gray-600">{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-center gap-2">
                      <LocationOn fontSize="small" className="text-gray-500" />
                      <span className="text-sm text-gray-600">{supplier.address}</span>
                    </div>
                  )}
                  {supplier.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoria:</span>
                      <span className="font-semibold text-blue-600">{supplier.category}</span>
                    </div>
                  )}
                  {supplier.country && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">País:</span>
                      <span className="font-semibold text-gray-800">{supplier.country}</span>
                    </div>
                  )}
                </div>

                {/* Observações */}
                {supplier.notes && (
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
                        {supplier.notes}
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
                        onExportPDF(supplier);
                      } else {
                        window.open(`/api/suppliers/pdf?id=${supplier._id}`, '_blank');
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
                        onEdit(supplier);
                      } else {
                        handleEditClick(supplier);
                      }
                    }}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton 
                    title="Detalhes" 
                    aria-label="Detalhes" 
                    onClick={() => { setModalSupplier(supplier); setModalOpen(true); }} 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                  >
                    <Info fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Deletar"
                    aria-label="Deletar"
                    disabled={isLoading}
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover este fornecedor?')) {
                        if (typeof supplier._id !== 'undefined') {
                          fetch(`/api/suppliers/${supplier._id}`, { method: 'DELETE' })
                            .then((res) => {
                              if (!res.ok) throw new Error();
                              window.location.reload();
                            })
                            .catch(() => alert('Erro ao deletar fornecedor.'));
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
            Editar Fornecedor
          </Typography>
          
          {editSupplier && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={editSupplier.supplierName || ''}
                  onChange={(e) => handleEditChange('supplierName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Empresa"
                  fullWidth
                  value={editSupplier.company || ''}
                  onChange={(e) => handleEditChange('company', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={editSupplier.email || ''}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefone"
                  fullWidth
                  value={editSupplier.phone || ''}
                  onChange={(e) => handleEditChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Categoria"
                  fullWidth
                  value={editSupplier.category || ''}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editSupplier.status || 'ativo'}
                    label="Status"
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  >
                    <MenuItem value="ativo">Ativo</MenuItem>
                    <MenuItem value="inativo">Inativo</MenuItem>
                    <MenuItem value="pendente">Pendente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Endereço"
                  fullWidth
                  value={editSupplier.address || ''}
                  onChange={(e) => handleEditChange('address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  rows={3}
                  value={editSupplier.notes || ''}
                  onChange={(e) => handleEditChange('notes', e.target.value)}
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
          maxWidth: 500,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" component="h2" className="text-blue-800 font-bold mb-4">
            Detalhes do Fornecedor
          </Typography>
          
          {modalSupplier && (
            <div className="space-y-3">
              <div>
                <strong>Nome:</strong> {modalSupplier.supplierName}
              </div>
              <div>
                <strong>Empresa:</strong> {modalSupplier.company || 'N/A'}
              </div>
              <div>
                <strong>Email:</strong> {modalSupplier.email || 'N/A'}
              </div>
              <div>
                <strong>Telefone:</strong> {modalSupplier.phone || 'N/A'}
              </div>
              <div>
                <strong>Categoria:</strong> {modalSupplier.category || 'N/A'}
              </div>
              <div>
                <strong>País:</strong> {modalSupplier.country || 'N/A'}
              </div>
              <div>
                <strong>Status:</strong> 
                <Chip 
                  label={getStatusText(modalSupplier.status)} 
                  color={getStatusColor(modalSupplier.status)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </div>
              <div>
                <strong>Endereço:</strong> {modalSupplier.address || 'N/A'}
              </div>
              {modalSupplier.notes && (
                <div>
                  <strong>Observações:</strong> {modalSupplier.notes}
                </div>
              )}
              <div>
                <strong>Data de Registro:</strong> {new Date(modalSupplier.createdAt).toLocaleDateString('pt-PT')}
              </div>
            </div>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" onClick={() => setModalOpen(false)}>
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
