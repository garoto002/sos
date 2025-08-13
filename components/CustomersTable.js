"use client";

    // Handler para detalhes/expandir
    const handleExpand = (custom) => {
      window.location.href = `/customers/${custom._id}`;
    };
import { useEffect, useState } from "react";
import BaseTable from "./BaseTable";


export default function CustomersTable() {
    const [customers, setCustomers]  = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);


  useEffect(() => {
    setIsLoadingCustomers(true);
    fetch("/api/customers")
    .then((res) =>res.json())
    .then((data) => {
      setCustomers(data.customers);
      setIsLoadingCustomers(false);
    })
    .catch((err) => { 
      alert("Ocorreu um erro ao buscar Clientes ");
      setIsLoadingCustomers(false);
      console.log(err);
    });
    },[]); 
    const handleEdit = (customer) => {
      window.location.href = `/customers/${customer._id}`;
    };
    const handleDetails = (customer) => {
      window.location.href = `/customers/${customer._id}`;
    };
    const handleDelete = (customer) => {
      if (!window.confirm('Tem certeza que deseja remover este cliente?')) return;
      setIsLoadingCustomers(true);
      fetch(`/api/customers/${customer._id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error();
          setCustomers((prev) => prev.filter((c) => c._id !== customer._id));
          setIsLoadingCustomers(false);
        })
        .catch(() => {
          alert('Erro ao deletar cliente.');
          setIsLoadingCustomers(false);
        });
    };
    const handlePdf = (customer) => {
      window.open(`/api/customers/${customer._id}/pdf`, '_blank');
    };

  return (
    <>
      <p className='mb-4'>Clientes Totais: {customers?.length}</p>
      <BaseTable
        columns={[
          { label: '', accessor: 'index', align: 'left' },
          { label: 'Nome', accessor: 'customName', align: 'left' },
          { label: 'Morada', accessor: 'location', align: 'left' },
          { label: 'Número de telefone', accessor: 'phone', align: 'left' },
          { label: 'Nuit', accessor: 'nuit', align: 'right' },
        ]}
        data={customers.map((customer, i) => ({
          ...customer,
          index: i + 1,
        }))}
        loading={isLoadingCustomers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetails={handleExpand}
        onPdf={handlePdf}
        actions={{ edit: true, delete: true, details: true, pdf: true }}
      />
    </>
  )
}
