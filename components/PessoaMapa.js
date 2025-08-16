import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">Carregando mapa...</div>
});
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function PessoaMapa({ pessoa }) {
  const [coords, setCoords] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  
  const local = pessoa?.ultimoLocal || pessoa?.local;

  useEffect(() => {
    if (!local) return;
    setErro("");
    setCoords(null);
    setCarregando(true);
    
    // Geocodifica usando Nominatim (OpenStreetMap)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(local)}`)
      .then(res => res.json())
      .then(data => {
        setCarregando(false);
        if (data && data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
          setErro("Local não encontrado no mapa.");
        }
      })
      .catch(() => {
        setCarregando(false);
        setErro("Erro ao buscar localização.");
      });
  }, [local]);

  if (!local) return <div className="text-xs text-zinc-400 mt-2">Endereço não informado</div>;
  if (erro) return <div className="text-xs text-red-400 mt-2">{erro}</div>;
  if (carregando) return <div className="text-xs text-zinc-400 mt-2">Buscando localização...</div>;
  if (!coords) return <div className="text-xs text-zinc-400 mt-2">Preparando mapa...</div>;

  // Só renderiza o mapa se window estiver definido
  if (typeof window === "undefined") return null;

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden mt-2 shadow border border-zinc-700">
      <MapContainer 
        center={coords} 
        zoom={15} 
        style={{ width: "100%", height: "100%" }} 
        scrollWheelZoom={false}
        key={`${coords.lat}-${coords.lng}`}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={coords}>
          <Popup>Último local visto: {local}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
