"use client";

import PageHeader from '@/components/PageHeader'
import ProductForm from '@/components/ProductForm'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
    const [product, setProduct]  = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const params = useParams(); 
  const router =useRouter();

  const formatNumbers = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    });
  };


  useEffect (() => {
    setIsLoadingProduct (true);
    fetch("/api/products/"+ params.id)
    .then((res) =>res.json())
    .then((data) => {
      setProduct(data.product);
      setIsLoadingProduct(false);
    })
    .catch((err) => {
      alert("Ocorreu um erro ao buscar produtos ");
      setIsLoadingProduct(false);
      console.log(err);
    });
    },[]); 

    const handleUpdateProduct = (e) => {
        e.preventDefault();
          setIsLoading(true);
          const formData = new FormData(e.target);
  
          const productData = {};
          for (const[key, value] of formData.entries()){
              productData[key]=value;
          }
  
          fetch ("/api/products/" + params.id, {
              method: "PATCH",
              body: JSON.stringify(productData),
          })
          .then((res) =>{
              if(!res.ok){
                  throw new Error (
                    "Ocorreu um erro alterando produto" + params.id
                    );
              } else {
                  return res.json();
              }
          })
          .then ((data)=>{
              alert("Produto com nome:  " + productData.name + " alterado com sucesso");
              setIsLoading(false);
              router.push("/products");
          }).catch((err)=>{ 
              alert ("Ocorreu um erro alterando o produto com o id" + params.id);
              setIsLoading(false);
          });
      }

  return (
    <Container maxWidth="sm">
      <PageHeader title="Informações do Produto">
         {product ? `Editar informações de ${product.name}` : 'Editar informações do Produto'}
      </PageHeader>

      {product &&  (
        <>
            <ProductForm 
              product={product}
              onSubmit={handleUpdateProduct} 
              isLoading={isLoading}
            />

            <Paper sx={{marginTop: '24px'}}>
              <List>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Custo Total: {formatNumbers(product.totalCost)}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Preço Total: {formatNumbers(product.totalPrice)}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Adicionado por: {product.user?.firstName + " " + product.user?.lastName}
                      ({product.user?.email})
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Registado em: {product.user?.createdAt.split("T")[0]}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Typography variant='body2'>
                      Última Modificação: {product.user?.updatedAt.split("T")[0]}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </List>
            </Paper>

        </>
      )}

    {isLoadingProduct && (
      <p className='mt-16 text-center'>
        <FontAwesomeIcon icon={faCircleNotch} className='animate-spin'></FontAwesomeIcon>
  
      </p>
        )}
    </Container>
  );
}
  