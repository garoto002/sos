"use client";

import PageHeader from "@/components/PageHeader";
import StockAdjustmentForm from "@/components/StockAdjustmentForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddStockAdjustment = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);

    const stockAdjustmentData = {
      description: formData.get('description'),
      adjustmentType: formData.get('adjustmentType'),
      adjustmentItems: [],
    };

    // Iterate through form data to construct adjustmentItems array
    formData.forEach((value, key) => {
      if (key.startsWith('product')) {
        const index = key.match(/\d+/)[0];
        const quantity = formData.get(`quantity${index}`);
        const reason = formData.get(`reason${index}`);

        stockAdjustmentData.adjustmentItems.push({
          product: value,
          quantity,
          reason,
        });
      }
    });

    fetch("/api/stock-adjustments", {
      method: "POST",
      body: JSON.stringify(stockAdjustmentData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ocorreu um erro criando o ajuste de estoque");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        alert("Ajuste de estoque criado com sucesso");
        setIsLoading(false);
        router.push("/stock-adjustments");
      })
      .catch((err) => {
        alert("Ocorreu um erro criando o ajuste de estoque");
        setIsLoading(false);
      });
  };

  return (
    <>
      <PageHeader title="Criar novo ajuste de estoque">
        Aqui você pode criar um novo ajuste de estoque
      </PageHeader>

      <section className="mt-8">
        <StockAdjustmentForm onSubmit={handleAddStockAdjustment} isLoading={isLoading} />
      </section>
    </>
  );
}
