"use client";
import BaseTable from "./BaseTable";

export default function CustomersTable({ customers = [], isLoading = false }) {

  const handleEdit = (customer) => {
    alert('Função de edição não implementada ainda');
  };

  const handleExpand = (custom) => {
    alert('Função de expansão não implementada ainda');
  };

  const handleDetails = (custom) => {
    alert('Função de detalhes não implementada ainda');
  };

  const handleDelete = (customer) => {
    if (!window.confirm('Tem certeza que deseja remover este cliente?')) return;
    fetch(`/api/customers/${customer._id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        window.location.reload(); // Recarrega a página para atualizar os dados
      })
      .catch(() => {
        alert('Erro ao deletar desembaraço.');
      });
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

  const getTypeText = (type) => {
    switch (type) {
      case 'importacao': return 'Importação';
      case 'exportacao': return 'Exportação';
      case 'transito': return 'Trânsito';
      default: return type || 'N/A';
    }
  };

  const columns = [
    { label: '', accessor: 'index', align: 'left' },
    { label: 'Número', accessor: 'numero', align: 'left' },
    { label: 'Cliente', accessor: 'cliente', align: 'left' },
    { label: 'Tipo', accessor: 'tipo', align: 'left' },
    { label: 'Data', accessor: 'data', align: 'left' },
    { label: 'Status', accessor: 'status', align: 'center' },
    { label: 'Peso (kg)', accessor: 'peso', align: 'right' },
    { label: 'Valor (MT)', accessor: 'valor', align: 'right' },
  ];

  const tableData = customers.map((custom, i) => ({
    ...custom,
    index: i + 1,
    numero: custom.numero || custom.customName || 'N/A',
    cliente: custom.cliente || 'N/A',
    tipo: getTypeText(custom.tipo),
    data: new Date(custom.createdAt || custom.data).toLocaleDateString('pt-PT'),
    status: getStatusText(custom.status),
    peso: custom.peso ? `${custom.peso}` : '-',
    valor: (custom.valorTotal || custom.valor || 0)?.toLocaleString('pt-MZ', { 
      style: 'currency', 
      currency: 'MZN' 
    }) || '0,00 MT',
  }));

  const handlePdf = (customer) => {
    window.open(`/api/customers/${customer._id}/pdf`, '_blank');
  };

  return (
    <>
      <p className='mb-4'>Clientes Totais: {customers?.length}</p>
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
