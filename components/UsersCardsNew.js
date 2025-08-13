"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Alert,
  Container
} from '@mui/material';
import {
  Person,
  Email,
  Business,
  AdminPanelSettings,
  Edit,
  Delete,
  PictureAsPdf,
  Info,
  ExpandMore,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto'
};

export default function UsersCardsNew({ users = [], onUserUpdate }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [expanded, setExpanded] = useState([]);

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'ativo',
      company: user.company || ''
    });
    setEditModalOpen(true);
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
        setEditModalOpen(false);
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

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  const handleGeneratePDF = () => {
    window.open(`/api/users/pdf?id=${selectedUser._id}`, '_blank');
    handleMenuClose();
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

  if (!users || users.length === 0) {
    return (
      <Box className="text-center py-12">
        <Person className="text-6xl text-gray-300 mb-4" />
        <Typography variant="h6" className="text-gray-500 mb-2">
          Nenhum usuário encontrado
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Tente ajustar os filtros ou adicionar novos usuários
        </Typography>
      </Box>
    );
  }

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

      <Grid container spacing={3}>
        {users.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                {/* Cabeçalho com Avatar */}
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="w-16 h-16 mb-3 bg-blue-500">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  
                  <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                    {user.name || 'Nome não informado'}
                  </Typography>
                  
                  <div className="flex gap-2 mb-3">
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role === 'admin' ? 'Admin' : 'Usuário'}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                    <Chip
                      icon={user.status === 'ativo' ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                      label={user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </div>
                </div>

                {/* Informações Básicas */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Email className="mr-2 text-base text-blue-500" />
                    <Typography variant="body2" noWrap>
                      {user.email || 'Email não informado'}
                    </Typography>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Business className="mr-2 text-base text-green-500" />
                    <Typography variant="body2" noWrap>
                      {user.company || 'Empresa não informada'}
                    </Typography>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <IconButton size="small" onClick={() => handleEditClick(user)}>
                      <Edit fontSize="small" className="text-blue-500" />
                    </IconButton>
                    <IconButton size="small" onClick={() => {
                      setSelectedUser(user);
                      setDeleteModalOpen(true);
                    }}>
                      <Delete fontSize="small" className="text-red-500" />
                    </IconButton>
                    <IconButton size="small" onClick={() => {
                      setSelectedUser(user);
                      setModalOpen(true);
                    }}>
                      <Info fontSize="small" className="text-green-500" />
                    </IconButton>
                  </div>
                  
                  <IconButton
                    onClick={() => handleExpandClick(index)}
                    sx={{
                      transform: expanded[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  >
                    <ExpandMore />
                  </IconButton>
                </div>

                {/* Conteúdo Expandido */}
                {expanded[index] && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" className="font-bold text-gray-700 mb-1">
                      Data de Criação
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      {new Date(user.createdAt).toLocaleDateString('pt-PT')} às{' '}
                      {new Date(user.createdAt).toLocaleTimeString('pt-PT')}
                    </Typography>

                    <Typography variant="subtitle2" className="font-bold text-gray-700 mb-1">
                      Última Atualização
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {new Date(user.updatedAt).toLocaleDateString('pt-PT')} às{' '}
                      {new Date(user.updatedAt).toLocaleTimeString('pt-PT')}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal de Detalhes */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Box sx={modalStyle}>
          {selectedUser && (
            <>
              <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                Detalhes do Usuário
              </Typography>

              <div className="mb-6">
                <div className="flex items-center gap-4">
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
                        icon={selectedUser.status === 'ativo' ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                        label={selectedUser.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        color={getStatusColor(selectedUser.status)}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Email
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {selectedUser.email || 'Não informado'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Empresa
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {selectedUser.company || 'Não informado'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Data de Criação
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {new Date(selectedUser.createdAt).toLocaleDateString('pt-PT')} às{' '}
                    {new Date(selectedUser.createdAt).toLocaleTimeString('pt-PT')}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" className="font-bold text-gray-700">
                    Última Atualização
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {new Date(selectedUser.updatedAt).toLocaleDateString('pt-PT')} às{' '}
                    {new Date(selectedUser.updatedAt).toLocaleTimeString('pt-PT')}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setModalOpen(false)}>
                  Fechar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Editar Usuário
          </Typography>

          <div className="space-y-4">
            <TextField
              label="Nome"
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />

            <TextField
              label="Email"
              fullWidth
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Função</InputLabel>
              <Select
                value={editForm.role}
                label="Função"
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <MenuItem value="user">Usuário</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status}
                label="Status"
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Empresa"
              fullWidth
              value={editForm.company}
              onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
            />
          </div>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditSave}
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Confirmar Exclusão
          </Typography>

          <Typography>
            Tem certeza que deseja excluir o usuário {selectedUser?.name}?
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
            >
              {loading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
