"use client";

import PageHeader from "@/components/PageHeader";
import ProductForm from "@/components/ProductForm";
import { Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function page() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleAddProduct = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.target);
        // Adiciona empresaId e user do session
        if (session?.user?.empresaId) {
            formData.append("empresaId", session.user.empresaId);
        }
        if (session?.user?.id) {
            formData.append("user", session.user.id);
        } else if (session?.user?.email) {
            formData.append("user", session.user.email);
        }
        fetch("/api/products", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Ocorreu um erro criando o produto");
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                alert("Produto criado com sucesso");
                setIsLoading(false);
                router.push("/products");
            })
            .catch((err) => {
                alert("Ocorreu um erro criando o produto");
                setIsLoading(false);
            });
    };
    return (
        <Container maxWidth="sm">
            <PageHeader title="Criar novo produto  ">
                Preencher Informações do produto 
            </PageHeader>
            <ProductForm 
                onSubmit={handleAddProduct} 
                isLoading={isLoading}
            />
        </Container>
    );
}
