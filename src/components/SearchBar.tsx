"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function SearchBar() {
  const [guia, setGuia] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = guia.trim();
    if (trimmed) {
      router.push(`/envio/${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={guia}
        onChange={(e) => setGuia(e.target.value)}
        placeholder="Buscar por número de guía…"
        className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        type="submit"
        className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
      >
        Rastrear
      </button>
    </form>
  );
}