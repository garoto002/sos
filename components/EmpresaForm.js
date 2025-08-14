"use client";
import { useState } from "react";
import ImageUploadField from './ImageUploadField';

export default function EmpresaForm({ onSuccess }) {
  const [nome, setNome] = useState("");
  const [nuit, setNuit] = useState("");
  const [alvara, setAlvara] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [bairro, setBairro] = useState("");
  const [avenidaRua, setAvenidaRua] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [empresaId, setEmpresaId] = useState("");

  // Lista de províncias de Moçambique
  const provincias = [
    "Maputo Cidade",
    "Maputo Província",
    "Gaza",
    "Inhambane",
    "Manica",
    "Sofala",
    "Tete",
    "Zambézia",
    "Nampula",
    "Cabo Delgado",
    "Niassa"
  ];

  const validateForm = () => {
    if (!nuit || nuit.length !== 9) {
      setError("NUIT deve ter 9 dígitos");
      return false;
    }
    if (telefone1 && !/^(?:\+258|8[234567]\d{7})$/.test(telefone1)) {
      setError("Número de telefone inválido. Use formato: +258xxxxxxxxx ou 8xxxxxxxxx");
      return false;
    }
    if (telefone2 && !/^(?:\+258|8[234567]\d{7})$/.test(telefone2)) {
      setError("Número de telefone alternativo inválido");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setNome("");
    setNuit("");
    setAlvara("");
    setProvincia("");
    setDistrito("");
    setBairro("");
    setAvenidaRua("");
    setTelefone1("");
    setTelefone2("");
    setEmail("");
    setSuccess(false);
    setError("");
  };

  const handleRemoveImage = async (type) => {
    if (!empresaId) return;
    
    try {
      const response = await fetch(`/api/upload?empresaId=${empresaId}&type=${type}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao remover imagem');
      }

      if (type === 'logo') {
        setLogo(null);
      } else if (type === 'cover') {
        setCoverImage(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nome, 
          nuit, 
          alvara,
          endereco: {
            provincia,
            distrito,
            bairro,
            avenidaRua
          },
          telefone1,
          telefone2,
          email,
          logo,
          coverImage
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao criar empresa");
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      
      // Limpa os campos
      resetForm();
      
      // Redireciona após 1.5 segundos
      setTimeout(() => {
        window.location.href = "/superadmin/empresas";
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Nova Empresa</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna da esquerda - Informações básicas */}
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa*</label>
            <input 
              className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="Nome da empresa" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NUIT (Número Único de Identificação Tributária)*</label>
            <input 
              className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="NUIT (9 dígitos)" 
              value={nuit} 
              onChange={e => setNuit(e.target.value.replace(/\D/g, '').slice(0, 9))} 
              required 
              pattern="[0-9]{9}"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número do Alvará</label>
            <input 
              className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="Número do Alvará" 
              value={alvara} 
              onChange={e => setAlvara(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Província*</label>
              <select 
                className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                value={provincia} 
                onChange={e => setProvincia(e.target.value)}
                required
              >
                <option value="">Selecione a província</option>
                {provincias.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distrito*</label>
              <input 
                className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                placeholder="Distrito" 
                value={distrito} 
                onChange={e => setDistrito(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro*</label>
              <input 
                className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                placeholder="Bairro" 
                value={bairro} 
                onChange={e => setBairro(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avenida/Rua</label>
              <input 
                className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                placeholder="Avenida/Rua" 
                value={avenidaRua} 
                onChange={e => setAvenidaRua(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal*</label>
              <input 
                className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                placeholder="+258 ou 8x xxxxxxx" 
                value={telefone1} 
                onChange={e => setTelefone1(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Alternativo</label>
              <input 
                className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
                placeholder="+258 ou 8x xxxxxxx" 
                value={telefone2} 
                onChange={e => setTelefone2(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input 
              className="border border-blue-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          </div>

          {/* Coluna da direita - Imagens */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Identidade Visual</h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logotipo da Empresa</label>
                  <p className="text-sm text-gray-500 mb-3">Adicione o logotipo da sua empresa. Recomendamos uma imagem quadrada com fundo transparente.</p>
                  <ImageUploadField
                    type="logo"
                    empresaId={empresaId}
                    currentImage={logo}
                    onUploadSuccess={setLogo}
                    onRemove={() => handleRemoveImage('logo')}
                    className="aspect-square max-w-xs mx-auto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa</label>
                  <p className="text-sm text-gray-500 mb-3">Adicione uma imagem de capa para sua empresa. Esta imagem será usada em cabeçalhos e relatórios.</p>
                  <ImageUploadField
                    type="cover"
                    empresaId={empresaId}
                    currentImage={coverImage}
                    onUploadSuccess={setCoverImage}
                    onRemove={() => handleRemoveImage('cover')}
                    className="aspect-video"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button 
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 px-12 rounded-full shadow-lg transition-all duration-300 font-semibold text-lg" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Salvando...</span>
              </span>
            ) : (
              "Salvar Empresa"
            )}
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Empresa criada com sucesso! Redirecionando...</span>
            </div>
          </div>
        )}
      </form>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Salvando empresa...</span>
          </div>
        </div>
      )}
    </div>
  );
}
