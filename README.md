# packagetracker-web

Frontend de **PackageTracker**

## Variables de entorno
`NEXT_PUBLIC_API_URL` debe apuntar al backend `packagetracker-api` 

## Levantar en desarrollo
```bash
npm install
npm run dev
```
El proyecto corre en `http://localhost:3000` por defecto. De preferencia hay que tener `packagetracker-api` corriendo desde antes.

## Levantar con Docker
```bash
docker build -t packagetracker-web --build-arg NEXT_PUBLIC_API_URL=url_de_packagetracker-api .
docker run -p 3000:3000 packagetracker-web
```

## Estructura relevante
```
src/
  app/
    page.tsx                 -> Panel CRUD + buscador + tabla de envíos
    envio/[guia]/page.tsx     -> Envío con mapa en tiempo real
  components/
    EnvioForm.tsx             -> Alta de nuevos envíos
    EnvioTable.tsx             -> Listado, edición y eliminación
    SearchBar.tsx              -> Búsqueda por número de guía
    MapView.tsx                -> Mapa (Leaflet) con origen/destino/checkpoints y marcador en vivo
  lib/
    api.ts                    -> Cliente HTTP hacia packagetracker-api
    socket.ts                 -> Cliente Socket.IO único
    types.ts                  -> Tipos compartidos (Envio, Checkpoint, etc.)
```

## Notas de implementación
- El mapa usa **Leaflet + OpenStreetMap** (sin necesidad de API key) como alternativa a Google Maps..
- `MapView` se importa con `next/dynamic` y `ssr: false` porque Leaflet requiere `window`.
- El marcador del repartidor se actualiza escuchando el evento `posicion_actualizada` emitido por el backend a través de Socket.IO.
