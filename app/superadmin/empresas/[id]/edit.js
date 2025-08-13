import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarEmpresaPage({ params }) {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/empresas/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setEmpresa(data.empresa);
        setLoading(false);
      });
  }, [params.id]);

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const nome = form.nome.value;
    const email = form.email.value;
    fetch(`/api/empresas/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    })
      .then(res => {
        if (res.ok) {
          alert('Empresa atualizada com sucesso!');
          router.push('/superadmin/empresas');
        } else {
          alert('Erro ao atualizar empresa.');
        }
      });
  };

  if (loading) return <p>Carregando...</p>;
  if (!empresa) return <p>Empresa não encontrada.</p>;

  return (
    <form onSubmit={handleSave} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Empresa</h2>
      <input className="border p-2 w-full mb-4" name="nome" defaultValue={empresa.nome} required />
      <input className="border p-2 w-full mb-4" name="email" defaultValue={empresa.email} required />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Salvar</button>
    </form>
  );
}
