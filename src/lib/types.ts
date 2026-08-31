export type EstadoEnvio = "En Almacén" | "En tránsito" | "Entregado";

export interface Envio {
  id: number;
  guia: string;
  destinatario: string;
  origen_lat: number;
  origen_lng: number;
  destino_lat: number;
  destino_lng: number;
  estado: EstadoEnvio;
  created_at: string;
}

export interface Checkpoint {
  id: number;
  envio_id: number;
  latitud: number;
  longitud: number;
  orden: number;
}

export interface EnvioDetalle extends Envio {
  checkpoints: Checkpoint[];
}

export interface PosicionActualizada {
  guia: string;
  lat: number;
  lng: number;
  progreso: number;
}