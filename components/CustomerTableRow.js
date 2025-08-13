import Link from 'next/link';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Edit, Delete, Visibility } from '@mui/icons-material';


export default function CustomTableRow({i, custom, handleDeleteCustom}) {
  const [IsDeleting, setIsDeleting] = useState(false);
  return (
    <tr 
      data-disabled={IsDeleting}
      className={`data-[disabled=true]:bg-red-500 ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}
    >
      <td className='p-2'>{i}. </td>
      <td>{custom.customName}</td>
      <td>{custom.location}</td>
      <td>{custom.phone}</td>
      <td>{custom.nuit}</td>
      <td className='flex gap-2 p-2'>
        <IconButton title="Editar" aria-label="Editar" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition" onClick={() => window.location.href = `/customers/${custom._id}` }>
          <Edit fontSize="medium" />
        </IconButton>
        <IconButton title="Detalhes" aria-label="Detalhes" className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition" onClick={() => window.location.href = `/customers/${custom._id}` }>
          <Visibility fontSize="medium" />
        </IconButton>
        <IconButton title="Deletar" aria-label="Deletar" className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition" disabled={IsDeleting} onClick={() => handleDeleteCustom(custom._id, setIsDeleting)}>
          <Delete fontSize="medium" />
        </IconButton>
      </td>
    </tr>
  );
}