import { useEffect, useState } from "react";

export default function PessoaComentarios({ pessoaId }) {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [autor, setAutor] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!pessoaId) return;
    fetch(`/api/pessoas/${pessoaId}/comentario`)
      .then(res => res.json())
      .then(data => setComentarios(data.comentarios || []));
  }, [pessoaId]);

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`/api/pessoas/${pessoaId}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: novoComentario, autor })
      });
      const data = await res.json();
      if (res.ok) {
        setComentarios(data.comentarios);
        setNovoComentario("");
        setAutor("");
      } else {
        setErro(data.error || "Erro ao enviar comentário.");
      }
    } catch {
      setErro("Erro de conexão.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-zinc-200 mb-2">Comentários / Relatos</h3>
      <form onSubmit={enviarComentario} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Seu nome (opcional)"
          value={autor}
          onChange={e => setAutor(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400"
        />
        <textarea
          placeholder="Deixe um relato ou informação..."
          value={novoComentario}
          onChange={e => setNovoComentario(e.target.value)}
          required
          className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 min-h-[60px]"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
          {loading ? "Enviando..." : "Enviar"}
        </button>
        {erro && <div className="text-xs text-red-400 mt-1">{erro}</div>}
      </form>
      <div className="flex flex-col gap-3">
        {comentarios.length === 0 && <div className="text-zinc-400 text-sm">Nenhum comentário ainda.</div>}
        {comentarios.map((c, i) => (
          <div key={i} className="bg-zinc-800 rounded p-3 border border-zinc-700">
            <div className="text-zinc-200 text-sm">{c.texto}</div>
            <div className="text-xs text-zinc-400 mt-1 flex justify-between">
              <span>{c.autor ? `Por: ${c.autor}` : "Anônimo"}</span>
              <span>{c.data ? new Date(c.data).toLocaleDateString() : ""}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
