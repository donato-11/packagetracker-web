"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getEnvioPorGuia } from "@/lib/api";
import type { EnvioDetalle } from "@/lib/types";

// Leaflet se carga sólo en cliente porque depende de window
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const ESTADO_STYLES: Record<string, string> = {
  "En Almacén": "bg-amber-400/10 text-amber-300 border-amber-400/30",
  "En tránsito": "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
  Entregado: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
};

export default function EnvioDetallePage() {
  const params = useParams<{ guia: string }>();
  const [envio, setEnvio] = useState<EnvioDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnvioPorGuia(params.guia);
      setEnvio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el envío.");
    } finally {
      setLoading(false);
    }
  }, [params.guia]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <Link href="/" className="text-sm text-slate-400 hover:text-cyan-400">
          ← Volver al panel
        </Link>

        {loading && <p className="text-sm text-slate-500">Cargando envío…</p>}
        {error && <p className="text-sm text-rose-400">{error}</p>}

        {envio && (
          <>
            <header className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold font-mono">{envio.guia}</h1>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  ESTADO_STYLES[envio.estado] ?? "border-slate-700 text-slate-300"
                }`}
              >
                {envio.estado}
              </span>
            </header>

            <p className="text-sm text-slate-400">
              Destinatario: <span className="text-slate-200">{envio.destinatario}</span>
            </p>

            <MapView envio={envio} />
          </>
        )}
      </div>
    </main>
  );
}