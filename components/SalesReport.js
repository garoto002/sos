import React from 'react';

const SalesReport = ({ sales }) => {
  return (
    <div>
      <h2>Relatório de Vendas</h2>
      <ul>
        {sales.map((sale) => (
          <li key={sale._id}>
            <p>Cliente: {sale.clientName}</p>
            <p>Produto: {sale.productName}</p>
            <p>Quantidade: {sale.quantity}</p>
            <p>Preço: {sale.price}</p>
            <p>Data: {new Date(sale.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesReport;
