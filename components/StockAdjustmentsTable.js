  const handlePdf = (adjustment) => {
    window.open(`/api/stock-adjustments/${adjustment._id}/pdf`, '_blank');
  };
"use client"
import { useEffect, useState } from "react";
import BaseTable from "./BaseTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function StockAdjustmentsTable() {
  const [adjustments, setAdjustments] = useState([]);
  const [isLoadingAdjustments, setIsLoadingAdjustments] = useState(false);

  useEffect(() => {
    setIsLoadingAdjustments(true);
    fetch("/api/stock-adjustments")
      .then((res) => res.json())
      .then((data) => {
        setAdjustments(data.adjustments);
        setIsLoadingAdjustments(false);
      })
      .catch((err) => {
        alert("Ocorreu um erro ao buscar ajustes de estoque");
        setIsLoadingAdjustments(false);
        console.log(err);
      });
  }, []);

  const handleDeleteAdjustment = (id, setIsDeleting) => {
    setIsDeleting(true);
    fetch("/api/stock-adjustments" + id, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ocorreu um erro ao apagar o ajuste de estoque com id " + id);
        } else {
          return res;
        }
      })
      .then((data) => {
        setIsDeleting(false);
        const newAdjustments = adjustments.filter((adjustment) => adjustment._id !== id);
        setAdjustments(newAdjustments);
      })
      .catch((err) => {
        alert("Ocorreu um erro ao deletar o ajuste de estoque com o id " + id);
        setIsDeleting(false);
        console.log(err);
      });
  };

  const columns = [
    { label: '#', render: (row, i) => i + 1, align: 'center' },
    { label: 'Produto', render: (row) => row.product },
    { label: 'Quantidade', render: (row) => row.quantity },
    { label: 'Motivo', render: (row) => row.reason },
    {
      label: 'Ações',
      render: (row) => (
        <div className="flex gap-2">
          <button
            title="Editar"
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow p-2 transition"
            onClick={() => window.location.href = `/stock-adjustments/${row._id}`}
          >
            <i className="fas fa-pen" />
          </button>
          <button
            title="Deletar"
            className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow p-2 transition"
            disabled={isLoadingAdjustments}
            onClick={() => handleDeleteAdjustment(row._id, () => {})}
          >
            <i className="fas fa-trash" />
          </button>
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <p className="mb-4">Ajustes de Estoque Totais: {adjustments?.length}</p>
      <BaseTable
        columns={columns}
        data={adjustments}
        loading={isLoadingAdjustments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetails={handleExpand}
        onPdf={handlePdf}
        actions={{ edit: true, delete: true, details: true, pdf: true }}
        emptyMessage="Nenhum ajuste de estoque encontrado."
      />
    </>
  );
}
