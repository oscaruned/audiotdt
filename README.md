# audiotdt

Reproductor **web de solo audio** para la TDT española y radios nacionales (COPE, Onda Cero, Capital, Intereconomía…), pensado para **escuchar la televisión en directo con la pantalla apagada**.

- Sin frameworks, sin build, sin servidor: descarga y abre `index.html` con doble clic (`file://`).
- Solo audio → consumo mínimo de datos y continuidad con la pantalla apagada en Android (Chrome/Edge, vía MediaSession).
- Lista de canales editable en un solo archivo (`canales.js`) con fuentes de respaldo por canal; si una señal falla, la app prueba la siguiente automáticamente.

## Uso

1. Descarga el repo (o `git clone`).
2. Abre `index.html`.
3. Elige canal tocándolo, o con `↑` / `↓`; `Espacio` reproduce/pausa. Recuerda el último canal.

Para usarlo "de app" en el móvil, servido con HTTPS se puede instalar como PWA (`manifest.json` incluido).

## Canales incluidos

- **TV (segmento audio)**: La 1, La 2, Telemadrid, La Otra, Trece funcionan con señales públicas.
- **TV privadas** (Cuatro, Be Mad, La Sexta, Antena 3, BOM Cine): no existe señal pública libre — sus emisiones usan tokens firmados y DRM, y sus webs bloquean el embedding (`frame-ancestors`). La app las muestra como *no disponible* con enlace a la web oficial.
- **Radio**: COPE (nacional), COPE Madrid, Onda Cero, Onda Cero Eventos, Capital Radio, Intereconomía.

## Añadir un canal

Edita `canales.js` y añade una entrada. `fuentes` es una lista en orden de preferencia (la app hace fallback automático):

```js
{
  nombre: "Nombre",
  web: "https://web-oficial/",
  fuentes: [
    "https://.../playlist.m3u8",  // HLS de video (se emite solo el audio)
    "https://.../stream.mp3"      // también sirven streams directos AAC/MP3 de radio
  ]
}
```

Usa `tipo: "radio"` para mostrar el canal en la sección Radio.

## Cómo funciona

- `src/app.js`: reproduce con **HLS nativo** si el navegador soporta `.m3u8` (Chromium moderno lo hace), y con **hls.js** (incluido localmente en `src/hls.min.js`) como motor de reserva. Los streams MP3/AAC se asignan directo al elemento `<audio>`.
- `MediaSession` integra controles del sistema (incluido con pantalla bloqueada).
- Todo funciona offline-servido: sin `fetch` de la lista de canales (va embebida) para que `file://` no tenga CORS.

## Notas legales

Los enlaces de emisión son las señales públicas que distribuyen los propios operadores (RTVE, Telemadrid, emisoras de radio) o listados públicos como TDTChannels/iptv-org. Este proyecto no descifra DRM ni reemite señal alguna: solo reproduce streams públicos con un reproductor de audio. La disponibilidad puede variar por geolocalización (España) o cambios de los operadores.
