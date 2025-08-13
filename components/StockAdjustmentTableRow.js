import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React, { useState } from "react";

export default function StockAdjustmentTableRow({ i, adjustment, handleDeleteAdjustment }) {
  const [isDeleting, setIsDeleting] = useState(false); // Adicione esta linha para definir o estado de isDeleting

  const formatNumbers = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <tr 
      data-disabled={isDeleting} // Corrija para usar isDeleting em vez de IsDeleting
      data-index={i % 2} className="bg-zinc-300 data-[disabled=true]:bg-red-500 data-[index='0']:bg-zinc-100"
    >
      <td className='p-2'>{i}. </td>
      <td>{adjustment.product}</td>
      <td>{adjustment.quantity}</td>
      <td>{adjustment.reason}</td>
      <td className='flex gap-2 p-2'>
        <Link 
          href={"/stock-adjustments/" + adjustment._id} className='bg-sky-500 w-8 rounded-md text-zinc-900 hover:bg-sky-600 p-1 transition-all'>
          <FontAwesomeIcon icon={faPencil} className='w-5'/>
        </Link>
        <button 
          onClick={() => handleDeleteAdjustment(adjustment._id, setIsDeleting)}
          className='bg-sky-500 w-8 rounded-md text-zinc-900 hover:bg-sky-600 p-1 transition-all'>
          <FontAwesomeIcon icon={faTrash} className='w-4'/>
        </button>
      </td>
    </tr>
  );
}
