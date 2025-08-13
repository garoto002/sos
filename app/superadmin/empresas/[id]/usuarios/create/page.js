import UsuarioForm from "@/components/UsuarioForm";

export default function NovoUsuarioPage({ params }) {
  return <UsuarioForm empresaId={params.id} />;
}
