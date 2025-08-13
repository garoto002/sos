"use client";
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, Container, Divider, Drawer, FormControl, IconButton, List, ListItem, ListItemText, TextField, Typography, Modal } from "@mui/material";

import { Delete, Edit, PictureAsPdf, Info } from "@mui/icons-material";
import Link from "next/link";


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));


export default function ProductsCards() {
  const [expanded, setExpanded] = React.useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleToggleMenu = () => setMenuOpen(!menuOpen);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const handleDeleteProduct = async (id) => {
    setIsDeleting(true);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert('Erro ao remover produto!');
      }
    } catch (err) {
      alert('Erro de rede ao remover produto!');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  useEffect(() => {
    setIsLoadingProducts(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setExpanded(Array(data.products.length).fill(false));
        setIsLoadingProducts(false);
      })
      .catch((err) => {
        alert("Ocorreu um erro ao buscar os Produtos ");
        setIsLoadingProducts(false);
        console.log(err);
      });
  }, []);

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.quantityInStock || 0), 0);
  const filteredProducts = products.filter(p => {
    return (
      (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
      (!category || (p.category && p.category.toLowerCase().includes(category.toLowerCase()))) &&
      (!minStock || p.quantityInStock >= parseInt(minStock)) &&
      (!maxStock || p.quantityInStock <= parseInt(maxStock))
    );
  });

  return (
    <>
      <Drawer open={menuOpen} onClose={handleToggleMenu}>
        <Typography variant="h5" sx={{ fontSize: '16px', textTransform: "uppercase", padding: '8px 16px' }}>
          Filtrar Produtos
        </Typography>
        <FormControl sx={{ margin: '8px 16px' }}>
          <TextField label="Nome" value={search} onChange={e => setSearch(e.target.value)} />
        </FormControl>
        <FormControl sx={{ margin: '8px 16px' }}>
          <TextField label="Categoria" value={category} onChange={e => setCategory(e.target.value)} />
        </FormControl>
        <FormControl sx={{ margin: '8px 16px' }}>
          <TextField label="Estoque Mínimo" type="number" value={minStock} onChange={e => setMinStock(e.target.value)} />
        </FormControl>
        <FormControl sx={{ margin: '8px 16px' }}>
          <TextField label="Estoque Máximo" type="number" value={maxStock} onChange={e => setMaxStock(e.target.value)} />
        </FormControl>
      </Drawer>
      <Container maxWidth="xl" sx={{ marginTop: '24px' }}>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button disabled={isLoadingProducts} onClick={() => setMenuOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
            Filtrar
          </button>
          <div className="flex flex-col md:flex-row gap-4">
            <span className="text-lg font-semibold text-blue-700">Produtos: {products.length}</span>
            <span className="text-lg font-semibold text-green-600">Estoque total: {totalStock}</span>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full border border-blue-100">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
                      <div className="text-green-700 font-semibold text-base">{product.price ? product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) : '-'}</div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{product.category || 'N/A'}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">Estoque: <span className="font-semibold text-gray-700">{product.quantityInStock}</span></div>
                  <div className="text-gray-500 text-sm mb-1">Fornecedor: <span className="font-semibold text-green-700">{product.supplierName || '-'}</span></div>
                </div>
                <div className="flex gap-4 justify-center mb-2">
                  <IconButton
                    title="PDF"
                    aria-label="PDF"
                    onClick={() => onPdf && onPdf(product)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition"
                  >
                    <PictureAsPdf fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Editar"
                    aria-label="Editar"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg shadow transition"
                    onClick={() => onEdit && onEdit(product)}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Detalhes"
                    aria-label="Detalhes"
                    onClick={() => { setModalProduct(product); setModalOpen(true); }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow transition"
                  >
                    <Info fontSize="medium" />
                  </IconButton>
                  <IconButton
                    title="Deletar"
                    aria-label="Deletar"
                    onClick={() => onDelete && onDelete(product)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow transition"
                  >
                    <Delete fontSize="medium" />
                  </IconButton>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-12 col-span-full">Nenhum produto encontrado.</div>
          )}
        </div>
        {isLoadingProducts && (
          <p className="mt-16 text-center">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-6" />
          </p>
        )}
        {/* Modal Detalhes */}
        <div>
          {modalOpen && modalProduct && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                <button onClick={() => { setModalOpen(false); setModalProduct(null); }} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Detalhes do Produto</h2>
                {modalProduct.imageUrl && (
                  <img src={modalProduct.imageUrl} alt={modalProduct.name} className="max-h-52 max-w-full object-contain rounded-xl border-4 border-indigo-300 bg-white mb-3 shadow" />
                )}
                <div className="mb-2 text-gray-700"><span className="font-semibold">Nome:</span> {modalProduct.name}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Categoria:</span> {modalProduct.category || '-'}</div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Preço:</span> <span className="text-green-700 font-bold">{modalProduct.price ? modalProduct.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }) : '-'}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Estoque:</span> <span className="text-blue-700 font-bold">{modalProduct.quantityInStock}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Fornecedor:</span> <span className="text-indigo-700 font-bold">{modalProduct.supplierName || '-'}</span></div>
                <div className="mb-2 text-gray-700"><span className="font-semibold">Descrição:</span> <span className="text-indigo-700 font-bold">{modalProduct.description || '-'}</span></div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}