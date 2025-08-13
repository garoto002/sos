import React, { useState, useEffect } from 'react';

export default function StockAdjustmentForm({ onSubmit, isLoading, stockAdjustment }) {
  const [products, setProducts] = useState([]);
  const [adjustmentItems, setAdjustmentItems] = useState([
    { product: '', quantity: 1, reason: '' },
  ]);

  const handleProductChange = (index, value) => {
    const updatedAdjustmentItems = [...adjustmentItems];
    updatedAdjustmentItems[index] = {
      ...updatedAdjustmentItems[index],
      product: value,
    };
    setAdjustmentItems(updatedAdjustmentItems);
  };

  const handleQuantityChange = (index, value) => {
    const updatedAdjustmentItems = [...adjustmentItems];
    updatedAdjustmentItems[index] = {
      ...updatedAdjustmentItems[index],
      quantity: parseFloat(value) || 1,
    };
    setAdjustmentItems(updatedAdjustmentItems);
  };

  const handleReasonChange = (index, value) => {
    const updatedAdjustmentItems = [...adjustmentItems];
    updatedAdjustmentItems[index] = {
      ...updatedAdjustmentItems[index],
      reason: value,
    };
    setAdjustmentItems(updatedAdjustmentItems);
  };

  const handleAddAdjustment = () => {
    const newAdjustment = { product: '', quantity: 1, reason: '' };
    setAdjustmentItems([...adjustmentItems, newAdjustment]);
  };

  const handleRemoveAdjustment = (index) => {
    const updatedAdjustmentItems = [...adjustmentItems];
    updatedAdjustmentItems.splice(index, 1);
    setAdjustmentItems(updatedAdjustmentItems);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        alert("Ocorreu um erro ao buscar Produtos");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <form className="max-w-full" onSubmit={onSubmit}>
      {/* Seção de Produtos */}
      {adjustmentItems.map((adjustmentItem, index) => (
        <div key={index} className="flex gap-4">
          <div className="form-group">
            <label htmlFor={`product${index}`}>Produto</label>
            <select
              name={`product${index}`}
              id={`product${index}`}
              required
              defaultValue={adjustmentItem?.product || ''}
              onChange={(e) => handleProductChange(index, e.target.value)}
            >
              <option value="" disabled hidden>
                Selecione o produto
              </option>
              {products.map((product) => (
                <option key={product._id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={`quantity${index}`}>Quantidade</label>
            <input
              type="number"
              name={`quantity${index}`}
              id={`quantity${index}`}
              required
              value={adjustmentItem.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`reason${index}`}>Motivo</label>
            <input
              type="text"
              name={`reason${index}`}
              id={`reason${index}`}
              required
              value={adjustmentItem.reason}
              onChange={(e) => handleReasonChange(index, e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => handleRemoveAdjustment(index)}
          >
            Remover Ajuste
          </button>
        </div>
      ))}

      {/* Botão Adicionar Ajuste */}
      <button type="button" onClick={handleAddAdjustment}>
        Adicionar Ajuste
      </button>

      {/* Botão de Submissão */}
      <button
        disabled={isLoading}
        className="bg-sky-500 hover:bg-sky-600 transition-all p-2 text-white disabled:bg-zinc-500 w-full"
        type="submit"
      >
        {stockAdjustment ? "Salvar Alterações" : "Realizar Ajuste de Estoque"}
      </button>
    </form>
  );
}
