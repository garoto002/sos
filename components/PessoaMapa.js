import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function PessoaMapa({ local }) {
  const [coords, setCoords] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!local) return;
    setErro("");
    setCoords(null);
    // Geocodifica usando Nominatim (OpenStreetMap)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(local)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
          setErro("Local não encontrado no mapa.");
        }
      })
      .catch(() => setErro("Erro ao buscar localização."));
  }, [local]);

  if (!local) return null;
  if (erro) return <div className="text-xs text-red-400 mt-2">{erro}</div>;
  if (!coords) return <div className="text-xs text-zinc-400 mt-2">Buscando localização...</div>;

  // Só renderiza o mapa se window estiver definido
  if (typeof window === "undefined") return null;

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden mt-2 shadow border border-zinc-700">
      <MapContainer center={coords} zoom={15} style={{ width: "100%", height: "100%" }} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={coords}>
          <Popup>Último local visto</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
