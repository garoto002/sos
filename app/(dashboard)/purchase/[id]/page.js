"use client";
import PageHeader from '@/components/PageHeader'
import PurchaseForm from '@/components/PurchaseForm'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
    const [purchase, setSale]  = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);
  const params = useParams(); 
  const router =useRouter();

  const formatNumbers = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    });
  };


  useEffect (() => {
    setIsLoadingPurchase (true);
    fetch("/api/purchases/"+ params.id)
    .then((res) =>res.json())
    .then((data) => {
      setPurchase(data.purchase);
      setIsLoadingPurchase(false);
    })
    .catch((err) => {
      alert("Ocorreu um erro ao buscar Compras ");
      setIsLoadingPurchase(false);
      console.log(err);
    });
    },[]); 

    const handleUpdatePurchase = (e) => {
        e.preventDefault();
          setIsLoading(true);
          const formData = new FormData(e.target);
  
          const purchaseData = {};
          for (const[key, value] of formData.entries()){
              purchaseData[key]=value;
          }
  
          fetch ("/api/purchases/" + params.id, {
              method: "PATCH",
              body: JSON.stringify(purchaseData),
          }).then((res) =>{
              if(!res.ok){
                  throw new Error ("Ocorreu um erro alterando a compra" +params.id);
              } else {
                  return res.json();
              }
          })
          .then ((data)=>{
              alert("Compra com nome:  " +purchaseData.name + "alterado com sucesso");
              setIsLoading(false);
              router.push("/purchases");
          }).catch((err)=>{ 
              alert ("Ocorreu um erro alterando a venda com o id" + params.id);
              setIsLoading(false);
          });
      }


  return (
    <>
    <PageHeader title="Editar e Visualizar Lista de Compras">
    Aqui voce vai Editar e visualizar as vendas registadas no sistema 
    </PageHeader>


    
        {purchase && 
        (<section className='mt-8 flex gap-4'>
            <PurchaseForm purchase={purchase} onSubmit={handleUpdatePurchase} isLoading={isLoading}></PurchaseForm>
       
        <div>
            <ul>
                 <li>
                    <b>Custo total (Mzn): </b>
                    {formatNumbers(purchase.totalCost)}
                </li>
                <li>
                    <b>Adicionado por: </b>
                    {purchase.user?.firstName + "" + purchase.user?.lastName}
                </li>
                <li>
                    <b>Email do usuario: </b>
                    {sale.user?.email}
                </li>
                <li>
                    <b>Criado em: </b>
                    {sale.user?.createdAt.split("T")[0]}
                </li>
                <li>
                    <b>Alterado em: </b>
                    {sale.user?.updatedAt.split("T")[0]}
                </li>
            </ul>
        </div>
        </section>
        )}
    {isLoadingSale && (
      <p className='mt-16 text-center'>
        <FontAwesomeIcon icon={faCircleNotch} className='animate-spin'></FontAwesomeIcon>
  
      </p>
        )}
    </>
  );
}
  