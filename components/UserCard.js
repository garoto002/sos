"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { Drawer, FormControl, TextField, Container, IconButton, Button, Typography, Tooltip } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
import Grid from "@mui/material/Unstable_Grid2/Grid2";





export default function UserCard({ onEdit, onDelete, onDetails, onPdf, ...props }) {
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [empresas, setEmpresas] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUser, setModalUser] = useState(null);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [empresa, setEmpresa] = useState("");

    useEffect(() => {
        setIsLoadingUsers(true);
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data.users || []);
                setIsLoadingUsers(false);
            })
            .catch(() => setIsLoadingUsers(false));
        fetch('/api/customers')
            .then(res => res.json())
            .then(data => {
                setEmpresas(data.empresas || {});
            });
    }, []);

    function handleDeleteUser(email) {
        setIsDeleting(true);
        fetch('api/users/' + email, {
            method: "DELETE",
        }).then((res) => {
            if (!res.ok) {
                throw new Error(
                    "Ocorreu um erro deletando o usuário com o email " + email
                );
            } else {
                return res;
            }
        })
            .then((data) => {
                setIsDeleting(false);
                const newUsers = users.filter((user) => user.email !== email);
                setUsers(newUsers);
            })
            .catch((err) => {
                alert("Ocorreu um erro deletando o usuário com o email " + email);
                setIsDeleting(false);
                console.log(err);
            });
    }
    // Filtering
    const filteredUsers = users.filter(u => {
        return (
            (!search || (`${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()))) &&
            (!role || (u.role && u.role.toLowerCase().includes(role.toLowerCase()))) &&
            (!empresa || (u.empresaId && (empresas[u.empresaId] || u.empresaId).toLowerCase().includes(empresa.toLowerCase())))
        );
    });
    // Modal open/close
    const handleOpenModal = (user) => {
        setModalUser(user);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setModalUser(null);
    };

    return (
        <>
            <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
                <Typography variant="h5" sx={{fontSize: '16px', textTransform: "uppercase", padding: '8px 16px'}}>
                    Filtrar Utilizadores
                </Typography>
                <FormControl sx={{margin: '8px 16px'}}>
                    <TextField label="Nome" value={search} onChange={e => setSearch(e.target.value)} />
                </FormControl>
                <FormControl sx={{margin: '8px 16px'}}>
                    <TextField label="Função" value={role} onChange={e => setRole(e.target.value)} />
                </FormControl>
                <FormControl sx={{margin: '8px 16px'}}>
                    <TextField label="Empresa" value={empresa} onChange={e => setEmpresa(e.target.value)} />
                </FormControl>
            </Drawer>
            <Container maxWidth="xl" sx={{marginTop: '24px'}}>
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <button disabled={isLoadingUsers} onClick={() => setMenuOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
                        Filtrar
                    </button>
                    <div className="flex flex-col md:flex-row gap-4">
                        <span className="text-lg font-semibold text-blue-700">Utilizadores: {filteredUsers.length}</span>
                    </div>
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user._id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full border border-blue-100 relative">
                                <div className="absolute top-2 right-2 flex gap-4 z-10">
                                    <IconButton
                                        title="PDF"
                                        aria-label="PDF"
                                        onClick={() => onPdf && onPdf(user)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                                    >
                                        <PictureAsPdfIcon fontSize="medium" />
                                    </IconButton>
                                    <IconButton
                                        title="Detalhes"
                                        aria-label="Detalhes"
                                        onClick={() => onDetails && onDetails(user)}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                                    >
                                        <InfoIcon fontSize="medium" />
                                    </IconButton>
                                    <IconButton
                                        title="Deletar"
                                        aria-label="Deletar"
                                        onClick={() => onDelete && onDelete(user)}
                                        className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
                                    >
                                        <DeleteIcon fontSize="medium" />
                                    </IconButton>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex-1 flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-200 flex items-center justify-center shadow">
                                                <PersonIcon style={{ fontSize: 28, color: '#fff' }} />
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-800 truncate">{user.firstName} {user.lastName}</h2>
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium ml-2 shadow">{user.role}</span>
                                        </div>
                                    </div>
                                    <div className="text-gray-500 text-sm mb-1">Empresa: <span className="font-semibold text-blue-700">{empresas && empresas[user.empresaId] ? empresas[user.empresaId] : (user.empresaId || 'N/A')}</span></div>
                                    <div className="text-gray-500 text-sm mb-1">Email: <span className="font-semibold text-green-700">{user.email}</span></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center py-12 col-span-full">Nenhum utilizador encontrado.</div>
                    )}
                </div>
                {isLoadingUsers && (
                    <p className="mt-16 text-center">
                        <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-6" />
                    </p>
                )}
                {/* Modal Detalhes */}
                <div>
                    {modalOpen && modalUser && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                                <h2 className="text-2xl font-bold text-blue-700 mb-2">Detalhes do Utilizador</h2>
                                <div className="mb-2 text-gray-700"><span className="font-semibold">Nome:</span> {modalUser.firstName} {modalUser.lastName}</div>
                                <div className="mb-2 text-gray-700"><span className="font-semibold">Função:</span> {modalUser.role}</div>
                                <div className="mb-2 text-gray-700"><span className="font-semibold">Empresa:</span> <span className="text-blue-700 font-bold">{empresas && empresas[modalUser.empresaId] ? empresas[modalUser.empresaId] : (modalUser.empresaId || 'N/A')}</span></div>
                                <div className="mb-2 text-gray-700"><span className="font-semibold">Email:</span> <span className="text-green-700 font-bold">{modalUser.email}</span></div>
                              </div>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
}
