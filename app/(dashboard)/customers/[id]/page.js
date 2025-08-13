"use client";
import PageHeader from '@/components/PageHeader'
import CustomForm from '@/components/CustomerForm'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Container, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

export default function page() {
    const [custom, setCustom]  = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const params = useParams(); 
  const router =useRouter();

  const formatNumbers = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    });
  };


  useEffect (() => {
    setIsLoadingCustom (true);
    fetch("/api/customers/"+ params.id)
    .then((res) =>res.json())
    .then((data) => {
      setCustom(data.custom);
      setIsLoadingCustom(false);
    })
    .catch((err) => {
      alert("Ocorreu um erro ao buscar Cliente ");
      setIsLoadingCustom(false);
      console.log(err);
    });
    },[]); 

    const handleUpdateCustom = (e) => {
        e.preventDefault();
          setIsLoading(true);
          const formData = new FormData(e.target);
  
          const customData = {};
          for (const[key, value] of formData.entries()){
              customData[key]=value;
          }

          fetch ("/api/customers/" + params.id, {
              method: "PATCH",
              body: JSON.stringify(customData),
          }).then((res) =>{
              if(!res.ok){
                  throw new Error ("Ocorreu um erro alterando Cliente" +params.id);
              } else {
                  return res.json();
              }
          })
          .then ((data)=>{
              alert("Cliente com nome:  " + customData.customName + " alterado com sucesso");
              setIsLoading(false);
              router.push("/customers");
          }).catch((err)=>{ 
              alert ("Ocorreu um erro alterando o Cliente com o id" + params.id);
              setIsLoading(false);
          });
      }


  return (
    <Container maxWidth="sm">

      <PageHeader title="Editar e Visualizar Lista de Clientes">
        Aqui voce vai Editar e visualizar os Clientes registados no sistema 
      </PageHeader>

      {custom && (
        <>  
          <CustomForm 
            custom={custom} 
            onSubmit={handleUpdateCustom} 
            isLoading={isLoading}   
          />
          
          
          <Paper sx={{marginTop: '24px'}}>
            <List>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Adicionado por: {custom.user?.firstName + " " + custom.user?.lastName} ({custom.user?.email})
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Registado em: {custom.user?.createdAt.split("T")[0]}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Última actualização: {custom.user?.updatedAt.split("T")[0]}
                    </Typography>
                  </ListItemText>
                </ListItem>
            </List>
          </Paper>
        </>
        )}
    {isLoadingCustom && (
      <p className='mt-16 text-center'>
        <FontAwesomeIcon icon={faCircleNotch} className='animate-spin w-6'></FontAwesomeIcon>
  
      </p>
        )}
    </Container>
  );
}
