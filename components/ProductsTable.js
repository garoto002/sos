"use client";
import React, { useState } from "react";
import { 
  Box, 
  Modal, 
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import BaseTable from "./BaseTable";

export default function ProductsTable({ products = [], isLoading = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const handleEdit = (product) => {
    window.location.href = `/products/${product._id}`;
  };
  // Handler para detalhes/expandir
  const handleExpand = (product) => {
    setModalProduct(product);
    setModalOpen(true);
  };
  
  const handleDetails = (product) => {
    setModalProduct(product);
    setModalOpen(true);
  };
  const handleDelete = (product) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return;
    fetch(`/api/products/${product._id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        window.location.reload(); // Recarrega a página para atualizar os dados
      })
      .catch(() => {
        alert('Erro ao deletar produto.');
      });
  };

  const columns = [
    { label: '', accessor: 'index', align: 'left' },
    { label: 'Nome', accessor: 'name', align: 'left' },
    { label: 'Categoria', accessor: 'category', align: 'left' },
    { label: 'Qtd', accessor: 'quantity', align: 'right' },
    { label: 'Qtd(stock)', accessor: 'quantityInStock', align: 'right' },
    { label: 'Stock mínimo', accessor: 'stockMinimum', align: 'right' },
    { label: 'Custo(MT)', accessor: 'cost', align: 'right' },
    { label: 'Custo Total', accessor: 'totalCost', align: 'right' },
    { label: 'Preço', accessor: 'price', align: 'right' },
    { label: 'Preço Total', accessor: 'totalPrice', align: 'right' },
  ];

  const tableData = products.map((product, i) => ({
    ...product,
    index: i + 1,
    quantity: product.quantity || product.stock || 0,
    quantityInStock: product.quantityInStock || product.stock || 0,
    stockMinimum: product.stockMinimum || product.minStock || 0,
    cost: product.cost?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || 
          (product.price * 0.7)?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || '-',
    totalCost: product.totalCost?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || 
               ((product.cost || product.price * 0.7) * (product.stock || 0))?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || '-',
    price: product.price?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || '-',
    totalPrice: product.totalPrice?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || 
                ((product.price || 0) * (product.stock || 0))?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || '-',
  }));

  const handlePdf = (product) => {
    window.open(`/api/products/${product._id}/pdf`, '_blank');
  };

  const formatCurrency = (value) => {
    return value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) || '-';
  };

  return (
    <>
      <p className='mb-4'>Produtos Totais: {products?.length}</p>
      <BaseTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetails={handleExpand}
        onPdf={handlePdf}
        actions={{ edit: true, delete: true, details: true, pdf: true }}
      />

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
                    <Typography variant="subtitle2" color="textSecondary">Categoria</Typography>
                    <Typography variant="body1">{modalProduct.category || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Quantidade em Estoque</Typography>
                    <Typography variant="body1">{modalProduct.quantityInStock || modalProduct.stock || 0}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Stock Mínimo</Typography>
                    <Typography variant="body1">{modalProduct.stockMinimum || modalProduct.minStock || 0}</Typography>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Custo</Typography>
                    <Typography variant="body1">{formatCurrency(modalProduct.cost || (modalProduct.price * 0.7))}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Custo Total</Typography>
                    <Typography variant="body1">
                      {formatCurrency(modalProduct.totalCost || ((modalProduct.cost || modalProduct.price * 0.7) * (modalProduct.stock || 0)))}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Preço</Typography>
                    <Typography variant="body1">{formatCurrency(modalProduct.price)}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Preço Total</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(modalProduct.totalPrice || (modalProduct.price * (modalProduct.stock || 0)))}
                    </Typography>
                  </div>
                </div>

                {modalProduct.description && (
                  <div className="pt-4 border-t">
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>Descrição</Typography>
                    <Typography variant="body2">{modalProduct.description}</Typography>
                  </div>
                )}
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
