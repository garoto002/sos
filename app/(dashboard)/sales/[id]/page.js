"use client";
import PageHeader from '@/components/PageHeader'
import SaleForm from '@/components/SaleForm'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function SaleDetailsPage() {
    const [sale, setSale]  = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSale, setIsLoadingSale] = useState(false);
  const params = useParams(); 
  const router =useRouter();

  const formatNumbers = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    });
  };


  useEffect (() => {
    setIsLoadingSale (true);
    fetch("/api/sales/"+ params.id)
    .then((res) =>res.json())
    .then((data) => {
      setSale(data.sale);
      setIsLoadingSale(false);
    })
    .catch((err) => {
      alert("Ocorreu um erro ao buscar vendas ");
      setIsLoadingSale(false);
      console.log(err);
    });
    },[]); 

    const handleUpdateSale = (e) => {
        e.preventDefault();
          setIsLoading(true);
          const formData = new FormData(e.target);
  
          const saleData = {};
          for (const[key, value] of formData.entries()){
              saleData[key]=value;
          }
  
          fetch ("/api/sales/" + params.id, {
              method: "PATCH",
              body: JSON.stringify(saleData),
          }).then((res) =>{
              if(!res.ok){
                  throw new Error ("Ocorreu um erro alterando a Venda" +params.id);
              } else {
                  return res.json();
              }
          })
          .then ((data)=>{
              alert("Venda com nome:  " +saleData.name + "alterado com sucesso");
              setIsLoading(false);
              router.push("/sales");
          }).catch((err)=>{ 
              alert ("Ocorreu um erro alterando a venda com o id" + params.id);
              setIsLoading(false);
          });
      }


  return (
    <>
    <PageHeader title="Editar e Visualizar Venda">
    Aqui você pode editar e visualizar as vendas registadas no sistema 
    </PageHeader>


    
        {sale && 
        (<section className='mt-8 flex gap-4'>
            <SaleForm sale={sale} onSubmit={handleUpdateSale} isLoading={isLoading}></SaleForm>
       
        <div>
            <ul>
                 <li>
                    <b>Subtotal (MZN): </b>
                    {formatNumbers(sale.subtotal)}
                </li>
                <li>
                    <b>Desconto (MZN): </b>
                    {formatNumbers(sale.discount)}
                </li>
                <li>
                    <b>Total IVA (MZN): </b>
                    {formatNumbers(sale.totalIva)}
                </li>
                <li>
                    <b>Total Final (MZN): </b>
                    {formatNumbers(sale.totalAfterDiscount)}
                </li>
                <li>
                    <b>Valor Recebido (MZN): </b>
                    {formatNumbers(sale.receivedAmount)}
                </li>
                <li>
                    <b>Troco (MZN): </b>
                    {formatNumbers(sale.change)}
                </li>
                <li>
                    <b>Data da Venda: </b>
                    {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('pt-PT') : 'N/A'}
                </li>
                <li>
                    <b>Última Atualização: </b>
                    {sale.updatedAt ? new Date(sale.updatedAt).toLocaleDateString('pt-PT') : 'N/A'}
                </li>
                <li>
                    <b>Adicionado por: </b>
                    {(sale.user?.firstName || '') + " " + (sale.user?.lastName || '')}
                </li>
                <li>
                    <b>Email do usuario: </b>
                    {sale.user?.email || 'N/A'}
                </li>
                <li>
                    <b>Criado em: </b>
                    {sale.user?.createdAt ? sale.user.createdAt.split("T")[0] : 'N/A'}
                </li>
                <li>
                    <b>Alterado em: </b>
                    {sale.user?.updatedAt ? sale.user.updatedAt.split("T")[0] : 'N/A'}
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
  