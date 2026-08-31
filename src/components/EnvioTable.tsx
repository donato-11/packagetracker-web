"use client";

import Link from "next/link";
import { useState } from "react";
import type { Envio, EstadoEnvio } from "@/lib/types";
import { actualizarEnvio, eliminarEnvio } from "@/lib/api";

interface EnvioTableProps {
  envios: Envio[];
  onChanged: () => void;
}

const ESTADOS: EstadoEnvio[] = ["En Almacén", "En tránsito", "Entregado"];

const ESTADO_STYLES: Record<EstadoEnvio, string> = {
  "En Almacén": "bg-amber-400/10 text-amber-300 border-amber-400/30",
  "En tránsito": "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
  Entregado: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
};

export default function EnvioTable({ envios, onChanged }: EnvioTableProps) {
  const [busyId, setBusyId] = useState<number | null>(null);

  async function handleEstadoChange(id: number, estado: EstadoEnvio) {
    setBusyId(id);
    try {
      await actualizarEnvio(id, { estado });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este envío?")) return;
    setBusyId(id);
    try {
      await eliminarEnvio(id);
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  if (envios.length === 0) {
    return (
      <p className="text-sm text-slate-500 border border-dashed border-slate-800 rounded-lg p-6 text-center">
        Aún no hay envíos registrados. Usa el formulario para crear el primero.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Guía</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Destinatario</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Estado</th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/40">
          {envios.map((envio) => (
            <tr key={envio.id} className={busyId === envio.id ? "opacity-50" : ""}>
              <td className="px-4 py-3 font-mono text-slate-200">
                <Link href={`/envio/${envio.guia}`} className="hover:text-cyan-400 underline underline-offset-2">
                  {envio.guia}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-300">{envio.destinatario}</td>
              <td className="px-4 py-3">
                <select
                  value={envio.estado}
                  disabled={busyId === envio.id}
                  onChange={(e) => handleEstadoChange(envio.id, e.target.value as EstadoEnvio)}
                  className={`rounded-full border px-2 py-1 text-xs font-medium ${ESTADO_STYLES[envio.estado]} bg-transparent`}
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado} className="bg-slate-900 text-slate-100">
                      {estado}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(envio.id)}
                  disabled={busyId === envio.id}
                  className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}