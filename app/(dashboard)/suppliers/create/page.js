"use client";
import PageHeader from "@/components/PageHeader";
import SupplierForm from "@/components/SupplierForm";
import { Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function page() {
    const [isLoading, setIsLoading] =useState(false);
    const router = useRouter();

    const handleCreateSupplier = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.target);

        const supplierData = {};
        for (const[key, value] of formData.entries()){
            supplierData[key]=value;
        }

        fetch ("/api/suppliers",{
            method: "POST",
            body: JSON.stringify(supplierData),
        })
        .then((res) =>{
            if(!res.ok){
                throw new Error ("Ocorreu um erro Adicionando um novo Fornecedor" + supplierData.supplierName);
            } else {
                return res.json();
            }
        })
        .then ((data)=>{
            alert("Fornecedor " + supplierData.supplierName + " adicionado com sucesso");
            setIsLoading(false);
            router.push("/suppliers");
        }).catch((err)=>{ 
            alert ("Ocorreu um erro adicionando" + supplierData.supplierName);
            setIsLoading(false);
        });
    };
  return (
    <Container maxWidth="sm">
    
    <PageHeader title="Adicionar Fornecedor ">
        Aqui voce pode adicionar um novo Fornecedor
    </PageHeader>

    <SupplierForm onSubmit={handleCreateSupplier} isLoading={isLoading}></SupplierForm>    
    </Container>
  )
}
