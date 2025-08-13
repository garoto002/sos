"use client";
import React from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Divider, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, LocalPrintshop as PrintIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function SaleReceiptModal({ open, handleClose, sale }) {
  const formatMetical = (value) => {
    return value?.toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'MZN'
    }) || '0,00 MT';
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="sale-receipt-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        zIndex: 1300,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Recibo de Venda
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => window.print()}
              sx={{ mr: 1 }}
            >
              <PrintIcon />
            </IconButton>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: '#fff', 
            border: '1px dashed #ccc',
            '@media print': {
              border: 'none'
            }
          }}
        >
          <Typography variant="subtitle2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Sistema de Gestão Empresarial
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              Data: {sale?.createdAt ? format(new Date(sale.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: pt }) : '-'}
            </Typography>
            <Typography variant="body2">
              Nº da Fatura: {sale?.invoiceNumber || '-'}
            </Typography>
            <Typography variant="body2">
              Cliente: {sale?.customName || sale?.customer?.name || 'Cliente não registrado'}
            </Typography>
            {sale?.description && (
              <Typography variant="body2">
                Descrição: {sale.description}
              </Typography>
            )}
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Qtd</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale?.products?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item?.product || '-'}
                    </TableCell>
                    <TableCell align="right">{item?.quantity || 0}</TableCell>
                    <TableCell align="right">{formatMetical(item?.price)}</TableCell>
                    <TableCell align="right">{formatMetical(item?.totalPrice || (item?.quantity || 0) * (item?.price || 0))}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ccc' }}>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>{formatMetical(sale?.products?.reduce((acc, item) => acc + (item?.price || 0) * (item?.quantity || 0), 0))}</span>
            </Typography>
            {sale?.products?.some(item => item?.ivaRate > 0) && (
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>IVA:</span>
                <span>{formatMetical(sale?.products?.reduce((acc, item) => 
                  acc + ((item?.price || 0) * (item?.quantity || 0) * (item?.ivaRate || 0) / 100), 0
                ))}</span>
              </Typography>
            )}
            {sale?.discount > 0 && (
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                <span>Desconto:</span>
                <span>-{formatMetical(sale?.discount)}</span>
              </Typography>
            )}
            <Typography variant="subtitle2" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>{formatMetical(sale?.products?.reduce((acc, item) => 
                acc + (item?.totalPrice || 0), 0) - (sale?.discount || 0))}</span>
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
            Obrigado pela preferência!
          </Typography>
        </Paper>
      </Box>
    </Modal>
  );
}
