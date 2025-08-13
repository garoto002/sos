
import React from "react";

export default function SaleSummaryPanel({ saleItems, discount, receivedAmount, selectedCustomer }) {
  // Cálculos
  const subtotal = saleItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const totalIva = saleItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0) * (item.ivaRate || 0)), 0);
  const totalBeforeDiscount = subtotal + totalIva;
  const totalAfterDiscount = totalBeforeDiscount - (discount || 0);
  const change = receivedAmount - totalAfterDiscount;
  const now = new Date();
  const fakeInvoiceNumber = String(now.getFullYear()).slice(-2) + (now.getMonth()+1).toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0') + '-' + now.getHours().toString().padStart(2,'0') + now.getMinutes().toString().padStart(2,'0');

  return (
    <aside className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 md:p-12 w-full min-h-[70vh] max-h-[90vh] max-w-xl mx-auto font-mono flex flex-col justify-between overflow-auto print:bg-white">
      {/* Cabeçalho da fatura */}
      <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
        <div className="text-xl font-bold text-blue-900 tracking-widest">Cetus</div>
        <div className="text-xs text-gray-500">NIF: 123456789</div>
        <div className="text-xs text-gray-500">Rua Exemplo, Maputo</div>
        <div className="text-xs text-gray-500">Tel: 21 000 0000</div>
        <div className="text-xs text-gray-500 mt-1">FATURA SIMPLIFICADA</div>
        <div className="text-xs text-gray-500">Nº: <span className="font-bold">{fakeInvoiceNumber}</span></div>
        <div className="text-xs text-gray-500">{now.toLocaleDateString()} {now.toLocaleTimeString()}</div>
      </div>

      {/* Dados do cliente */}
      <div className="mb-2 text-sm flex flex-col gap-1">
        <div><span className="font-semibold">Cliente:</span> {selectedCustomer?.customerName || '-'}</div>
      </div>

      {/* Tabela de produtos */}
      <table className="w-full text-xs border-separate border-spacing-y-1 mb-2">
        <thead>
          <tr className="text-blue-900 border-b border-gray-300">
            <th className="text-left">Produto</th>
            <th className="text-center">Qtd</th>
            <th className="text-right">Unit.</th>
            <th className="text-right">IVA</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {saleItems.length === 0 && (
            <tr><td colSpan={5} className="text-center text-gray-400">Nenhum produto</td></tr>
          )}
          {saleItems.map((item, idx) => (
            <tr key={idx} className="border-b border-dashed border-gray-200">
              <td>{item.product}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">{item.price?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</td>
              <td className="text-right">{item.ivaRate ? (item.ivaRate*100).toFixed(0) + '%' : '-'}</td>
              <td className="text-right font-semibold">{item.totalPrice?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totais */}
      <div className="border-t border-dashed border-gray-400 pt-2 mt-2 text-sm flex flex-col gap-1">
        <div className="flex justify-between"><span>Subtotal</span> <span>{subtotal.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></div>
        <div className="flex justify-between"><span>IVA total</span> <span>{totalIva.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></div>
        <div className="flex justify-between"><span>Desconto</span> <span>{discount?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></div>
        <div className="flex justify-between font-bold text-blue-900 text-base mt-1"><span>Total a pagar</span> <span>{totalAfterDiscount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></div>
        <div className="flex justify-between"><span>Recebido</span> <span>{receivedAmount?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></div>
        <div className={"flex justify-between " + (change < 0 ? 'text-red-600' : 'text-green-700')}>
          <span>{change < 0 ? 'Falta' : 'Troco'}</span> <span>{Math.abs(change).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
        </div>
      </div>

      {/* Rodapé */}
      <div className="text-center text-xs text-gray-400 border-t border-dashed border-gray-300 mt-4 pt-2">
        Obrigado pela preferência!
      </div>
    </aside>
  );
}
