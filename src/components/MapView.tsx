"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { getSocket } from "@/lib/socket";
import type { EnvioDetalle, PosicionActualizada } from "@/lib/types";

// Iconos por defecto de Leaflet no cargan bien con bundlers, se reconfiguran con CDN.
const baseIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const repartidorIcon = new L.DivIcon({
  className: "",
  html: '<div style="width:16px;height:16px;border-radius:9999px;background:#22d3ee;border:2px solid #0f172a;box-shadow:0 0 0 4px rgba(34,211,238,0.25);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

interface MapViewProps {
  envio: EnvioDetalle;
}

export default function MapView({ envio }: MapViewProps) {
  const [posicionActual, setPosicionActual] = useState<[number, number] | null>(null);

  useEffect(() => {
    const socket = getSocket();

    function handlePosicion(data: PosicionActualizada) {
      if (data.guia === envio.guia) {
        setPosicionActual([data.lat, data.lng]);
      }
    }

    socket.on("posicion_actualizada", handlePosicion);
    return () => {
      socket.off("posicion_actualizada", handlePosicion);
    };
  }, [envio.guia]);

  const origen: [number, number] = [envio.origen_lat, envio.origen_lng];
  const destino: [number, number] = [envio.destino_lat, envio.destino_lng];
  const checkpoints: [number, number][] = envio.checkpoints
    .slice()
    .sort((a, b) => a.orden - b.orden)
    .map((c) => [c.latitud, c.longitud]);

  const ruta: [number, number][] = [origen, ...checkpoints, destino];
  const bounds = posicionActual ? [...ruta, posicionActual] : ruta;

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-lg border border-slate-800">
      <MapContainer center={origen} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={bounds} />

        <Polyline positions={ruta} pathOptions={{ color: "#22d3ee", weight: 3, dashArray: "6 6" }} />

        <Marker position={origen} icon={baseIcon}>
          <Popup>Origen</Popup>
        </Marker>

        <Marker position={destino} icon={baseIcon}>
          <Popup>Destino</Popup>
        </Marker>

        {checkpoints.map((cp, i) => (
          <Marker key={i} position={cp} icon={baseIcon}>
            <Popup>Checkpoint #{i + 1}</Popup>
          </Marker>
        ))}

        {posicionActual && (
          <Marker position={posicionActual} icon={repartidorIcon}>
            <Popup>Repartidor en tránsito</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}