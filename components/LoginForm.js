"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [nome, setNome] = useState("");
  const [contacto, setContacto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contacto })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setMessage("Usuário cadastrado/logado com sucesso!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMessage(data.error || "Erro ao cadastrar/logar.");
      }
    } catch (err) {
      setMessage("Erro de conexão.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Entrar ou Cadastrar</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <label htmlFor='nome' className='block text-zinc-800'>Nome</label>
        <input
          type='text'
          name='nome'
          id='nome'
          className='w-full p-2 border border-zinc-300 rounded'
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <label htmlFor='contacto' className='block text-zinc-800 mt-4'>Contacto</label>
        <input
          type='text'
          name='contacto'
          id='contacto'
          className='w-full p-2 border border-zinc-300 rounded'
          value={contacto}
          onChange={e => setContacto(e.target.value)}
          required
        />
        <button disabled={isLoading} className='bg-sky-500 hover:bg-sky-600 transition-all p-2 text-white disabled:bg-zinc-500 w-full mt-6'>Entrar / Cadastrar</button>
        {message && <p className='text-blue-700 text-center m-4'>{message}</p>}
      </form>
    </div>
  );
}