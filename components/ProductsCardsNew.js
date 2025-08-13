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

export default function ProductsCards({ products = [], isLoading = false, onEdit, onDelete, onExportPDF }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [expanded, setExpanded] = useState([]);

  const formatNumbers = (value) => {
    return value.toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2, 
    });
  };

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const handleEditClick = (product) => {
    setEditProduct({ ...product });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`/api/products/${editProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        setEditModalOpen(false);
        window.location.reload(); // Recarrega para mostrar as mudanças
      } else {
        alert('Erro ao salvar produto');
      }
    } catch (error) {
      alert('Erro ao salvar produto');
      console.error(error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Container maxWidth="xl" sx={{marginTop: '24px'}}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <span className="text-lg font-semibold text-blue-700">Produtos Registados: {products.length}</span>
          <span className="text-lg font-semibold text-green-600">
            Valor Total: {products.reduce((total, product) => total + ((product.price || 0) * (product.stock || 0)), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Carregando produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card key={product._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name || 'Produto'}</h3>
                    <p className="text-sm text-gray-500">
                      {product.category || 'Sem categoria'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumbers(product.price || 0)} MT
                    </p>
                    <p className="text-sm text-gray-500">Preço</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código:</span>
                    <span className="font-semibold text-gray-800">{product.code || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estoque:</span>
                    <span className={`font-semibold ${(product.stock || 0) <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock || 0} unidades
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fornecedor:</span>
                    <span className="font-semibold text-gray-800">{product.supplier || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="font-semibold text-blue-600">
                      {formatNumbers((product.price || 0) * (product.stock || 0))} MT
                    </span>
                  </div>
                </div>

                {/* Descrição */}
                {product.description && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Descrição</span>
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
                        {product.description}
                      </div>
                    )}
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-4">
                  <IconButton
                    title="PDF"
                    aria-label="PDF"
                    onClick={() => onExportPDF ? onExportPDF(product) : window.open(`/api/products/${product._id}/pdf`, '_blank')}
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
                        onEdit(product);
                      } else {
                        handleEditClick(product);
                      }
                    }}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton 
                    title="Detalhes" 
                    aria-label="Detalhes" 
                    onClick={() => { setModalProduct(product); setModalOpen(true); }} 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                  >
                    <Info fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Deletar"
                    aria-label="Deletar"
                    disabled={isLoading}
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover este produto?')) {
                        if (typeof product._id !== 'undefined') {
                          fetch(`/api/products/${product._id}`, { method: 'DELETE' })
                            .then((res) => {
                              if (!res.ok) throw new Error();
                              window.location.reload();
                            })
                            .catch(() => alert('Erro ao deletar produto.'));
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
            Editar Produto
          </Typography>
          
          {editProduct && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={editProduct.name || ''}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SKU"
                  fullWidth
                  value={editProduct.sku || ''}
                  onChange={(e) => handleEditChange('sku', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Preço"
                  type="number"
                  fullWidth
                  value={editProduct.price || ''}
                  onChange={(e) => handleEditChange('price', parseFloat(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Estoque"
                  type="number"
                  fullWidth
                  value={editProduct.stock || ''}
                  onChange={(e) => handleEditChange('stock', parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={editProduct.category || ''}
                    label="Categoria"
                    onChange={(e) => handleEditChange('category', e.target.value)}
                  >
                    <MenuItem value="eletronicos">Eletrônicos</MenuItem>
                    <MenuItem value="vestuario">Vestuário</MenuItem>
                    <MenuItem value="esporte">Esporte</MenuItem>
                    <MenuItem value="alimentos">Alimentos</MenuItem>
                    <MenuItem value="outros">Outros</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editProduct.status || 'ativo'}
                    label="Status"
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  >
                    <MenuItem value="ativo">Ativo</MenuItem>
                    <MenuItem value="inativo">Inativo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  fullWidth
                  multiline
                  rows={3}
                  value={editProduct.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
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
          {modalProduct && (
            <>
              <Typography variant="h6" component="h2" gutterBottom>
                Detalhes do Produto
              </Typography>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Nome</Typography>
                    <Typography variant="body1">{modalProduct.name || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Código</Typography>
                    <Typography variant="body1">{modalProduct.code || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Categoria</Typography>
                    <Typography variant="body1">{modalProduct.category || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Fornecedor</Typography>
                    <Typography variant="body1">{modalProduct.supplier || '-'}</Typography>
                  </div>
                </div>
                
                {modalProduct.description && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Descrição</Typography>
                    <Typography variant="body2">{modalProduct.description}</Typography>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Preço Unitário</Typography>
                    <Typography variant="body1">{formatNumbers(modalProduct.price || 0)} MT</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Estoque</Typography>
                    <Typography variant="body1" className={`${(modalProduct.stock || 0) <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {modalProduct.stock || 0} unidades
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Valor Total</Typography>
                    <Typography variant="h6" color="primary">
                      {formatNumbers((modalProduct.price || 0) * (modalProduct.stock || 0))} MT
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Typography variant="body1" className={`${(modalProduct.stock || 0) <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {(modalProduct.stock || 0) <= 5 ? 'Estoque Baixo' : 'Em Estoque'}
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
