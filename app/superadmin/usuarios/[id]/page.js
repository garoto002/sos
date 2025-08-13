import UsuarioDetails from '@/components/UsuarioDetails';

export default function UsuarioDetailsPage({ params }) {
  return <UsuarioDetails usuarioId={params.id} />;
}
