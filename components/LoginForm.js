"use client";
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {

    const emailRef=useRef(); 
    const passwordRef =useRef();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true); 
        setMessage("");

        signIn("credentials", {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            redirect: false,
        })
        .then((res) => {
            setIsLoading(false);
            
            if(res.error === "CredentialsSignin"){ 
             return setMessage("Email ou palavra-passe errada");
            }else if(res.error){
                return setMessage("ocorreu um erro, tente novamente");
            }
            router.push("/");
        }).catch((err)=> alert("erro"));
    };
  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Entrar no Sistema</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <label htmlFor='email' 
        className='block text-white'>
            Email
        </label>
    <input 
    ref={emailRef}
    type='email' 
    name='email'
     id='email' 
     className='w-full p-2' >
     </input>
    <label htmlFor='password' 
    className='block text-white mt-4'>
        Password
    </label>
    <input 
    type='password' 
    name='password' 
    id='password' 
    className='w-full p-2' 
    ref={passwordRef}>
    </input>
    <button  disabled={isLoading} className='bg-sky-500 hover:bg-sky-600 transition-all p-2 text-white disabled:bg-zinc-500 w-full mt-6'>Entrar</button>
    {message &&  <p className='text-red-500 text-center m-4'>{message}</p>}
    <Link href="/auth/forget-password" className='text-center mt-4 block text-sky-500 hover:underline'>
        Esqueceu a palavra-passe?
    </Link>
      </form>
    </div>
  );
}