"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductViewPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    setIsLoading(true);
    Promise.all([
      fetch(`/api/products/${params.id}`).then(res => res.json()),
      fetch(`/api/sales`).then(res => res.json())
    ])
      .then(([productData, salesData]) => {
        setProduct(productData.product || null);
        // Filtra vendas deste produto
        const productSales = (salesData.sales || []).filter(sale =>
          sale.products && sale.products.some(item => item.product === (productData.product?.name || ''))
        );
        setSales(productSales);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params?.id]);

  if (isLoading) return <div className="text-center mt-16">Carregando detalhes...</div>;
  if (!product) return <div className="text-center mt-16 text-red-500">Produto não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 max-w-2xl w-full flex flex-col md:flex-row gap-10 items-center border-2 border-indigo-100">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <img src={product.imageUrl || '/images/logo-sistema-empresarial.png'} alt={product.name} className="max-h-52 max-w-full object-contain rounded-xl border-4 border-indigo-300 bg-white mb-3 shadow" />
          <span className={`px-4 py-1 rounded-full text-xs font-bold mt-2 shadow ${product.quantityInStock < (product.stockMinimum || 1) ? 'bg-red-200 text-red-800 border border-red-300' : 'bg-green-200 text-green-800 border border-green-300'}`}>{product.quantityInStock < (product.stockMinimum || 1) ? 'Estoque Baixo' : 'Estoque OK'}</span>
        </div>
        <div className="flex-1 w-full">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 tracking-tight drop-shadow">{product.name}</h1>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold shadow">Categoria: {product.category || '-'}</span>
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow">Marca: {product.brand || '-'}</span>
          </div>
          <div className="mb-4 flex items-center gap-4">
            <span className="text-2xl font-extrabold text-green-600 drop-shadow">{product.price} MT</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow">Estoque: {product.quantityInStock}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <span className="block text-gray-400 text-xs">Custo Unitário</span>
              <span className="block font-semibold text-gray-700">{product.cost} MT</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <span className="block text-gray-400 text-xs">Custo Total</span>
              <span className="block font-semibold text-gray-700">{product.totalCost} MT</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <span className="block text-gray-400 text-xs">Preço Total</span>
              <span className="block font-semibold text-gray-700">{product.totalPrice}</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <span className="block text-gray-400 text-xs">Estoque Mínimo</span>
              <span className="block font-semibold text-gray-700">{product.stockMinimum}</span>
            </div>
          </div>
          {product.description && (
            <div className="w-full mb-4">
              <span className="block text-gray-400 text-xs mb-1">Descrição</span>
              <div className="text-gray-700 text-sm bg-indigo-100 rounded-lg p-3 border border-indigo-200 shadow-inner">{product.description}</div>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => window.open(`/api/products/${product._id}/pdf`, '_blank')}
              className="bg-gradient-to-r from-indigo-400 to-blue-400 hover:from-indigo-500 hover:to-blue-500 text-white px-5 py-2 rounded-lg shadow font-bold transition"
            >
              Baixar PDF
            </button>
            <Link href="/products" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-5 py-2 rounded-lg shadow font-bold transition">Voltar</Link>
          </div>
        </div>
      </div>
      {/* Histórico de vendas do produto */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full mt-8 border-2 border-indigo-100">
        <h2 className="text-lg font-extrabold text-indigo-700 mb-4 flex items-center gap-2">
          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h2l1 2h13a1 1 0 01.97 1.243l-1.5 6A1 1 0 0117.5 20h-11a1 1 0 01-.97-.757L3 10zm5 8a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z' /></svg>
          Histórico de Vendas
        </h2>
        {sales.length === 0 ? (
          <div className="text-gray-500">Nenhuma venda registrada para este produto.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-200 to-blue-100 text-indigo-900">
                  <th className="p-3 text-left font-bold">Data</th>
                  <th className="p-3 text-left font-bold">Quantidade</th>
                  <th className="p-3 text-left font-bold">Valor</th>
                  <th className="p-3 text-left font-bold">Vendido por</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, idx) => {
                  const item = sale.products.find(i => i.product === product.name);
                  return (
                    <tr key={sale._id} className={idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                      <td className="p-3 text-gray-700 flex items-center gap-2">
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h2l1 2h13' /></svg>
                          {item?.quantity}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7' /></svg>
                          {item?.price || sale.subtotal} MT
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 flex items-center gap-2">
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-indigo-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
                        {sale.user?.name || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
