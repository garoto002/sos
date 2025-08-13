"use client"
import Link from 'next/link';
import React, { useState } from "react";
import IconButton from '@mui/material/IconButton';
import { Edit, Delete, Visibility } from '@mui/icons-material';

export default function ProductTableRow({ i, product, handleDeleteProduct }) {
  const formatNumbers = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const [isDeleting, setIsDeleting] = useState(false);
  // Adicione a classe 'low-stock' se o produto tiver estoque baixo
  const rowClassName = `data-[disabled=true]:bg-red-500 ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50'} ${product.quantityInStock < product.stockMinimum ? 'low-stock' : ''}`;
  return (
    <tr
      data-disabled={isDeleting}
      className={rowClassName}
    >
      <td className='p-2'>{i+1}. </td>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.quantity}</td>
      <td>{product.quantityInStock}</td>
      <td>{formatNumbers(product.cost)}</td>
      <td>{formatNumbers(product.totalCost)}</td>
      <td>{formatNumbers(product.price)}</td>
      <td>{formatNumbers(product.totalPrice)}</td>
      <td>{product.stockMinimum}</td>
      <td className='flex gap-2 p-2'>
        <IconButton title="Editar" aria-label="Editar" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition" onClick={() => window.location.href = `/products/${product._id}` }>
          <Edit fontSize="medium" />
        </IconButton>
        <IconButton title="Detalhes" aria-label="Detalhes" className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition" onClick={() => window.location.href = `/stock-movement-history/${product._id}` }>
          <Visibility fontSize="medium" />
        </IconButton>
        <IconButton title="Deletar" aria-label="Deletar" className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition" disabled={isDeleting} onClick={() => handleDeleteProduct(product._id, setIsDeleting)}>
          <Delete fontSize="medium" />
        </IconButton>
      </td>
      <td>
        {product.quantityInStock < product.stockMinimum && (
          <span className='text-red-500 font-bold'>!</span>
        )}
      </td>
    </tr>
  );
}
