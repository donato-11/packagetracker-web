"use client";

import { useCallback, useEffect, useState } from "react";
import EnvioForm from "@/components/EnvioForm";
import EnvioTable from "@/components/EnvioTable";
import SearchBar from "@/components/SearchBar";
import { getEnvios } from "@/lib/api";
import type { Envio } from "@/lib/types";

export default function HomePage() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarEnvios = useCallback(async () => {
    setError(null);
    try {
      const data = await getEnvios();
      setEnvios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los envíos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEnvios();
  }, [cargarEnvios]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Package<span className="text-cyan-400">Tracker</span> Lite
          </h1>
          <p className="text-sm text-slate-400">
            Rastreo de envíos y simulación de recorrido en tiempo real.
          </p>
        </header>

        <SearchBar />

        <EnvioForm onCreated={cargarEnvios} />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Envíos registrados
          </h2>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          {loading ? (
            <p className="text-sm text-slate-500">Cargando envíos…</p>
          ) : (
            <EnvioTable envios={envios} onChanged={cargarEnvios} />
          )}
        </section>
      </div>
    </main>
  );
}
