import { useSession } from "next-auth/react";
import UsuarioForm from "@/components/UsuarioForm";
import UserForm from "@/components/UserForm";

export default function UserCreateWrapper({ onSubmit, isLoading }) {
  const { data: session } = useSession();

  if (!session) return <div>Carregando...</div>;

  // Superadmin vê UserForm completo (com seleção de empresa)
  if (session.user.role === "superadmin") {
    return <UserForm showEmpresaSelect={true} onSubmit={onSubmit} isLoading={isLoading} />;
  }

  // Admin vê UserForm com empresa automática (sem seleção)
  return <UserForm 
    autoEmpresaId={session.user.empresaId} 
    showEmpresaSelect={false} 
    onSubmit={onSubmit}
    isLoading={isLoading}
  />;
}
