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
    if (!pessoas.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % pessoas.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [pessoas]);

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
          
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 lg:px-8 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl lg:rounded-full font-bold text-sm lg:text-lg shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <span className="lg:hidden">+</span>
            <span className="hidden lg:inline">⚡ Reportar Pessoa</span>
          </button>
        </div>
      </div>

      {/* Container principal */}
      <div className="h-full flex flex-col lg:flex-row pt-16 lg:pt-20">
        {/* Foto da pessoa - tela cheia com overlay moderno */}
        <div className="flex-1 relative h-[60vh] lg:h-full overflow-hidden"
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
                className="object-cover w-full h-full cursor-pointer lg:cursor-zoom-in"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.innerWidth >= 1024) {
                    setZoomOpen(true);
                  } else {
                    setShowMobileIcons(!showMobileIcons);
                  }
                }}
              />
              {/* Overlay gradiente para contraste */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
              
              {/* Status sempre visível no mobile - topo da tela */}
              <div className="lg:hidden absolute top-4 left-4 right-4 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <span className={`inline-block px-6 py-3 rounded-2xl text-base font-black tracking-wider uppercase shadow-2xl transform rotate-1 animate-pulse ${
                      pessoa.status === "perdido" 
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-500/50 border-2 border-red-400" 
                        : "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/50 border-2 border-green-400"
                    }`}>
                      {pessoa.status === "perdido" ? "🚨 PERDIDO" : "✅ ENCONTRADO"}
                    </span>
                    <div className="text-white/90 text-xs font-bold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-xl">
                      📅 {pessoa.createdAt ? new Date(pessoa.createdAt).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <button
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-xl hover:shadow-blue-500/30 transition-all duration-300 text-xs transform hover:scale-105"
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
                    🔄 Alterar
                  </button>
                </div>
              </div>

              {/* Nome e descrição sempre visíveis no mobile - parte inferior */}
              <div className="lg:hidden absolute bottom-4 left-4 right-4 z-10">
                <div className="space-y-3">
                  <h1 className="text-2xl font-black text-white drop-shadow-2xl leading-tight">
                    {pessoa.nome}
                  </h1>
                  <p className="text-sm text-white/90 font-semibold leading-relaxed drop-shadow-lg bg-black/40 backdrop-blur-sm p-3 rounded-2xl line-clamp-2">
                    {pessoa.descricao}
                  </p>
                </div>
              </div>
              
              {/* Informações sobrepostas na foto - desktop apenas */}
              <div className="absolute inset-0 hidden lg:flex items-center justify-start p-8 md:p-16">
                <div className="max-w-lg space-y-6">
                  {/* Status badge grande */}
                  <div className="flex items-center gap-4">
                    <span className={`px-8 py-3 rounded-full text-lg font-black tracking-wider uppercase shadow-2xl transform -rotate-2 ${
                      pessoa.status === "perdido" 
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-500/50" 
                        : "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/50"
                    }`}>
                      {pessoa.status === "perdido" ? "🚨 PERDIDO" : "✅ ACHADO"}
                    </span>
                    <div className="text-white/60 text-sm">
                      {pessoa.createdAt ? new Date(pessoa.createdAt).toLocaleDateString() : ""}
                    </div>
                    <button
                      className="ml-4 px-4 py-2 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition text-xs"
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
                      Alterar estado
                    </button>
                  </div>

                  {/* Nome gigante */}
                  <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl leading-none">
                    {pessoa.nome}
                  </h1>

                  {/* Descrição destacada */}
                  <p className="text-base md:text-lg text-white/90 font-semibold leading-relaxed drop-shadow-lg bg-black/30 backdrop-blur-sm p-4 rounded-2xl">
                    {pessoa.descricao}
                  </p>

                  {/* Informações rápidas */}
                  <div className="grid grid-cols-1 gap-3">
                    {pessoa.ultimoLocal && (
                      <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">📍</span>
                        </div>
                        <div>
                          <div className="text-white/70 text-sm font-semibold uppercase tracking-wide">Último Local</div>
                          <div className="text-white text-base font-bold">{pessoa.ultimoLocal}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📞</span>
                      </div>
                      <div>
                        <div className="text-white/70 text-sm font-semibold uppercase tracking-wide">Contato</div>
                        <div className="text-green-300 text-base font-bold">{pessoa.contacto}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicador de toque para mobile - posicionado no centro */}
              {!showMobileIcons && (
                <div className="lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 shadow-xl">
                    <p className="text-white text-sm font-bold flex items-center gap-2">
                      <span className="text-lg">👆</span>
                      Toque para mais opções
                    </p>
                  </div>
                </div>
              )}

              {/* Ícones mobile que aparecem ao tocar - sem status pois já está visível */}
              {showMobileIcons && (
                <div className="absolute inset-0 flex items-center justify-center lg:hidden bg-black/40 backdrop-blur-md animate-fadeIn">
                  <div className="grid grid-cols-3 gap-6 p-8">
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
                        <span className="text-white text-3xl">�</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Aparência</span>
                    </div>

                    {/* Local/Mapa */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.3s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setMapaOpen(true)}
                      >
                        <span className="text-white text-3xl">�</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Mapa</span>
                    </div>

                    {/* Contato */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.4s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setActiveCard('contato')}
                      >
                        <span className="text-white text-3xl">�</span>
                      </button>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Contato</span>
                    </div>

                    {/* Relatos */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.5s'}}>
                      <button 
                        className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300 hover:animate-pulse-glow"
                        onClick={() => setRelatosOpen(true)}
                      >
                        <span className="text-white text-3xl">�</span>
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

        {/* Painel lateral com cards organizados - desktop / Cards mobile */}
        <div className="w-full lg:w-96 bg-black/40 backdrop-blur-xl border-l border-white/10 p-4 md:p-6 flex flex-col">
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

              {/* Card Comentários vira botão para abrir modal */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex-1 cursor-pointer hover:bg-blue-500/10 transition" onClick={() => setRelatosOpen(true)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-300 text-lg">💬</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-2">Ver relatos e comentar</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer com navegação e contador - melhorado para mobile */}
          <div className="mt-6 space-y-4">
            {/* Navegação */}
            <div className="flex gap-4">
              <button 
                onClick={prev} 
                className="flex-1 py-4 lg:py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-sm rounded-2xl lg:rounded-lg font-bold lg:font-semibold text-white border border-white/30 transition-all duration-300 text-base lg:text-sm shadow-lg hover:shadow-white/20 transform hover:scale-105 lg:hover:scale-100"
              >
                ← Anterior
              </button>
              <button 
                onClick={next} 
                className="flex-1 py-4 lg:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl lg:rounded-lg font-bold lg:font-semibold text-white transition-all duration-300 text-base lg:text-sm shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 lg:hover:scale-100"
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

      {/* Modal de zoom da imagem */}
      {zoomOpen && pessoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setZoomOpen(false)}>
          <div className="relative max-w-full max-h-full">
            <img 
              src={pessoa.foto || '/default-avatar.png'} 
              alt={pessoa.nome}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/50 rounded-full px-3 py-1 shadow-lg hover:bg-black/70"
              onClick={() => setZoomOpen(false)}
            >
              &times;
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