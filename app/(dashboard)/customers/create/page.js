"use client";

import PageHeader from "@/components/PageHeader";
import CustomForm from "@/components/CustomerForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function page() {

const [isLoading, setIsLoading] =useState(false);
    const router = useRouter();

    const handleAddCustom = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(e.target);

        const customData = {};
        for (const[key, value] of formData.entries()){
            customData[key]=value;
        }

        fetch ("/api/customers",{
            method: "POST",
            body: JSON.stringify(customData),
        })
        .then((res) =>{
            if(!res.ok){
                throw new Error ("Ocorreu um erro Adicionando o Cliente" + customData.customName);
            } else {
                return res.json();
            }
        })
        .then ((data)=>{
            alert("Cliente " + customData.customName + " adicionado com sucesso");
            setIsLoading(false);
            router.push("/customers");
        }).catch((err)=>{ 
            alert ("Ocorreu um erro adicionando o cliente" + customData.customName);
            setIsLoading(false);
        });
    };
  return (
    <>
    
    <PageHeader title="Adicionar novo Cliente  ">
    Aqui voce pode Adicionar um novo Cliente
    </PageHeader>
    
    <section className="mt-8">
        <CustomForm onSubmit={handleAddCustom} isLoading={isLoading}></CustomForm> 
    </section>
    </>
  )
}
