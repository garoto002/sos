"use client";

import React, { useState } from 'react';
import BaseTable from './BaseTable';
import {
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert
} from '@mui/material';
import {
  Edit,
  Delete,
  PictureAsPdf,
  Visibility,
  Person,
  AdminPanelSettings,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

export default function UsersTableNew({ users = [], onUserUpdate }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'ativo',
      company: user.company || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setAlert({ show: true, message: 'Usuário atualizado com sucesso!', type: 'success' });
        setEditDialogOpen(false);
        if (onUserUpdate) onUserUpdate();
      } else {
        throw new Error('Erro ao atualizar usuário');
      }
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao atualizar usuário', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlert({ show: true, message: 'Usuário removido com sucesso!', type: 'success' });
        setDeleteDialogOpen(false);
        if (onUserUpdate) onUserUpdate();
      } else {
        throw new Error('Erro ao remover usuário');
      }
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao remover usuário', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  const handleGeneratePDF = (user) => {
    window.open(`/api/users/pdf?id=${user._id}`, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'inativo': return 'error';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'secondary';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings fontSize="small" />;
      case 'user': return <Person fontSize="small" />;
      default: return <Person fontSize="small" />;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Usuário',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 bg-blue-500">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">
              {user.name || 'Nome não informado'}
            </div>
            <div className="text-sm text-gray-500">
              {user.email || 'Email não informado'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Função',
      render: (user) => (
        <Chip
          icon={getRoleIcon(user.role)}
          label={user.role === 'admin' ? 'Administrador' : 'Usuário'}
          color={getRoleColor(user.role)}
          size="small"
        />
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <Chip
          icon={user.status === 'ativo' ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
          label={user.status === 'ativo' ? 'Ativo' : 'Inativo'}
          color={getStatusColor(user.status)}
          size="small"
        />
      )
    },
    {
      key: 'company',
      label: 'Empresa',
      render: (user) => user.company || 'Não informado'
    },
    {
      key: 'createdAt',
      label: 'Data de Criação',
      render: (user) => new Date(user.createdAt).toLocaleDateString('pt-PT')
    }
  ];

  return (
    <>
      {alert.show && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <BaseTable
        data={users}
        columns={columns}
        emptyMessage="Nenhum usuário encontrado"
        onEdit={handleEdit}
        onDelete={(user) => {
          setSelectedUser(user);
          setDeleteDialogOpen(true);
        }}
        onDetails={handleViewDetails}
        onPdf={handleGeneratePDF}
        actions={{
          edit: true,
          delete: true,
          details: true,
          pdf: true
        }}
      />

      {/* Dialog de Edição */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Nome"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              variant="outlined"
            />

            <FormControl fullWidth>
              <InputLabel>Função</InputLabel>
              <Select
                value={editForm.role || 'user'}
                label="Função"
                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              >
                <MenuItem value="user">Usuário</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status || 'ativo'}
                label="Status"
                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Empresa"
              value={editForm.company || ''}
              onChange={(e) => setEditForm({...editForm, company: e.target.value})}
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Usuário</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16 bg-blue-500">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <div>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <div className="flex gap-2 mt-1">
                    <Chip
                      icon={getRoleIcon(selectedUser.role)}
                      label={selectedUser.role === 'admin' ? 'Admin' : 'Usuário'}
                      color={getRoleColor(selectedUser.role)}
                      size="small"
                    />
                    <Chip
                      label={selectedUser.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      color={getStatusColor(selectedUser.status)}
                      size="small"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Email
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {selectedUser.email || 'Não informado'}
                  </Typography>
                </div>

                <div>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Empresa
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {selectedUser.company || 'Não informado'}
                  </Typography>
                </div>

                <div>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Data de Criação
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {new Date(selectedUser.createdAt).toLocaleDateString('pt-PT')} às{' '}
                    {new Date(selectedUser.createdAt).toLocaleTimeString('pt-PT')}
                  </Typography>
                </div>

                <div>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Última Atualização
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {new Date(selectedUser.updatedAt).toLocaleDateString('pt-PT')} às{' '}
                    {new Date(selectedUser.updatedAt).toLocaleTimeString('pt-PT')}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
