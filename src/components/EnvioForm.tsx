"use client";

import { useState, FormEvent } from "react";
import { crearEnvio } from "@/lib/api";

interface EnvioFormProps {
  onCreated: () => void;
}

const initialState = {
  guia: "",
  destinatario: "",
  origen_lat: "",
  origen_lng: "",
  destino_lat: "",
  destino_lng: "",
};

export default function EnvioForm({ onCreated }: EnvioFormProps) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof initialState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await crearEnvio({
        guia: form.guia.trim(),
        destinatario: form.destinatario.trim(),
        origen_lat: Number(form.origen_lat),
        origen_lng: Number(form.origen_lng),
        destino_lat: Number(form.destino_lat),
        destino_lng: Number(form.destino_lng),
      });
      setForm(initialState);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el envio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 space-y-4"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
        Registrar envío
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Número de guía</label>
          <input
            required
            value={form.guia}
            onChange={(e) => update("guia", e.target.value)}
            placeholder="GUIA-0001"
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Destinatario</label>
          <input
            required
            value={form.destinatario}
            onChange={(e) => update("destinatario", e.target.value)}
            placeholder="Nombre del destinatario"
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Origen (lat, lng)</label>
          <div className="flex gap-2">
            <input
              required
              type="number"
              step="any"
              value={form.origen_lat}
              onChange={(e) => update("origen_lat", e.target.value)}
              placeholder="19.4326"
              className="w-1/2 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              required
              type="number"
              step="any"
              value={form.origen_lng}
              onChange={(e) => update("origen_lng", e.target.value)}
              placeholder="-99.1332"
              className="w-1/2 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Destino (lat, lng)</label>
          <div className="flex gap-2">
            <input
              required
              type="number"
              step="any"
              value={form.destino_lat}
              onChange={(e) => update("destino_lat", e.target.value)}
              placeholder="20.6597"
              className="w-1/2 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              required
              type="number"
              step="any"
              value={form.destino_lng}
              onChange={(e) => update("destino_lng", e.target.value)}
              placeholder="-103.3496"
              className="w-1/2 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors"
      >
        {loading ? "Guardando…" : "Registrar envío"}
      </button>
    </form>
  );
}