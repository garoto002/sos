"use client";
import BaseTable from "./BaseTable";

export default function PurchasesTable({ purchases = [], isLoading = false }) {

  const handleEdit = (purchase) => {
    alert('Função de edição não implementada ainda');
  };

  const handleExpand = (purchase) => {
    alert('Função de expansão não implementada ainda');
  };

  const handleDetails = (purchase) => {
    alert('Função de detalhes não implementada ainda');
  };

  const handleDelete = (purchase) => {
    if (!window.confirm('Tem certeza que deseja remover esta compra?')) return;
    fetch(`/api/purchases/${purchase._id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        window.location.reload(); // Recarrega a página para atualizar os dados
      })
      .catch(() => {
        alert('Erro ao deletar compra.');
      });
  };

  const columns = [
    { label: '', accessor: 'index', align: 'left' },
    { label: 'Fornecedor', accessor: 'supplier', align: 'left' },
    { label: 'Referência', accessor: 'referenceNumber', align: 'left' },
    { label: 'Data', accessor: 'date', align: 'left' },
    { label: 'Status', accessor: 'status', align: 'center' },
    { label: 'Produtos', accessor: 'productsCount', align: 'right' },
    { label: 'Total (MT)', accessor: 'total', align: 'right' },
  ];

  const tableData = purchases.map((purchase, i) => ({
    ...purchase,
    index: i + 1,
    supplier: purchase.supplier || 'N/A',
    referenceNumber: purchase.referenceNumber || 'N/A',
    date: new Date(purchase.createdAt || purchase.date).toLocaleDateString('pt-PT'),
    status: purchase.status === 'completed' ? 'Concluída' :
            purchase.status === 'pending' ? 'Pendente' : 'Cancelada',
    productsCount: purchase.products ? purchase.products.length : 0,
    total: (purchase.totalAmount || purchase.total || 0)?.toLocaleString('pt-MZ', { 
      style: 'currency', 
      currency: 'MZN' 
    }) || '0,00 MT',
  }));

  const handlePdf = (purchase) => {
    window.open(`/api/purchases/${purchase._id}/pdf`, '_blank');
  };

  return (
    <>
      <p className='mb-4'>Compras Totais: {purchases?.length}</p>
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
    </>
  );
}
