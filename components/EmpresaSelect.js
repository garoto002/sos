import { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function EmpresaSelect({ value, onChange, required }) {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetch('/api/customers') // Ajuste para endpoint correto de empresas se necessário
      .then(res => res.json())
      .then(data => {
        // Supondo que data.empresas seja um array [{_id, nome}]
        setEmpresas(data.empresas || []);
      });
  }, []);

  return (
    <FormControl fullWidth required={required} sx={{ mb: 2 }}>
      <InputLabel id="empresa-label">Empresa</InputLabel>
      <Select
        labelId="empresa-label"
        id="empresaId"
        name="empresaId"
        value={value}
        label="Empresa"
        onChange={onChange}
      >
        {empresas.map((empresa) => (
          <MenuItem key={empresa._id} value={empresa._id}>{empresa.nome || empresa.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
