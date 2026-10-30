/* audiotdt — service worker (solo se registra cuando la app está servida por HTTP(S),
 * típicamente GitHub Pages; con file:// no actúa y la app sigue funcionando normal).
 * Cache-first para los ficheros de la app; los streams de radio/TV pasan de largo.
 */
"use strict";

const CACHE = "audiotdt-v1";
const FICHEROS = [
  "./",
  "index.html",
  "canales.js",
  "css/estilos.css",
  "src/app.js",
  "src/hls.min.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(FICHEROS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const claves = await caches.keys();
    await Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || e.request.method !== "GET") return;

  e.respondWith((async () => {
    const enCache = await caches.match(e.request, { ignoreSearch: true });
    if (enCache) return enCache;
    try {
      const r = await fetch(e.request);
      if (r.ok && /^(basic|cors)/.test(r.type)) {
        const copia = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
      }
      return r;
    } catch (_) {
      return new Response("", { status: 503 });
    }
  })());
});
