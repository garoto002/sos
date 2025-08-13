"use client";
import PageHeader from '@/components/PageHeader';
import SupplierForm from '@/components/SupplierForm';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
    const [supplier, setSupplier]  = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false);
  const params = useParams(); 
  const router =useRouter();

  const formatNumbers = (value) => {
    return value.toLocaleString("en-US", {
      manimumFractionDigits:2,
      maximumFractionDigits:2,
    });
  };


  useEffect (() => {
    setIsLoadingSupplier (true);
    fetch("/api/suppliers/"+ params.id)
    .then((res) =>res.json())
    .then((data) => {
      setSupplier(data.supplier);
      setIsLoadingSupplier(false);
    })
    .catch((err) => {
      alert("Ocorreu um erro ao buscar Fornecedores ");
      setIsLoadingSupplier(false);
      console.log(err);
    });
    },[]); 

    const handleUpdateSupplier = (e) => {
        e.preventDefault();
          setIsLoading(true);
          const formData = new FormData(e.target);
  
          const supplierData = {};
          for (const[key, value] of formData.entries()){
              supplierData[key]=value;
          }
  
          fetch ("/api/suppliers/" + params.id, {
              method: "PATCH",
              body: JSON.stringify(supplierData),
          }).then((res) =>{
              if(!res.ok){
                  throw new Error ("Ocorreu um erro alterando Fornecedor" +params.id);
              } else {
                  return res.json();
              }
          })
          .then ((data)=>{
              alert("Fornecedor com nome:  " + supplierData.supplierName + " alterado com sucesso");
              setIsLoading(false);
              router.push("/suppliers");
          }).catch((err)=>{ 
              alert ("Ocorreu um erro alterando o fornecedor com o id " + params.id);
              setIsLoading(false);
          });
      }


  return (
    <Container maxWidth="sm">
      <PageHeader title="Editar e Visualizar Lista de Produtos">
        Aqui voce vai Editar e visualizar os Fornecedores registados no sistema 
      </PageHeader>


    
        {supplier && 
          (
            <>
              <SupplierForm supplier={supplier} onSubmit={handleUpdateSupplier} isLoading={isLoading}></SupplierForm>
                <Grid container>
                  <Grid xs={12}>
                    <Paper sx={{marginTop: '24px'}} variant='outlined' square={false}>
                      <List>
                        <ListItem>
                          <ListItemText>
                            <Typography>
                              {`Adicionado por: ${supplier.user?.firstName} ${supplier.user?.lastName}`} 
                              ({supplier.user?.email})
                            </Typography>
                          </ListItemText>
                        </ListItem>

                        <ListItem>
                          <ListItemText>
                            <Typography>
                              {`Registado em: ${supplier.user?.createdAt.split("T")[0]}`} 
                            </Typography>
                          </ListItemText>
                        </ListItem>

                        <ListItem>
                          <ListItemText>
                            <Typography>
                              {`Última Modificação: ${supplier.user?.updatedAt.split("T")[0]}`} 
                            </Typography>
                          </ListItemText>
                        </ListItem>

                        
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
                  
            </>
          )
        }

        {
          isLoadingSupplier && (
            <p className='mt-16 text-center'>
              <FontAwesomeIcon icon={faCircleNotch} className='animate-spin w-6'></FontAwesomeIcon>
            </p>
          )
        }
    </Container>
  );
}
  