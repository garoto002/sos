import React, { useState } from 'react';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import { Edit, Delete, Visibility } from '@mui/icons-material';

export default function UserTableRow( {user, i, handleDeleteUser} ) {
  const calculateAge =(birthdate) =>{
    const date = new Date();
    const birthdateDate = new Date(birthdate);
    const age = Math.abs(date.getUTCFullYear() - birthdateDate.getUTCFullYear());
    return age;
  };

    const [IsDeleting, setIsDeleting] =useState(false);

  return ( 
    <tr 
    data-disabled={IsDeleting} 
    className={`data-[disabled=true]:bg-red-300 ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}
    >
        <td className='p-2'>{i}.</td>
        <td >{user.firstName + " " + user.lastName }</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>{calculateAge(user.birthdate)}</td>
        <td>{user.gender}</td>
        <td>+258{user.phone}</td>
        <td className='flex gap-2 p-2'>
          <IconButton title="Editar" aria-label="Editar" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition" onClick={() => window.location.href = `/users/${user.email}` }>
            <Edit fontSize="medium" />
          </IconButton>
          <IconButton title="Detalhes" aria-label="Detalhes" className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition" onClick={() => window.location.href = `/users/${user.email}` }>
            <Visibility fontSize="medium" />
          </IconButton>
          <IconButton title="Deletar" aria-label="Deletar" className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition" disabled={IsDeleting} onClick={() => handleDeleteUser(user.email, setIsDeleting)}>
            <Delete fontSize="medium" />
          </IconButton>
        </td>
    </tr>
  );
}
