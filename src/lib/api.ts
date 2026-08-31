import type { Envio, EnvioDetalle } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status} al llamar la API.`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface NuevoEnvioInput {
  guia: string;
  destinatario: string;
  origen_lat: number;
  origen_lng: number;
  destino_lat: number;
  destino_lng: number;
}

export function getEnvios(): Promise<Envio[]> {
  return fetch(`${API_URL}/api/envios`, { cache: "no-store" }).then((r) => handle<Envio[]>(r));
}

export function getEnvioPorGuia(guia: string): Promise<EnvioDetalle> {
  return fetch(`${API_URL}/api/envios/${encodeURIComponent(guia)}`, { cache: "no-store" }).then((r) =>
    handle<EnvioDetalle>(r)
  );
}

export function crearEnvio(input: NuevoEnvioInput): Promise<Envio> {
  return fetch(`${API_URL}/api/envios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).then((r) => handle<Envio>(r));
}

export function actualizarEnvio(
  id: number,
  cambios: Partial<Pick<Envio, "estado" | "destinatario">>
): Promise<Envio> {
  return fetch(`${API_URL}/api/envios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  }).then((r) => handle<Envio>(r));
}

export function eliminarEnvio(id: number): Promise<void> {
  return fetch(`${API_URL}/api/envios/${id}`, { method: "DELETE" }).then((r) => handle<void>(r));
}

export { API_URL };