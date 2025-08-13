import UsuarioDetails from "@/components/UsuarioDetails";

export default function UsuarioDetailsPage({ params }) {
  return <UsuarioDetails empresaId={params.id} usuarioId={params.uid} />;
}
