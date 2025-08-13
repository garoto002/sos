import UsuarioEditForm from "@/components/UsuarioEditForm";

export default function UsuarioEditPage({ params }) {
  return <UsuarioEditForm empresaId={params.id} usuarioId={params.uid} />;
}
