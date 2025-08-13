import EmpresaDetails from "@/components/EmpresaDetails";

export default function EmpresaDetailsPage({ params }) {
  return <EmpresaDetails empresaId={params.id} />;
}
