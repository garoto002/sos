"use client";
import { useSession } from "next-auth/react";
import UsuarioForm from "@/components/UsuarioForm";

export default function CriarUsuarioPage() {
  const { data: session } = useSession();
  if (!session) return <div>Carregando...</div>;
  return <UsuarioForm empresaId={session.user.empresaId} />;
}
