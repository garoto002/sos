"use client";

import PageHeader from "@/components/PageHeader";
import PurchaseForm from "@/components/PurchaseForm";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const handleAddPurchase = async () => {
    // This function is called after successful form submission
    // The PurchaseForm component handles the API call internally
    router.push("/purchase");
  };

  return (
    <>
      <PageHeader title="Registar Entrada de Mercadoria(s)">
        Adicionar informacoes da nova compra de mercadorias
      </PageHeader>
      
      <section className="mt-8">
        <PurchaseForm onSubmit={handleAddPurchase} />
      </section>
    </>
  );
}
