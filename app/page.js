"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CadastroPessoaModal from "../components/CadastroPessoaModal";
import PessoaMapa from "../components/PessoaMapa";
import PessoaComentarios from "../components/PessoaComentarios";

export default function Home() {
  const [pessoas, setPessoas] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("");
  const [mapaOpen, setMapaOpen] = useState(false);

  // Estado para modal de zoom da foto
  const [zoomOpen, setZoomOpen] = useState(false);
  // Estado para modal de relatos
  const [relatosOpen, setRelatosOpen] = useState(false);
  // Estado para mostrar ícones mobile
  const [showMobileIcons, setShowMobileIcons] = useState(false);
  // Estado para card ativo no mobile
  const [activeCard, setActiveCard] = useState(null);
  // Estado para controle do carrossel
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchPessoas() {
      setLoading(true);
      try {
        const res = await fetch("/api/pessoas");
        const data = await res.json();
        setPessoas(data.pessoas || []);
      } catch {
        setPessoas([]);
      }
      setLoading(false);
    }
    fetchPessoas();
  }, []);

  useEffect(() => {
    if (!pessoas.length || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % pessoas.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [pessoas, isPaused]);

  // Incrementa visualizações quando uma pessoa é exibida
  useEffect(() => {
    const incrementarVisualizacao = async () => {
      if (pessoa && pessoa._id) {
        try {
          await fetch(`/api/pessoas/${pessoa._id}/visualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Erro ao incrementar visualização:', error);
        }
      }
    };

    // Delay para evitar muitas requisições rápidas
    const timer = setTimeout(incrementarVisualizacao, 1000);
    return () => clearTimeout(timer);
  }, [current, pessoas]);

  // Filtragem das pessoas
  let pessoasFiltradas = pessoas;
  if (busca) {
    pessoasFiltradas = pessoasFiltradas.filter(p => p.nome && p.nome.toLowerCase().includes(busca.toLowerCase()));
  }
  if (filtroStatus) {
    pessoasFiltradas = pessoasFiltradas.filter(p => p.status === filtroStatus);
  }
  if (filtroLocal) {
    pessoasFiltradas = pessoasFiltradas.filter(p => (p.ultimoLocal || "").toLowerCase().includes(filtroLocal.toLowerCase()));
  }
  const pessoa = pessoasFiltradas.length ? pessoasFiltradas[current % pessoasFiltradas.length] : null;

  // Funções de navegação do carrossel
  const prev = () => {
    if (!pessoas.length) return;
    setCurrent((c) => (c - 1 + pessoas.length) % pessoas.length);
  };
  const next = () => {
    if (!pessoas.length) return;
    setCurrent((c) => (c + 1) % pessoas.length);
  };

  // Função para adicionar nova pessoa cadastrada ao início da lista
  const handleCadastrado = (novaPessoa) => {
    setPessoas((prev) => [novaPessoa, ...prev]);
    setCurrent(0);
  };

  return (
    <main className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header moderno com glassmorphism - melhorado para mobile */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-black/30 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl lg:rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-lg lg:text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Sistema SOS
              </h1>
              <p className="text-white/60 text-xs lg:text-sm hidden lg:block">Pessoas Perdidas & Achadas</p>
            </div>
          </div>
          
          {/* Contador discreto no header - desktop */}
          <div className="hidden lg:flex items-center gap-4 text-white/70 text-sm">
            <div className="flex items-center gap-1">
              <span>📊</span>
              <span>{pessoas.length}</span>
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <span>🚨</span>
              <span>{pessoas.filter(p => p.status === "perdido").length}</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <span>✅</span>
              <span>{pessoas.filter(p => p.status === "achado").length}</span>
            </div>
          </div>
          
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 lg:px-8 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl lg:rounded-full font-bold text-sm lg:text-lg shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <span className="lg:hidden">+</span>
            <span className="hidden lg:inline">⚡ Reportar Pessoa</span>
          </button>
        </div>
      </div>

      {/* Container principal com 3 colunas no desktop */}
      <div className="h-full flex flex-col lg:flex-row pt-16 lg:pt-20 lg:gap-4">
        
        {/* Lateral esquerda - controles e navegação */}
        <div className="hidden lg:block lg:w-64 bg-black/30 backdrop-blur-xl p-6">
          <div className="text-white space-y-6">
            
            {/* Navegação entre pessoas */}
            {pessoa && (
              <div>
                <h3 className="text-lg font-bold mb-4">🔄 Navegação</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrent(current > 0 ? current - 1 : pessoasFiltradas.length - 1)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl p-3 transition-all duration-300"
                  >
                    <span className="text-xl">⬅️</span>
                    <span className="font-semibold">Anterior</span>
                  </button>
                  
                  {/* Botão Pause/Play */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`w-full flex items-center justify-center gap-2 border rounded-xl p-3 transition-all duration-300 ${
                      isPaused 
                        ? 'bg-green-600/20 hover:bg-green-600/30 border-green-500/30' 
                        : 'bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/30'
                    }`}
                  >
                    <span className="text-xl">{isPaused ? '▶️' : '⏸️'}</span>
                    <span className="font-semibold">{isPaused ? 'Play' : 'Pause'}</span>
                  </button>
                  
                  <div className="text-center text-sm text-white/70 py-2">
                    {current + 1} de {pessoasFiltradas.length}
                  </div>
                  <button
                    onClick={() => setCurrent(current < pessoasFiltradas.length - 1 ? current + 1 : 0)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl p-3 transition-all duration-300"
                  >
                    <span className="font-semibold">Próximo</span>
                    <span className="text-xl">➡️</span>
                  </button>
                </div>
              </div>
            )}

            {/* Ações rápidas */}
            {pessoa && (
              <div>
                <h3 className="text-lg font-bold mb-4">🔧 Ações</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setMapaOpen(true)}
                    className="w-full flex items-center gap-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl p-3 transition-all duration-300"
                  >
                    <span className="text-xl">🗺️</span>
                    <span className="font-semibold">Ver Mapa</span>
                  </button>
                  <button
                    onClick={() => setRelatosOpen(true)}
                    className="w-full flex items-center gap-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl p-3 transition-all duration-300"
                  >
                    <span className="text-xl">💬</span>
                    <span className="font-semibold">Comentários</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Foto central - ocupa espaço completo entre as laterais */}
        <div className="flex-1 relative h-[60vh] lg:h-full overflow-hidden bg-black"
             onClick={() => setShowMobileIcons(!showMobileIcons)}>
          {loading ? (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-base lg:text-2xl font-bold text-white">Carregando pessoas...</p>
              </div>
            </div>
          ) : pessoa ? (
            <>
              <img
                src={pessoa.foto || "/images/default-user.png"}
                alt={pessoa.nome}
                className="w-full h-full cursor-pointer lg:cursor-zoom-in object-cover"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Clique na imagem detectado, largura da tela:', window.innerWidth);
                  setZoomOpen(true);
                }}
              />

              {/* Badge discreto de visualizações - bem pequeno */}
              <div className="absolute bottom-2 right-2 z-10">
                <div className="bg-black/40 backdrop-blur-sm text-white/70 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <span>👀</span>
                  <span>{pessoa.visualizacoes || 0}</span>
                </div>
              </div>
              
              {/* Nome e status no mobile */}
              <div className="lg:hidden absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-black/30 backdrop-blur-sm p-3 rounded-2xl">
                  <h1 className="text-2xl font-black text-white drop-shadow-2xl leading-tight text-center mb-2">
                    {pessoa.nome}
                  </h1>
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pessoa.status === "perdido" 
                        ? "bg-red-600 text-white" 
                        : "bg-green-600 text-white"
                    }`}>
                      {pessoa.status === "perdido" ? "🚨 PERDIDO" : "✅ ENCONTRADO"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controles discretos no mobile - três pontos e pause/play */}
              {!showMobileIcons && (
                <div className="lg:hidden absolute top-4 right-4 z-10 flex gap-2">
                  {/* Botão Pause/Play */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaused(!isPaused);
                    }}
                    className={`p-2 rounded-full backdrop-blur-sm ${
                      isPaused 
                        ? 'bg-green-500/70' 
                        : 'bg-yellow-500/70'
                    }`}
                  >
                    <span className="text-white text-sm">{isPaused ? '▶️' : '⏸️'}</span>
                  </button>
                  
                  {/* Três pontos para opções */}
                  <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full">
                    <span className="text-white text-lg">⋯</span>
                  </div>
                </div>
              )}

              {/* Ícones mobile que aparecem ao tocar */}
              {showMobileIcons && (
                <div className="absolute inset-0 flex items-center justify-center lg:hidden bg-black/40 backdrop-blur-md animate-fadeIn">
                  <div className="grid grid-cols-2 gap-6 p-8">
                    {/* Linha superior */}
                    {/* Nome/Detalhes */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.1s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setActiveCard('nome')}
                      >
                        <span className="text-white text-3xl">👤</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Detalhes</span>
                    </div>

                    {/* Aparência */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.2s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setActiveCard('aparencia')}
                      >
                        <span className="text-white text-3xl">👕</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Aparência</span>
                    </div>

                    {/* Local/Mapa */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.3s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setMapaOpen(true)}
                      >
                        <span className="text-white text-3xl">📍</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Mapa</span>
                    </div>

                    {/* Pause/Play */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.4s'}}>
                      <button 
                        className={`w-20 h-20 bg-gradient-to-br rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow ${
                          isPaused 
                            ? 'from-green-500 to-green-700' 
                            : 'from-yellow-500 to-yellow-700'
                        }`}
                        onClick={() => setIsPaused(!isPaused)}
                      >
                        <span className="text-white text-3xl">{isPaused ? '▶️' : '⏸️'}</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">{isPaused ? 'Play' : 'Pause'}</span>
                    </div>

                    {/* Relatos */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.5s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setRelatosOpen(true)}
                      >
                        <span className="text-white text-3xl">💬</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Relatos</span>
                    </div>

                    {/* Fechar */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.6s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setShowMobileIcons(false)}
                      >
                        <span className="text-white text-3xl">✖</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Fechar</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <h2 className="text-lg font-bold text-white">Nenhuma pessoa cadastrada</h2>
                <p className="text-xs text-white/60">Seja o primeiro a reportar</p>
              </div>
            </div>
          )}
        </div>

        {/* Lateral direita com informações da pessoa */}
        <div className="w-full lg:w-80 bg-black/40 backdrop-blur-xl p-4 md:p-6 flex flex-col">
          {/* Filtros para mobile */}
          <div className="mb-4 lg:hidden">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="🔍 Buscar nome..."
                value={busca}
                onChange={e => { setBusca(e.target.value); setCurrent(0); }}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base font-medium"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filtroStatus}
                  onChange={e => { setFiltroStatus(e.target.value); setCurrent(0); }}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white focus:outline-none text-base font-medium"
                >
                  <option value="" className="bg-slate-800">📋 Todos</option>
                  <option value="perdido" className="bg-slate-800">🚨 Perdido</option>
                  <option value="achado" className="bg-slate-800">✅ Achado</option>
                </select>
                <input
                  type="text"
                  placeholder="📍 Local..."
                  value={filtroLocal}
                  onChange={e => { setFiltroLocal(e.target.value); setCurrent(0); }}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none text-base font-medium"
                />
              </div>
            </div>
          </div>

          {/* Filtros compactos - desktop */}
          <div className="mb-6 hidden lg:block">
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="🔍 Buscar nome..."
                value={busca}
                onChange={e => { setBusca(e.target.value); setCurrent(0); }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filtroStatus}
                  onChange={e => { setFiltroStatus(e.target.value); setCurrent(0); }}
                  className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white focus:outline-none text-sm"
                >
                  <option value="" className="bg-slate-800">Todos</option>
                  <option value="perdido" className="bg-slate-800">Perdido</option>
                  <option value="achado" className="bg-slate-800">Achado</option>
                </select>
                <input
                  type="text"
                  placeholder="📍 Local..."
                  value={filtroLocal}
                  onChange={e => { setFiltroLocal(e.target.value); setCurrent(0); }}
                  className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white placeholder-white/60 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Cards mobile que aparecem ao tocar ícones */}
          {activeCard && pessoa && (
            <div className="lg:hidden mb-6">
              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/30 shadow-2xl mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-black text-xl flex items-center gap-3">
                    {activeCard === 'nome' && (
                      <>
                        <span className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center">👤</span>
                        <span>Detalhes</span>
                      </>
                    )}
                    {activeCard === 'aparencia' && (
                      <>
                        <span className="w-10 h-10 bg-purple-500/20 rounded-2xl flex items-center justify-center">�</span>
                        <span>Aparência</span>
                      </>
                    )}
                    {activeCard === 'descricao' && (
                      <>
                        <span className="w-10 h-10 bg-purple-500/20 rounded-2xl flex items-center justify-center">📝</span>
                        <span>Informações</span>
                      </>
                    )}
                    {activeCard === 'contato' && (
                      <>
                        <span className="w-10 h-10 bg-green-500/20 rounded-2xl flex items-center justify-center">📞</span>
                        <span>Contato</span>
                      </>
                    )}
                  </h3>
                  <button 
                    onClick={() => setActiveCard(null)}
                    className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center text-white text-xl hover:bg-red-500/30 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>
                
                {activeCard === 'nome' && (
                  <div className="text-white space-y-4">
                    <div>
                      <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {pessoa.nome}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <p className="text-white/60 text-sm">
                          {pessoa.createdAt ? `Cadastrado em: ${new Date(pessoa.createdAt).toLocaleDateString()}` : ""}
                        </p>
                      </div>
                      {pessoa.ultimoLocal && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-orange-400">📍</span>
                          <p className="text-white/80 text-sm font-medium">{pessoa.ultimoLocal}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeCard === 'aparencia' && (
                  <div className="text-white">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">👕</span>
                        <h4 className="text-lg font-bold">Roupas e Aparência</h4>
                      </div>
                      <p className="text-base leading-relaxed">
                        {pessoa.roupa || "Informações sobre aparência não disponíveis"}
                      </p>
                    </div>
                  </div>
                )}
                
                {activeCard === 'descricao' && (
                  <div className="text-white">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                      <p className="text-lg leading-relaxed">{pessoa.descricao}</p>
                    </div>
                  </div>
                )}
                
                {activeCard === 'contato' && (
                  <div className="text-white">
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-400/20">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">📱</span>
                        <div>
                          <p className="text-2xl font-black text-green-400">{pessoa.contacto}</p>
                          <p className="text-white/60 text-sm mt-1">Toque para ligar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cards de informações - desktop */}
          {pessoa && (
            <div className="flex-1 space-y-4 hidden lg:block">
              {/* Card Principal - Nome e Status */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30">
                <h1 className="text-2xl font-black text-white mb-3">{pessoa.nome}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    pessoa.status === "perdido" 
                      ? "bg-red-600 text-white" 
                      : "bg-green-600 text-white"
                  }`}>
                    {pessoa.status === "perdido" ? "🚨 PERDIDO" : "✅ ENCONTRADO"}
                  </span>
                  <span className="text-white/60 text-sm">
                    📅 {pessoa.createdAt ? new Date(pessoa.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <button
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition"
                  onClick={async () => {
                    const novoStatus = pessoa.status === "perdido" ? "achado" : "perdido";
                    try {
                      const res = await fetch(`/api/pessoas/${pessoa._id}/status`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: novoStatus })
                      });
                      if (res.ok) {
                        setPessoas(prev => prev.map(p => p._id === pessoa._id ? { ...p, status: novoStatus } : p));
                      }
                    } catch {}
                  }}
                >
                  🔄 Alterar Status
                </button>
              </div>

              {/* Card Descrição */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-300 text-lg">📝</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-2">Descrição</h4>
                    <p className="text-white/80 text-sm leading-relaxed">{pessoa.descricao}</p>
                  </div>
                </div>
              </div>

              {/* Card Contato */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-300 text-lg">📞</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-1">Contato</h4>
                    <p className="text-green-300 text-sm font-bold">{pessoa.contacto}</p>
                  </div>
                </div>
              </div>

              {/* Card Local */}
              {pessoa.ultimoLocal && (
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-300 text-lg">📍</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">Último Local</h4>
                      <p className="text-white/80 text-sm leading-relaxed">{pessoa.ultimoLocal}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Aparência */}
              {pessoa.roupa && (
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-300 text-lg">👕</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">Aparência</h4>
                      <p className="text-white/80 text-sm leading-relaxed">{pessoa.roupa}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Informações Adicionais */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-300 text-lg">ℹ️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-2">Informações Adicionais</h4>
                    <div className="space-y-2 text-xs text-white/70">
                      {pessoa.idade && (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-300">🎂</span>
                          <span>Idade: {pessoa.idade} anos</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300">👀</span>
                        <span>Visualizações: {pessoa.visualizacoes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-300">🆔</span>
                        <span>ID: {pessoa._id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Localização vira botão para abrir modal */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-red-500/10 transition" onClick={() => setMapaOpen(true)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-300 text-lg">🗺️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-2">Ver mapa ampliado</h4>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Footer com navegação e contador - apenas mobile */}
          <div className="mt-6 space-y-4 lg:hidden">
            {/* Navegação */}
            <div className="flex gap-4">
              <button 
                onClick={prev} 
                className="flex-1 py-4 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-sm rounded-2xl font-bold text-white border border-white/30 transition-all duration-300 text-base shadow-lg hover:shadow-white/20 transform hover:scale-105"
              >
                ← Anterior
              </button>
              <button 
                onClick={next} 
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-bold text-white transition-all duration-300 text-base shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
              >
                Próximo →
              </button>
            </div>

            {/* Contador */}
            {pessoa && (
              <div className="text-center">
                <span className="text-white/60 text-sm">
                  {current + 1} de {pessoasFiltradas.length} pessoas
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      {/* Modal de relatos */}
      {relatosOpen && pessoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setRelatosOpen(false)}>
          <div className="bg-white/5 rounded-2xl shadow-2xl border border-blue-500/30 p-8 max-w-lg w-full mx-4 relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>💬</span> Relatos e comentários</h2>
            <div className="max-h-80 overflow-y-auto mb-6">
              <PessoaComentarios pessoaId={pessoa._id} />
            </div>
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-blue-600/80 rounded-full px-3 py-1 shadow-lg hover:bg-blue-700"
              onClick={() => setRelatosOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Modal de zoom da imagem - simplificado para teste */}
      {zoomOpen && pessoa && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center" 
          onClick={() => {
            console.log('Fechando modal de zoom');
            setZoomOpen(false);
          }}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img 
              src={pessoa.foto || '/default-avatar.png'} 
              alt={pessoa.nome}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-red-600/80 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
              onClick={() => {
                console.log('Botão fechar clicado');
                setZoomOpen(false);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal do mapa */}
      {mapaOpen && pessoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setMapaOpen(false)}>
          <div className="bg-white/5 rounded-2xl shadow-2xl border border-red-500/30 p-6 max-w-4xl w-full h-[80vh] mx-4 relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>🗺️</span> Localização no Mapa</h2>
            <div className="h-full">
              <PessoaMapa pessoa={pessoa} />
            </div>
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-red-600/80 rounded-full px-3 py-1 shadow-lg hover:bg-red-700"
              onClick={() => setMapaOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Modal de cadastro - mantém o componente original */}
      <CadastroPessoaModal open={modalOpen} onClose={() => setModalOpen(false)} onCadastrado={handleCadastrado} />
    </main>
  );
}