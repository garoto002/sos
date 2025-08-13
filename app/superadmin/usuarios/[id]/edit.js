import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UsuarioEditForm from '@/components/UsuarioEditForm';

export default function EditarUsuarioPage({ params }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setUsuario(data.user);
        setLoading(false);
      });
  }, [params.id]);

  const handleSave = (dados) => {
    fetch(`/api/users/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(res => {
        if (res.ok) {
          alert('Usuário atualizado com sucesso!');
          router.push('/superadmin/usuarios');
        } else {
          alert('Erro ao atualizar usuário.');
        }
      });
  };

  if (loading) return <p>Carregando...</p>;
  if (!usuario) return <p>Usuário não encontrado.</p>;

  return <UsuarioEditForm usuario={usuario} onSave={handleSave} />;
}
