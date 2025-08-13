"use client";
import PageHeader from "@/components/PageHeader";
import UserCreateWrapper from "@/components/UserCreateWrapper";
import { Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";


export default function page() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleCreateUser = ({ userData }) => {
        setIsLoading(true);
        
        // Se for admin, adiciona automaticamente a empresaId da sessão
        if (session?.user?.role === "admin" && session?.user?.empresaId) {
            userData.empresaId = session.user.empresaId;
        }
        
        fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Ocorreu um erro criando usuário!");
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                alert("Usuário " + userData.email + " criado com sucesso");
                setIsLoading(false);
                router.push("/users");
            })
            .catch((err) => {
                alert("Ocorreu um erro criando o usuário " + userData.email);
                setIsLoading(false);
            });
    };
    return (
        <Container maxWidth="sm">
            <PageHeader title="Criar Novo Usuário ">
                Aqui você pode criar um novo usuário.
            </PageHeader>
            <UserCreateWrapper onSubmit={handleCreateUser} isLoading={isLoading} />
        </Container>
    );
}
