import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, FormHelperText } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import { useRef } from "react";
import EmpresaSelect from "./EmpresaSelect";

export default function ProductForm({ onSubmit, isLoading, product }) {
  const [category, setCategory] = useState(product?.category || "eletronicos");
  const [brand, setBrand] = useState(product?.brand || "Apple");
  const [status, setStatus] = useState(product?.status || "ativo");
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "");
  const [description, setDescription] = useState(product?.description || "");
  const imageInputRef = useRef();

  const handleChangeCategory = (event) => setCategory(event.target.value);
  const handleChangeBrand = (event) => setBrand(event.target.value);
  const handleChangeStatus = (event) => setStatus(event.target.value);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">{product ? "Editar Produto" : "Adicionar Produto"}</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Nome" type="text" name="name" id="name" required defaultValue={product?.name} fullWidth />
          <TextField label="SKU / Código de Barras" type="text" name="sku" id="sku" required defaultValue={product?.sku} fullWidth />
          <FormControl fullWidth>
            <InputLabel id="categoryId">Categoria</InputLabel>
            <Select labelId="categoryId" id="category" name="category" value={category} label="Categoria" onChange={handleChangeCategory}>
              <MenuItem value="eletronicos">Electrónicos</MenuItem>
              <MenuItem value="vestuario">Vestuário</MenuItem>
              <MenuItem value="esporte">Desporto</MenuItem>
              <MenuItem value="alimentos">Alimentos</MenuItem>
              <MenuItem value="outros">Outros</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="brandId">Marca</InputLabel>
            <Select labelId="brandId" id="brand" name="brand" value={brand} label="Marca" onChange={handleChangeBrand}>
              <MenuItem value="Apple">Apple</MenuItem>
              <MenuItem value="Samsung">Samsung</MenuItem>
              <MenuItem value="LG">LG</MenuItem>
              <MenuItem value="Sony">Sony</MenuItem>
              <MenuItem value="Outros">Outros</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Preço de Custo" type="number" name="cost" id="cost" required defaultValue={product?.cost} fullWidth />
          <TextField label="Quantidade" type="number" name="quantity" id="quantity" required defaultValue={product?.quantity} fullWidth />
          <TextField label="Quantidade em Stock" type="number" name="quantityInStock" id="quantityInStock" required defaultValue={product?.quantityInStock} fullWidth />
          <TextField label="Stock Mínimo" type="number" name="stockMinimum" id="stockMinimum" defaultValue={product?.stockMinimum} fullWidth />
          <TextField label="Preço de Venda" type="number" name="price" id="price" required defaultValue={product?.price} fullWidth />
          <TextField label="IVA (%)" type="number" name="ivaRate" id="ivaRate" required defaultValue={product?.ivaRate} fullWidth />
          <FormControl fullWidth>
            <InputLabel id="statusId">Status</InputLabel>
            <Select labelId="statusId" id="status" name="status" value={status} label="Status" onChange={handleChangeStatus}>
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
              <MenuItem value="descontinuado">Descontinuado</MenuItem>
            </Select>
          </FormControl>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
            <input type="file" name="image" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="block w-full text-sm" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 rounded shadow w-32 h-32 object-cover" />}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
            <textarea name="description" id="description" rows={4} required value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded p-2" placeholder="Descreva o produto com detalhes..." />
          </div>
        </div>
        <Button disabled={isLoading} type="submit" fullWidth className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-full shadow-lg transition-all duration-300 font-semibold text-lg">
          {product ? "Salvar Alterações" : "Adicionar Produto"}
        </Button>
      </form>
    </div>
  );
}