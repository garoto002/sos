// Função editar
const handleEdit = (row) => {
  window.location.href = `/sales/${row.saleId}`;
};

// Função deletar
const handleDelete = (row) => {
  if (window.confirm('Tem certeza que deseja remover esta venda?')) {
    if (typeof row.saleId !== 'undefined') {
      fetch(`/api/sales/${row.saleId}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error();
          window.location.reload();
        })
        .catch(() => alert('Erro ao deletar venda.'));
    }
  }
};
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BaseTable from './BaseTable';

const SalesTable = ({ sales = [], isLoading = false, onEdit, onDetails, onDelete }) => {
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Filtros e estados locais podem ser mantidos na página principal, aqui só tabela
  // Flatten sales for table display (each product is a row)
  const tableData = sales.flatMap((sale, i) =>
    sale.products.map((product, idx) => ({
      ordem: idx === 0 ? i + 1 : '',
      customName: idx === 0 ? (sale.customName || '-') : '',
      product: product.product,
      price: product.price,
      quantity: product.quantity,
      ivaRate: product.ivaRate,
      totalPrice: product.totalPrice,
      subtotal: idx === 0 ? sale.subtotal : '',
      discount: idx === 0 ? sale.discount : '',
      totalAfterDiscount: idx === 0 ? sale.totalAfterDiscount : '',
      createdAt: idx === 0 ? sale.createdAt : '',
      saleId: sale._id,
      sale,
      isFirst: idx === 0,
      rowSpan: sale.products.length,
    }))
  );

  const columns = [
    { label: '#', render: (row) => row.ordem, rowSpan: (row) => row.isFirst ? row.rowSpan : 1, align: 'center' },
    { label: 'Cliente', render: (row) => row.customName, rowSpan: (row) => row.isFirst ? row.rowSpan : 1, align: 'center' },
    { label: 'Produto', render: (row) => row.product },
    { label: 'Preço', render: (row) => Number(row.price).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) },
    { label: 'Qtd', render: (row) => Number(row.quantity).toLocaleString('pt-MZ', { minimumFractionDigits: 2 }) },
    { label: 'IVA', render: (row) => (Number(row.ivaRate) * 100).toFixed(0) + '%' },
    { label: 'Total', render: (row) => Number(row.totalPrice).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) },
    { label: 'Subt.', render: (row) => row.isFirst && row.subtotal != null ? Number(row.subtotal).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) : '', rowSpan: (row) => row.isFirst ? row.rowSpan : 1, align: 'right', className: 'hidden md:table-cell' },
    { label: 'Desc.', render: (row) => row.isFirst && row.discount != null ? Number(row.discount).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) : '', rowSpan: (row) => row.isFirst ? row.rowSpan : 1, align: 'right', className: 'hidden md:table-cell' },
    { label: 'Final', render: (row) => row.isFirst && row.totalAfterDiscount != null ? Number(row.totalAfterDiscount).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) : '', rowSpan: (row) => row.isFirst ? row.rowSpan : 1, align: 'right', className: 'hidden md:table-cell' },
    { label: 'Data', render: (row) => row.isFirst && row.createdAt ? new Date(row.createdAt).toLocaleDateString('pt-PT') : '', rowSpan: (row) => row.isFirst ? row.rowSpan : 1, align: 'center', className: 'hidden sm:table-cell' },
    // ...ações removidas, BaseTable cuida dos ícones e handlers...
  ];


  const handlePdf = (sale) => {
    window.open(`/api/sales/${sale.saleId}/pdf`, '_blank');
  };

  // Handler para detalhes/expandir
  const handleExpand = (row) => {
    // Se tiver sale no objeto row, é uma venda
    if (row.sale) {
      setSelectedSale(row.sale);
      setDetailsOpen(true);
    } else if (row.saleId) {
      setSelectedSale(row);
      setDetailsOpen(true);
    }
  };

  return (
    <>
      <div className="w-full mx-auto mt-8 bg-white rounded-xl shadow-xl p-3 border border-blue-100" style={{overflowX:'auto'}}>
        <BaseTable
          columns={columns}
          data={tableData}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDetails={handleExpand}
          onPdf={handlePdf}
          actions={{ edit: true, delete: true, details: true, pdf: true }}
          detailsIcon={<ExpandMoreIcon fontSize="small" />}
          emptyMessage="Nenhuma venda encontrada."
        />
      </div>
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes da Venda</DialogTitle>
        <DialogContent>
          {selectedSale ? (
            <>
              <Typography variant="subtitle1"><b>Cliente:</b> {selectedSale.customName}</Typography>
              <Typography variant="subtitle1"><b>Data:</b> {selectedSale.createdAt ? new Date(selectedSale.createdAt).toLocaleString('pt-PT') : '-'}</Typography>
              <Typography variant="subtitle1"><b>Produtos:</b></Typography>
              <ul>
                {selectedSale.products.map((p, idx) => (
                  <li key={idx}>{p.product} - {p.quantity} x {Number(p.price).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })} (IVA: {(Number(p.ivaRate)*100).toFixed(0)}%)</li>
                ))}
              </ul>
              <Typography variant="subtitle1"><b>Subtotal:</b> {Number(selectedSale.subtotal).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</Typography>
              <Typography variant="subtitle1"><b>Desconto:</b> {Number(selectedSale.discount).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</Typography>
              <Typography variant="subtitle1"><b>Total Final:</b> {Number(selectedSale.totalAfterDiscount).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</Typography>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)} color="primary">Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesTable;