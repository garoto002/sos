
"use client";

import React, { useEffect, useState } from "react";
import { formatMetical } from '../utils/formatMetical';
import jsPDF from "jspdf";
import "jspdf-autotable";
import BaseTable from "./BaseTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function PurchasesTable({
  startDate = "",
  endDate = "",
  filterOption = "all",
  selectedMonth = "",
  selectedDay = "",
  selectedYear = "",
  selectedCategory = "",
  supplierName = ""
}) {
  const [purchases, setPurchases] = useState([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  
  // Use formatMetical for Mozambican currency formatting
  const formatNumbers = formatMetical;

  // Handlers para BaseTable
  const handleEdit = (row) => {
    window.location.href = `/purchase/${row._id}`;
  };
  
  const handleDelete = (row) => {
    handleDeletePurchase(row._id, () => {});
  };
  
  const handleExpand = (row) => {
    alert('Detalhes não implementados');
  };

  const handlePdf = (purchase) => {
    window.open(`/api/purchases/${purchase._id}/pdf`, '_blank');
  };

  useEffect(() => {
    setIsLoadingPurchases(true);
    fetch("/api/purchases")
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data.purchases);
        setIsLoadingPurchases(false);
      })
      .catch((err) => {
        alert("Ocorreu um erro buscando as vendas");
        setIsLoadingPurchases(false);
        console.log(err);
      });
  }, []);

  const handleDeletePurchase = (id, setIsDeleting) => {
    setIsDeleting(true);
    fetch("/api/purchases/" + id, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ocorreu um erro deletando a venda com o id " + id);
        } else {
          return res;
        }
      })
      .then((data) => {
        setIsDeleting(false);
        const newPurchase = purchases.filter((purchase) => purchase._id !== id);
        setPurchases(newPurchase);
      })
      .catch((err) => {
        alert("Ocorreu um erro deletando a venda com o id " + id);
        setIsDeleting(false);
        console.log(err);
      });
  };

  // Remove handleFilterChange (filter state is now in parent)

  const getFilteredPurchasesData = () => {
    const filteredPurchases = getFilteredPurchases();
    const labels = filteredPurchases.map((purchase, index) => `Venda ${index + 1}`);
    const values = filteredPurchases.map((purchase) => purchase.totalAfterDiscount);

    return { labels, values };
  };

  // Use filter props for filtering
  const getFilteredPurchases = () => {
    return purchases.filter((purchase) => {
      const meetsDateFilter = (startDate && new Date(purchase.createdAt) >= new Date(startDate)) || !startDate;
      const meetsEndDateFilter = (endDate && new Date(purchase.createdAt) <= new Date(endDate)) || !endDate;
      const meetsMonthFilter = filterOption === "month" ? selectedMonth && new Date(purchase.createdAt).getMonth() + 1 === parseInt(selectedMonth) : true;
      const meetsDayFilter = filterOption === "day" ? selectedDay && new Date(purchase.createdAt).getDate() === parseInt(selectedDay) : true;
      const meetsYearFilter = filterOption === "year" ? selectedYear && new Date(purchase.createdAt).getFullYear() === parseInt(selectedYear) : true;
      const meetsCategoryFilter = selectedCategory ? purchase.products.some((product) => product.category === selectedCategory) : true;
      const meetsSupplierNameFilter = supplierName ? (purchase.supplierName || "").toLowerCase().includes(supplierName.toLowerCase()) : true;
      return (
        meetsDateFilter &&
        meetsEndDateFilter &&
        meetsMonthFilter &&
        meetsDayFilter &&
        meetsYearFilter &&
        meetsCategoryFilter &&
        meetsSupplierNameFilter
      );
    });
  };

  const handleViewGraphs = () => {
    setShowGraphs(true);
  };

  const filteredPurchases = getFilteredPurchases();

  const handlePrintPDF = () => {
    const pdf = new jsPDF();

    pdf.text(`Relatório de Compras - Período: ${getPeriodLabel()}`, 14, 15);

    pdf.autoTable({
      head: [
        ['Ordem', 'Nome do Fornecedor', 'Produto', 'Preço', 'Quantidade', 'Iva', 'Preço/Total', 'SubTotal', 'Desconto', 'Total']
      ],
      body: filteredPurchases.flatMap((purchase, i) => {
        return purchase.products.map((product, index) => [
          index === 0 ? i + 1 : '',
          index === 0 ? purchase.supplierName : '',
          product.product,
          product.price,
          product.quantity,
          product.ivaRate,
          product.totalPrice,
          index === 0 ? purchase.subtotal : '',
          index === 0 ? purchase.discount : '',
          index === 0 ? purchase.totalAfterDiscount : ''
        ]);
      }),
      startY: 20,
    });

    pdf.save('relatorio_compras.pdf');
  };

  const getPeriodLabel = () => {
    switch (filterOption) {
      case "month":
        return `Mês: ${new Date(2022, parseInt(selectedMonth, 10) - 1, 1).toLocaleString("pt-br", { month: "long" })}`;
      case "day":
        return `Dia: ${parseInt(selectedDay, 10)}`;
      case "year":
        return `Ano: ${selectedYear}`;
      default:
        return "Todos";
    }
  };

  // Flatten purchases for table display (each product is a row)
  const tableData = filteredPurchases.flatMap((purchase, i) =>
    purchase.products.map((product, idx) => ({
      ordem: idx === 0 ? i + 1 : '',
      supplierName: idx === 0 ? purchase.supplierName : '',
      product: product.product,
      cost: product.cost,
      quantity: product.quantity,
      ivaRate: product.ivaRate,
      totalCost: product.totalCost,
      subtotal: idx === 0 ? purchase.subtotal : '',
      discount: idx === 0 ? purchase.discount : '',
      totalAfterDiscount: idx === 0 ? purchase.totalAfterDiscount : '',
      purchaseId: purchase._id,
      purchase,
      isFirst: idx === 0,
      rowSpan: purchase.products.length,
    }))
  );

  const columns = [
    {
      label: 'Ordem',
      render: (row) => row.ordem,
      rowSpan: (row) => row.isFirst ? row.rowSpan : 1,
      align: 'center',
    },
    {
      label: 'Nome do Fornecedor',
      render: (row) => row.supplierName,
      rowSpan: (row) => row.isFirst ? row.rowSpan : 1,
      align: 'center',
    },
    { label: 'Produto', render: (row) => row.product },
    { label: 'Custo', render: (row) => formatNumbers(row.cost) },
    { label: 'Qtd', render: (row) => row.quantity },
    { label: 'iva (taxa)', render: (row) => row.ivaRate },
    { label: 'Custo Total', render: (row) => formatNumbers(row.totalCost) },
    {
      label: 'SubTotal',
      render: (row) => row.isFirst ? formatNumbers(row.subtotal) : '',
      rowSpan: (row) => row.isFirst ? row.rowSpan : 1,
      align: 'right',
    },
    {
      label: 'Desconto',
      render: (row) => row.isFirst ? formatNumbers(row.discount) : '',
      rowSpan: (row) => row.isFirst ? row.rowSpan : 1,
      align: 'center',
    },
    {
      label: 'Total Pago',
      render: (row) => row.isFirst ? formatNumbers(row.totalAfterDiscount) : '',
      rowSpan: (row) => row.isFirst ? row.rowSpan : 1,
      align: 'center',
    },
    {
      label: 'Acções',
      render: (row) => row.isFirst && (
        <div className="flex gap-2">
          <button
            title="Editar"
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow p-2 transition"
            onClick={() => window.location.href = `/purchases/${row.purchaseId}`}
          >
            <i className="fas fa-pen" />
          </button>
          <button
            title="Detalhes"
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow p-2 transition"
            onClick={() => alert('Detalhes não implementados')}
          >
            <i className="fas fa-info-circle" />
          </button>
          <button
            title="Deletar"
            className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow p-2 transition"
            disabled={isLoadingPurchases}
            onClick={() => handleDeletePurchase(row.purchaseId, () => {})}
          >
            <i className="fas fa-trash" />
          </button>
        </div>
      ),
      rowSpan: (row) => row.isFirst ? row.rowSpan : 1,
      align: 'center',
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrintPDF}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <i className="fas fa-print" /> Imprimir PDF
        </button>
      </div>
      <p className="mb-2">Compras totais: {filteredPurchases.length}</p>
      <p className="mb-2">Volume de compras no período: {formatNumbers(filteredPurchases.reduce((totalAfterDiscount, purchase) => totalAfterDiscount + purchase.totalAfterDiscount, 0))}</p>
      <BaseTable
        columns={columns}
        data={tableData}
        loading={isLoadingPurchases}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetails={handleExpand}
        onPdf={handlePdf}
        actions={{ edit: true, delete: true, details: true, pdf: true }}
        emptyMessage="Nenhuma compra encontrada."
      />
    </>
  );
}

