import { useState } from 'react';
import EmpresaSelect from './EmpresaSelect';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, FormControl, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function UserForm({onSubmit, isLoading, user, autoEmpresaId, showEmpresaSelect = true}) {
    const [role, setRole] = useState(user?.role);
    const [gender, setGender] = useState(user?.gender);
    const [empresaId, setEmpresaId] = useState(user?.empresaId || autoEmpresaId || '');

    const handleChangeRole = (event) => {
        setRole(event.target.value);
    };

    const handleChangeGender = (event) => {
        setGender(event.target.value);
    }

    return (
        <form 
            onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const userData = {};
                for (const [key, value] of formData.entries()) {
                    userData[key] = value;
                }
                
                // Adiciona dados dos selects
                userData.role = role;
                userData.gender = gender;
                userData.empresaId = empresaId;
                
                // Debug para verificar os dados
                console.log('Dados do formulário:', userData);
                
                onSubmit({ userData });
            }}
            style={{ marginTop: "40px" }}
        >
            <Grid container spacing={2}> 
                {showEmpresaSelect && (
                    <Grid xs={12}>
                        <EmpresaSelect value={empresaId} onChange={e => setEmpresaId(e.target.value)} required />
                    </Grid>
                )}
                <Grid xs={12} sm={6}>
                    <TextField 
                        name="firstName"
                        id="firstName" 
                        label="Nome" 
                        variant="outlined" 
                        type="text"
                        required
                        defaultValue={user?.firstName}
                        fullWidth
                    />
                </Grid>
                <Grid xs={12} sm={6}>
                    <TextField 
                        name="lastName"
                        id="lastName" 
                        label="Apelido" 
                        variant="outlined" 
                        type="text"
                        required
                        defaultValue={user?.lastName}
                        fullWidth
                    />
                </Grid> 
                <Grid xs={12}>
                    <TextField 
                        name="email"
                        id="email" 
                        label="E-mail" 
                        variant="outlined" 
                        type="email"
                        required
                        defaultValue={user?.email}
                        fullWidth
                    />
                </Grid> 
                <Grid xs={12}>
                    <TextField 
                        name="password"
                        id="password" 
                        label={ user ? "Nova Palavra-Passe" :  "Palavra-Passe" }
                        variant="outlined" 
                        type="password"
                        required={user ? undefined : true}
                        autoComplete='new-password'
                        fullWidth
                    />   
                </Grid>
                <Grid xs={12} sm={6}>
                    <TextField 
                        name="birthdate"
                        id="birthdate" 
                        label="Data de Nascimento"
                        variant="outlined" 
                        type="date"
                        required
                        defaultValue={user?.birthdate ? user.birthdate.split("T")[0] : ''}
                        fullWidth
                    /> 
                </Grid>
                <Grid xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="genderLabel">Género</InputLabel>
                        <Select
                            name="gender"
                            labelId="genderLabel"
                            id="gender"
                            value={gender}
                            onChange={handleChangeGender}
                            required
                        >
                            <MenuItem value="F">Feminino</MenuItem>
                            <MenuItem value="M">Masculino</MenuItem>
                            <MenuItem value="X">Outro</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                    <TextField 
                        name="phone"
                        id="phone" 
                        label="Contacto"
                        variant="outlined" 
                        type="tel"
                        required
                        defaultValue={user?.phone}
                        fullWidth
                    /> 
                </Grid>
                <Grid xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="roleLabel">Função</InputLabel>
                        <Select
                            name="role"
                            labelId="roleLabel"
                            id="role"
                            value={role}
                            onChange={handleChangeRole}
                            required
                        >
                            <MenuItem value="user">Utilizador</MenuItem>
                            <MenuItem value="vendedor">Vendedor</MenuItem>
                            <MenuItem value="caixa">Caixa</MenuItem>
                            <MenuItem value="estoquista">Estoquista</MenuItem>
                            <MenuItem value="comprador">Comprador</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                            <MenuItem value="gerente">Gerente</MenuItem>
                            <MenuItem value="contador">Contador</MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Button type="submit" variant="contained" fullWidth>
                    {user ? "Salvar Alterações" : "Criar Usuário"}
                </Button>
            </Grid>
        </form>
    )
}
