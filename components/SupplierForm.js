import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";

export default function SupplierForm({onSubmit, isLoading, supplier}) {
  const [category, setCategory] = useState(supplier?.category)

  const handleChangeCategory = (event) => {
    setCategory(event.target.value)
  }
    return (
      <form onSubmit={onSubmit}>
        <Grid container spacing={2} sx={{marginTop: '32px'}}>
          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Nome"
                type="text"
                name="supplierName"
                id="supplierName"
                required
                defaultValue={supplier?.supplierName}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Bairro"
                type="text"
                name="bairro"
                id="bairro"
                required
                defaultValue={supplier?.bairro}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Avenida"
                type="text"
                name="avenue"
                id="avenue"
                required
                defaultValue={supplier?.avenue}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Rua"
                type="text"
                name="street"
                id="street"
                required
                defaultValue={supplier?.street}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Número"
                type="number"
                name="number"
                id="number"
                required
                defaultValue={supplier?.number}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Contacto"
                type="number"
                name="phone"
                id="phone"
                required
                defaultValue={supplier?.phone}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="NUIT"
                type="number"
                name="nuit"
                id="nuit"
                required
                defaultValue={supplier?.nuit}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Empresa"
                type="text"
                name="company"
                id="company"
                defaultValue={supplier?.company}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="Email"
                type="email"
                name="email"
                id="email"
                defaultValue={supplier?.email}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                label="País"
                type="text"
                name="country"
                id="country"
                defaultValue={supplier?.country || 'Moçambique'}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="statusId">Status</InputLabel>
              <Select 
                labelId="statusId"
                id="status"
                name="status"
                defaultValue={supplier?.status || 'ativo'}
                label="Status"
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
                <MenuItem value="pendente">Pendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="categoryId">
                Categoria
              </InputLabel>
              <Select 
                labelId="categoryId"
                id="category"
                name="category"
                value={category}
                label="Categoria"
                onChange={handleChangeCategory}
              >
                <MenuItem value="eletronicos">Electrónicos</MenuItem>
                <MenuItem value="vestuario">Vestuário</MenuItem>
                <MenuItem value="esporte">Desporto</MenuItem>

              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <Button type="submit" disabled={isLoading} variant="contained" fullWidth>
              {
                supplier ?
                  "Salvar Alterações" :
                  "Adicionar Fornecedor"
              }
            </Button>
          </Grid>

        </Grid>
      </form>
    )
  }