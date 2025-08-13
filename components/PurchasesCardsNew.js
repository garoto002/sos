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

export default function PurchasesCards({ purchases = [], isLoading = false, onEdit, onDelete, onExportPDF }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalPurchase, setModalPurchase] = useState(null);
  const [editPurchase, setEditPurchase] = useState(null);
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

  const handleEditClick = (purchase) => {
    setEditPurchase({ ...purchase });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`/api/purchases/${editPurchase._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPurchase),
      });

      if (response.ok) {
        setEditModalOpen(false);
        window.location.reload();
      } else {
        alert('Erro ao salvar compra');
      }
    } catch (error) {
      alert('Erro ao salvar compra');
      console.error(error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditPurchase(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Container maxWidth="xl" sx={{marginTop: '24px'}}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <span className="text-lg font-semibold text-blue-700">Compras Registadas: {purchases.length}</span>
          <span className="text-lg font-semibold text-green-600">
            Valor Total: {purchases.reduce((total, purchase) => total + (purchase.totalAmount || purchase.total || 0), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Carregando compras...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma compra encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase, index) => (
            <Card key={purchase._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{purchase.supplier || 'Fornecedor'}</h3>
                    <p className="text-sm text-gray-500">
                      {purchase.referenceNumber || 'Sem referência'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumbers(purchase.totalAmount || purchase.total || 0)} MT
                    </p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-semibold text-gray-800">
                      {formatDate(purchase.createdAt || purchase.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      (purchase.status || 'pending') === 'completed' ? 'text-green-600' : 
                      (purchase.status || 'pending') === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {purchase.status === 'completed' ? 'Concluída' :
                       purchase.status === 'pending' ? 'Pendente' : 'Cancelada'}
                    </span>
                  </div>
                  {purchase.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pagamento:</span>
                      <span className="font-semibold text-gray-800">{purchase.paymentMethod}</span>
                    </div>
                  )}
                  {purchase.products && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Produtos:</span>
                      <span className="font-semibold text-blue-600">{purchase.products.length} itens</span>
                    </div>
                  )}
                </div>

                {/* Observações */}
                {purchase.notes && (
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
                        {purchase.notes}
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
                        onExportPDF(purchase);
                      } else {
                        // Como não há API individual, vamos gerar com dados filtrados
                        window.open(`/api/purchases/pdf?id=${purchase._id}`, '_blank');
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
                        onEdit(purchase);
                      } else {
                        handleEditClick(purchase);
                      }
                    }}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton 
                    title="Detalhes" 
                    aria-label="Detalhes" 
                    onClick={() => { setModalPurchase(purchase); setModalOpen(true); }} 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                  >
                    <Info fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Deletar"
                    aria-label="Deletar"
                    disabled={isLoading}
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover esta compra?')) {
                        if (typeof purchase._id !== 'undefined') {
                          fetch(`/api/purchases/${purchase._id}`, { method: 'DELETE' })
                            .then((res) => {
                              if (!res.ok) throw new Error();
                              window.location.reload();
                            })
                            .catch(() => alert('Erro ao deletar compra.'));
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
            Editar Compra
          </Typography>
          
          {editPurchase && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fornecedor"
                  fullWidth
                  value={editPurchase.supplier || ''}
                  onChange={(e) => handleEditChange('supplier', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Número de Referência"
                  fullWidth
                  value={editPurchase.referenceNumber || ''}
                  onChange={(e) => handleEditChange('referenceNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Valor Total"
                  type="number"
                  fullWidth
                  value={editPurchase.totalAmount || ''}
                  onChange={(e) => handleEditChange('totalAmount', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editPurchase.status || 'pending'}
                    label="Status"
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  >
                    <MenuItem value="pending">Pendente</MenuItem>
                    <MenuItem value="completed">Completa</MenuItem>
                    <MenuItem value="cancelled">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  rows={3}
                  value={editPurchase.notes || ''}
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
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {modalPurchase && (
            <>
              <Typography variant="h6" component="h2" gutterBottom>
                Detalhes da Compra
              </Typography>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Fornecedor</Typography>
                    <Typography variant="body1">{modalPurchase.supplier || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Referência</Typography>
                    <Typography variant="body1">{modalPurchase.referenceNumber || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Data</Typography>
                    <Typography variant="body1">{formatDate(modalPurchase.createdAt || modalPurchase.date)}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Typography variant="body1" className={`${
                      (modalPurchase.status || 'pending') === 'completed' ? 'text-green-600' : 
                      (modalPurchase.status || 'pending') === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {modalPurchase.status === 'completed' ? 'Concluída' :
                       modalPurchase.status === 'pending' ? 'Pendente' : 'Cancelada'}
                    </Typography>
                  </div>
                </div>
                
                {modalPurchase.notes && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Observações</Typography>
                    <Typography variant="body2">{modalPurchase.notes}</Typography>
                  </div>
                )}

                {modalPurchase.products && modalPurchase.products.length > 0 && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Produtos</Typography>
                    <div className="space-y-2">
                      {modalPurchase.products.map((product, index) => (
                        <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>{product.product || product.name}</span>
                          <span>{product.quantity} × {formatNumbers(product.price || 0)} MT</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Subtotal</Typography>
                    <Typography variant="body1">{formatNumbers(modalPurchase.subtotal || 0)} MT</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Total</Typography>
                    <Typography variant="h6" color="primary">
                      {formatNumbers(modalPurchase.totalAmount || modalPurchase.total || 0)} MT
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
