"use client";
import PageHeader from '@/components/PageHeader';
import UserForm from '@/components/UserForm';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from '@mui/material';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
  const [user, setUser]  = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const params = useParams(); 
  const router =useRouter();

  useEffect(() => {
    setIsLoadingUser (true);
    fetch("/api/users/"+ params.email)
    .then((res) =>res.json())
    .then((data) => {
      console.log(data);
      setUser(data.user);
      setIsLoadingUser(false);
    })
    .catch((err) => {
      alert("Ocorreu um erro buscando os usuários ");
      setIsLoadingUser(false);
      console.log(err);
    });
    },[]); 
    
    const handleUpdateUser = (e) => {
      e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);

        const userData = {};
        for (const[key, value] of formData.entries()){
            userData[key]=value;
        }

        fetch ("/api/users/" + params.email, {
            method: "PATCH",
            body: JSON.stringify(userData),
        })
        .then((res) =>{
            if(!res.ok){
                throw new Error (
                  "Ocorreu um erro alterando o usuário com o email " + params.email
                  );
            } else {
                return res.json();
            }
        })
        .then ((data)=>{
            alert("Usuário " + userData.email + "alterado com sucesso");
            setIsLoading(false);
            router.push("/users");
        })
        .catch((err)=>{ 
            alert (
              "Ocorreu um erro alterando o usuário com o email " + params.email
              );
            setIsLoading(false);
        });
    }
  return (
    <Container maxWidth="sm">
        <PageHeader title="Editar e Visualizar Utilizador">
          Aqui você pode visualizar e editar um utilizador registado no sistema.        
        </PageHeader>
        
        {user && (
          <UserForm 
          user={user} 
          onSubmit={handleUpdateUser} 
          isLoading={isLoading}
          
          />
        )}
        {isLoadingUser && (
      <p className='mt-16 text-center'>
        <FontAwesomeIcon icon={faCircleNotch} className='animate-spin w-6'></FontAwesomeIcon>
      </p>
        )}
    </Container>
  
  )}