import React, { useState } from "react";
import { formatMetical } from '../utils/formatMetical';
import { faPencil,faReceipt, faTrash, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from "jspdf";


export default function PurchaseTableRow({ i, purchase, handleDeletePurchase }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {purchase.products.map((product, index) => ( // Alteração aqui: trocado 'purchase' por 'product' para evitar conflito de nomes
        <React.Fragment key={`${product._id}_${index}`}> 
          <tr
            data-disabled={isDeleting}
            className={i % 2 === 0 ? "bg-zinc-300" : "bg-red-300"}
          >
            {index === 0 && (
              <>
                <td rowSpan={purchase.products.length} className="p-2 align-center">
                  {i}.
                </td>
                <td rowSpan={purchase.products.length} className="align-center">
                  {purchase.supplierName}
                </td>
              </>
            )}

            <td className="align-middle">{product.product}</td>
            <td className="align-middle">{formatMetical(product.cost)}</td>
            <td className="align-middle">{product.quantity}</td>
            <td className="align-middle">{product.ivaRate}</td>
            <td className="align-middle">{formatMetical(product.totalCost)}</td>

            {index === 0 && (
              <>
                <td rowSpan={purchase.products.length} className="align-right">
                  {formatMetical(purchase.subtotal)}
                </td>
                <td rowSpan={purchase.products.length} className="align-middle">
                  {formatMetical(purchase.discount)}
                </td>
                <td rowSpan={purchase.products.length} className="align-middle">
                  {formatMetical(purchase.totalAfterDiscount)}
                </td>
                <td rowSpan={purchase.products} className="flex items-center">
                  {/* Botão para excluir venda */}
                  <button
                    onClick={() => handleDeletePurchase(purchase._id, setIsDeleting)}
                    className="bg-red-500 w-8 h-8 rounded-md text-zinc-900 hover:bg-red-600 p-1 transition-all"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 m-auto" />
                  </button>

                  {/* Botão para expandir/collapsar detalhes */}
                  <button
                    onClick={toggleExpand}
                    className="text-blue-500 underline cursor-pointer ml-2"
                  >
                    <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="w-4" />
                  </button>
                </td>
              </>
            )}
          </tr>
        </React.Fragment>
      ))}

      {isExpanded && (
        <tr>
          <td colSpan="9">
            <div>
              <p>Nome do Cliente: {purchase.supplierName}</p>
              <p>Morada: {purchase.supplierName}, {purchase.supplierName}, {purchase.supplierName}, {purchase.supplierName}</p>
              <p>Categoria: {purchase.supplierName}</p>
              <p>	Nuit: {purchase.supplierName}</p>
              <ul>
                {purchase.products.map((product, idx) => ( 
                  <li key={idx}>
                    Produto: {product.product}, Preço: {formatMetical(product.cost)}, Quantidade: {product.quantity}, IVA: {product.ivaRate}, Valor: {formatMetical(product.totalCost)}
                  </li>
                ))}
              </ul>
              {purchase.subtotal && <p>Subtotal: {formatMetical(purchase.subtotal)}</p>}
              {purchase.totalIva && <p>Valor do Iva: {formatMetical(purchase.totalIva)}</p>}
              {purchase.totalBeforeDiscount && <p>Valor com Iva: {formatMetical(purchase.totalBeforeDiscount)}</p>}
              {purchase.discount && <p>Desconto: {formatMetical(purchase.discount)}</p>}
              {purchase.totalAfterDiscount && <p>Valor após Desconto(pago): {formatMetical(purchase.totalAfterDiscount)}</p>}
              {purchase.amountPaid && <p>Valor Entregue pelo Cliente: {formatMetical(purchase.amountPaid)}</p>}
              {purchase.change && <p>Divida: {formatMetical(purchase.debt)}</p>}
              {purchase.description && <p>Descrição: {purchase.description}</p>}
              {purchase.createdAt && (
                <p>Feita em: {new Date(purchase.createdAt).toLocaleString()}</p>
              )}
              {purchase.user && (
                <p>
                  Venda feita por: {purchase.user.firstName} {purchase.user.lastName} ({purchase.user.email})
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
