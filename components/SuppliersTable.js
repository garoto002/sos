"use client";

  // Handler para detalhes/expandir
  const handleExpand = (supplier) => {
    window.location.href = `/suppliers/${supplier._id}`;
  };
import { useEffect, useState } from "react";
import BaseTable from "./BaseTable";


export default function SuppliersTable() {
    const [suppliers, setSuppliers]  = useState([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);


  useEffect(() => {
    setIsLoadingSuppliers(true);
    fetch("/api/suppliers")
    .then((res) =>res.json())
    .then((data) => {
      setSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []);
      setIsLoadingSuppliers(false);
    })
    .catch((err) => { 
      alert("Ocorreu um erro ao buscar Fornecedores ");
      setIsLoadingSuppliers(false);
      console.log(err);    });
    },[]); 
    const handleEdit = (supplier) => {
      window.location.href = `/suppliers/${supplier._id}`;
    };
    const handleDetails = (supplier) => {
      window.location.href = `/suppliers/${supplier._id}`;
    };
    const handleDelete = (supplier) => {
      if (!window.confirm('Tem certeza que deseja remover este fornecedor?')) return;
      setIsLoadingSuppliers(true);
      fetch(`/api/suppliers/${supplier._id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error();
          setSuppliers((prev) => prev.filter((s) => s._id !== supplier._id));
          setIsLoadingSuppliers(false);
        })
        .catch(() => {
          alert('Erro ao deletar fornecedor.');
          setIsLoadingSuppliers(false);
        });
    };
  const handlePdf = (supplier) => {
    window.open(`/api/suppliers/${supplier._id}/pdf`, '_blank');
  };

  return (
   <>
    <p className='mb-4'>Fornecedores Totais: {suppliers?.length}</p>
    <BaseTable
      columns={[
        { label: '', accessor: 'index', align: 'left' },
        { label: 'Nome', accessor: 'supplierName', align: 'left' },
        { label: 'Bairro', accessor: 'bairro', align: 'left' },
        { label: 'Avenida', accessor: 'avenue', align: 'left' },
        { label: 'Rua', accessor: 'street', align: 'left' },
        { label: 'nr:', accessor: 'number', align: 'right' },
        { label: 'nuit', accessor: 'nuit', align: 'right' },
        { label: 'Categoria', accessor: 'category', align: 'left' },
        { label: 'Telefone', accessor: 'phone', align: 'left' },
      ]}
      data={suppliers.map((supplier, i) => ({
        ...supplier,
        index: i + 1,
        phone: `+258${supplier.phone}`,
      }))}
      loading={isLoadingSuppliers}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDetails={handleExpand}
      onPdf={handlePdf}
      actions={{ edit: true, delete: true, details: true, pdf: true }}
    />
  </>
  )
}
