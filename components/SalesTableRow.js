import React from 'react';

function SalesTableRow({ index, sale }) {
  return (
    <tr className="border-b border-blue-100 hover:bg-blue-50 transition">
      <td className="p-4 font-semibold text-blue-700">{index}</td>
      <td className="p-4">{sale.customName || '-'}</td>
      <td className="p-4">{sale.products ? sale.products.map(p => p.product).join(', ') : '-'}</td>
      <td className="p-4 font-bold text-green-700">{sale.totalAfterDiscount != null ? sale.totalAfterDiscount + ' MT' : '-'}</td>
      <td className="p-4">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : '-'}</td>
    </tr>
  );
}

export default SalesTableRow;
