"use client";

import PageHeader from "@/components/PageHeader";
import SaleWizard from "@/components/SaleWizard";
import { Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateSalePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleAddSale = async (saleData) => {
    setIsLoading(true);

    try {
      // Validações
      if (!saleData.customName) {
        throw new Error("Por favor, selecione um cliente");
      }

      if (!saleData.items || saleData.items.length === 0) {
        throw new Error("Por favor, adicione pelo menos um produto");
      }

      // Verificar se todos os produtos estão preenchidos
      const incompleteProducts = saleData.items.some(
        (item) => !item.product || item.quantity <= 0
      );

      if (incompleteProducts) {
        throw new Error("Por favor, preencha todos os produtos corretamente");
      }

      // Enviar dados para a API
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = 
          errorData.message || 
          `Ocorreu um erro ao efetuar a venda para ${saleData.customName}`;
        throw new Error(errorMessage);
      }

      // Sucesso - retorna o ID da venda gerada
      const responseData = await response.json();
      console.log('Resposta da API de vendas:', responseData);
      
      // A API retorna o objeto sale diretamente
      const saleId = responseData._id || responseData.sale?._id || responseData.saleId;
      console.log('ID da venda extraído:', saleId);
      
      if (!saleId) {
        console.warn('ID da venda não encontrado na resposta:', responseData);
        throw new Error('ID da venda não foi retornado pela API');
      }
      
      return Promise.resolve({ saleId });

    } catch (err) {
      console.error("Erro ao processar venda:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <PageHeader title="Registar uma nova venda">
        Adicione as informações da venda
      </PageHeader>
      
      <SaleWizard onSubmit={handleAddSale} isLoading={isLoading} />
      
      {error && (
        <div 
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px',
            color: '#c62828'
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>❌ Erro: {error}</p>
          <button 
            onClick={() => setError(null)}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      )}
    </Container>
  );
}