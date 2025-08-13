"use client";
import React, { useState } from "react";
import { Box, Card, CardContent, Container, IconButton, Modal, Typography } from "@mui/material";
import { Delete, PictureAsPdf, Edit, Info, ExpandMore, Receipt } from "@mui/icons-material";
import SaleReceiptModal from './SaleReceiptModal';

export default function SalesCards({ sales = [], isLoading = false, onEdit, onDelete, onExportPDF }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSale, setModalSale] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleOpenReceipt = (sale) => {
    setSelectedSale(sale);
    setReceiptModalOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptModalOpen(false);
    setSelectedSale(null);
  };

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

  return (
    <Container maxWidth="xl" sx={{marginTop: '24px'}}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <span className="text-lg font-semibold text-blue-700">Vendas Registadas: {sales.length}</span>
          <span className="text-lg font-semibold text-green-600">
            Volume de vendas: {sales.reduce((total, sale) => total + (sale.totalAfterDiscount || 0), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Carregando vendas...</p>
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma venda encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale, index) => (
            <Card key={sale._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Venda #{index + 1}</h3>
                    <p className="text-sm text-gray-500">
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumbers(sale.totalAfterDiscount || 0)} MT
                    </p>
                    <p className="text-sm text-gray-500">Total Final</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-semibold text-gray-800">{sale.customName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-800">{formatNumbers(sale.subtotal || 0)} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desconto:</span>
                    <span className="font-semibold text-red-600">{formatNumbers(sale.discount || 0)} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA:</span>
                    <span className="font-semibold text-gray-800">{formatNumbers(sale.totalIva || 0)} MT</span>
                  </div>
                </div>

                {/* Produtos */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Produtos ({sale.products?.length || 0})</span>
                    <IconButton 
                      size="small" 
                      onClick={() => handleExpandClick(index)}
                      className={`transform transition-transform ${expanded[index] ? 'rotate-180' : ''}`}
                    >
                      <ExpandMore />
                    </IconButton>
                  </div>
                  {expanded[index] && (
                    <div className="space-y-1 text-sm text-gray-600 max-h-32 overflow-y-auto">
                      {sale.products?.map((product, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{product.product}</span>
                          <span>{product.quantity}x {formatNumbers(product.price || 0)} MT</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-4">
                  <IconButton
                    title="PDF"
                    aria-label="PDF"
                    onClick={() => onExportPDF ? onExportPDF(sale) : window.open(`/api/sales/${sale._id}/pdf`, '_blank')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                  >
                    <PictureAsPdf fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Recibo"
                    aria-label="Ver recibo"
                    onClick={() => handleOpenReceipt(sale)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 rounded-lg shadow transition"
                  >
                    <Receipt fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Editar"
                    aria-label="Editar"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
                    onClick={() => onEdit ? onEdit(sale) : window.location.href = `/sales/${sale._id}`}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton 
                    title="Detalhes" 
                    aria-label="Detalhes" 
                    onClick={() => { setModalSale(sale); setModalOpen(true); }} 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                  >
                    <Info fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Deletar"
                    aria-label="Deletar"
                    disabled={isLoading}
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover esta venda?')) {
                        if (typeof sale._id !== 'undefined') {
                          fetch(`/api/sales/${sale._id}`, { method: 'DELETE' })
                            .then((res) => {
                              if (!res.ok) throw new Error();
                              window.location.reload();
                            })
                            .catch(() => alert('Erro ao deletar venda.'));
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

      {/* Modal de Detalhes */}
      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
      >
        <Box 
          sx={{
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
          }}
        >
          {modalSale && (
            <>
              <Typography variant="h6" component="h2" gutterBottom>
                Detalhes da Venda
              </Typography>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Cliente</Typography>
                    <Typography variant="body1">{modalSale.customName || '-'}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Data</Typography>
                    <Typography variant="body1">
                      {modalSale.createdAt ? new Date(modalSale.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </Typography>
                  </div>
                </div>
                
                <div>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>Produtos</Typography>
                  <ul className="space-y-1">
                    {modalSale.products?.map((p, idx) => (
                      <li key={idx} className="text-sm">
                        {p.product} - {p.quantity} x {formatNumbers(p.price || 0)} MT (IVA: {((p.ivaRate || 0)*100).toFixed(0)}%)
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Subtotal</Typography>
                    <Typography variant="body1">{formatNumbers(modalSale.subtotal || 0)} MT</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Desconto</Typography>
                    <Typography variant="body1">{formatNumbers(modalSale.discount || 0)} MT</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">IVA</Typography>
                    <Typography variant="body1">{formatNumbers(modalSale.totalIva || 0)} MT</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Total Final</Typography>
                    <Typography variant="h6" color="primary">{formatNumbers(modalSale.totalAfterDiscount || 0)} MT</Typography>
                  </div>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal do Recibo */}
      <SaleReceiptModal 
        open={receiptModalOpen}
        handleClose={handleCloseReceipt}
        sale={selectedSale}
      />
    </Container>
  );
}