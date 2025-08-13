"use client";

  // Handler para detalhes/expandir
  const handleExpand = (user) => {
    window.location.href = `/users/${user.email}`;
  };
import React, { useEffect, useState } from 'react';
import BaseTable from './BaseTable';

export default function UsersTable() {
  const [users, setUsers]  = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    setIsLoadingUsers(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data.users) ? data.users : []);
        setIsLoadingUsers(false);
      })
      .catch((err) => {
        alert("Ocorreu um erro buscando os usuários");
        setIsLoadingUsers(false);
        console.log(err);
      });
  }, []);

  const handleEdit = (user) => {
    window.location.href = `/users/${user.email}`;
  };
  const handleDetails = (user) => {
    window.location.href = `/users/${user.email}`;
  };
  const handleDelete = (user) => {
    if (!window.confirm('Tem certeza que deseja remover este usuário?')) return;
    // Simula loading local para o botão (pode ser melhorado com estado por linha)
    setIsLoadingUsers(true);
    fetch(`/api/users/${user.email}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        setUsers((prev) => prev.filter((u) => u.email !== user.email));
        setIsLoadingUsers(false);
      })
      .catch(() => {
        alert('Erro ao deletar usuário.');
        setIsLoadingUsers(false);
      });
  };

  const columns = [
    { label: '', accessor: 'index', align: 'left' },
    { label: 'Nome', accessor: 'fullName', align: 'left' },
    { label: 'Email', accessor: 'email', align: 'left' },
    { label: 'Função', accessor: 'role', align: 'left' },
    { label: 'Idade', accessor: 'age', align: 'left' },
    { label: 'Genêro', accessor: 'gender', align: 'left' },
    { label: 'Telefone', accessor: 'phone', align: 'left' },
  ];

  // Prepara os dados para a tabela base
  const tableData = users.map((user, i) => ({
    ...user,
    index: i + 1,
    fullName: `${user.firstName} ${user.lastName}`,
    age: user.birthdate ? (new Date().getUTCFullYear() - new Date(user.birthdate).getUTCFullYear()) : '-',
    phone: `+258${user.phone}`,
  }));

  const handlePdf = (user) => {
    window.open(`/api/users/${user.email}/pdf`, '_blank');
  };

  return (
    <>
      <p className='mb-4'>Usuários Totais: {users?.length}</p>
      <BaseTable
        columns={columns}
        data={tableData}
        loading={isLoadingUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetails={handleExpand}
        onPdf={handlePdf}
        actions={{ edit: true, delete: true, details: true, pdf: true }}
      />
    </>
  );
}
