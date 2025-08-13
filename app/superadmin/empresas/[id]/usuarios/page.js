import UsuariosEmpresa from "@/components/UsuariosEmpresa";

export default function UsuariosEmpresaPage({ params }) {
  return <UsuariosEmpresa empresaId={params.id} />;
}
