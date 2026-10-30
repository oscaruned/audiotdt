/* TDT Radio — lógica de reproducción
 * - Solo audio (elemento <audio> alimentado por hls.js)
 * - Prueba las fuentes de un canal en serie si alguna falla
 * - MediaSession para que el sistema lo trate como app de radio
 *   (esto es lo que permite seguir sonando con la pantalla apagada)
 */
"use strict";

const player = document.getElementById("player");
const dial = document.getElementById("dial");
const btnPlay = document.getElementById("btnPlay");
const elCanal = document.getElementById("nombreCanal");
const elEstado = document.getElementById("estado");
const lista = document.getElementById("listaCanales");
const elWeb = document.getElementById("enlaceWeb");

let canalIdx = -1;      // canal activo
let fuenteIdx = 0;      // fuente activa del canal
let hls = null;

/* ---------- utilidades ---------- */
function setEstado(texto, esError = false) {
  elEstado.textContent = texto;
  elEstado.classList.toggle("error", esError);
}
function setDial(estado) {
  dial.dataset.estado = estado;
  btnPlay.textContent = estado === "sonando" || estado === "cargando" ? "❚❚" : "▶";
}
function fuenteDelCanal(i) {
  return CANALES[i].fuentes[fuenteIdx];
}
function guardarUltimo() {
  try { localStorage.setItem("tdt-radio:canal", String(canalIdx)); } catch (_) {}
}
function leerUltimo() {
  try {
    const n = parseInt(localStorage.getItem("tdt-radio:canal") || "-1", 10);
    return n >= 0 && n < CANALES.length ? n : -1;
  } catch (_) { return -1; }
}

/* ---------- lista de canales ---------- */
function pintarCanales() {
  const nodos = [];
  let tipoActual = null;
  CANALES.forEach((c, i) => {
    const tipo = c.tipo || "tv";
    if (tipo !== tipoActual) {
      tipoActual = tipo;
      const g = document.createElement("div");
      g.className = "grupo";
      g.textContent = tipo === "radio" ? "Radio" : "Televisión";
      nodos.push(g);
    }
    const b = document.createElement("button");
    b.className = "boton-canal";
    b.type = "button";
    b.dataset.canal = String(i);
    b.setAttribute("aria-current", "false");
    const num = document.createElement("span");
    num.className = "num";
    num.textContent = String(i + 1).padStart(2, "0");
    const nombre = document.createElement("span");
    nombre.className = "nombre";
    nombre.textContent = c.nombre;
    const marca = document.createElement("span");
    marca.className = "marca";
    b.append(num, nombre, marca);
    b.addEventListener("click", () => seleccionarCanal(i));
    nodos.push(b);
  });
  lista.replaceChildren(...nodos);
}
function marcarActivo() {
  lista.querySelectorAll(".boton-canal").forEach((b, i) => {
    b.setAttribute("aria-current", String(i === canalIdx));
    if (i === canalIdx) b.scrollIntoView({ block: "nearest" });
  });
}
function marcarFuente(i, ok) {
  const b = lista.querySelector(`.boton-canal[data-canal="${i}"]`);
  if (b) { if (ok) b.dataset.fuente = "ok"; else if (b.dataset.fuente !== "ok") b.dataset.fuente = "ko"; }
}

/* ---------- reproducción ---------- */
function limpiarHls() {
  if (hls) { hls.destroy(); hls = null; }
}

function seleccionarCanal(i) {
  canalIdx = i;
  fuenteIdx = 0;
  marcarActivo();
  guardarUltimo();
  elCanal.textContent = CANALES[i].nombre;
  if (elWeb) {
    elWeb.href = CANALES[i].web || "#";
    elWeb.hidden = !CANALES[i].web;
  }
  setDial("cargando");
  setEstado("Conectando…");
  btnPlay.disabled = true;
  arrancar();
}

function esHls(url) {
  return /\.m3u8(\?|$)/i.test(url);
}

function arrancar() {
  limpiarHls();
  const url = fuenteDelCanal(canalIdx);
  player.pause();
  player.removeAttribute("src");

  if (!esHls(url) || player.canPlayType("application/vnd.apple.mpegurl")) {
    // HLS nativo o stream directo (MP3/AAC de radio)
    player.src = url;
    player.addEventListener("error", () => fallback(), { once: true });
    player.play().catch(() => {});
    return;
  }

  if (!window.Hls || !Hls.isSupported()) {
    setEstado("Tu navegador no soporta HLS", true);
    setDial("parado");
    btnPlay.disabled = false;
    return;
  }

  hls = new Hls({
    // consumo bajo: buffer corto
    maxBufferLength: 20,
    backBufferLength: 10,
    liveSyncDurationCount: 3,
    manifestLoadingMaxRetry: 1,
  });
  hls.attachMedia(player);
  hls.loadSource(url);

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    btnPlay.disabled = false;
    marcarFuente(canalIdx, true);
    player.play().catch(() => {});
  });
  hls.on(Hls.Events.ERROR, (_ev, data) => {
    if (!data.fatal) return;
    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
      fallback();
    } else {
      setEstado("Error del stream", true);
      setDial("parado");
      btnPlay.disabled = false;
      marcarFuente(canalIdx, false);
      limpiarHls();
    }
  });
}

/* si una fuente falla, prueba la siguiente del canal; KO si no queda ninguna */
function fallback() {
  marcarFuente(canalIdx, false);
  const total = CANALES[canalIdx].fuentes.length;
  fuenteIdx++;
  if (fuenteIdx < total) {
    setEstado(`Sin señal en fuente ${fuenteIdx}, probando otra…`);
    arrancar();
  } else {
    fuenteIdx = 0;
    setEstado("Señal no disponible ahora. Prueba la web oficial del canal.", true);
    setDial("parado");
    btnPlay.disabled = false;
    limpiarHls();
  }
}

/* ---------- MediaSession (pantalla apagada / mandos multimedia) ---------- */
function actualizarMediaSession() {
  if (!("mediaSession" in navigator) || canalIdx < 0) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: CANALES[canalIdx].nombre,
    artist: "TDT en directo — audio",
    album: "TDT Radio",
  });
  try {
    navigator.mediaSession.setActionHandler("play", () => arrancar());
    navigator.mediaSession.setActionHandler("pause", () => player.pause());
    navigator.mediaSession.setActionHandler("nexttrack", () => seleccionarCanal((canalIdx + 1) % CANALES.length));
    navigator.mediaSession.setActionHandler("previoustrack", () => seleccionarCanal((canalIdx + CANALES.length - 1) % CANALES.length));
  } catch (_) { /* handlers opcionales */ }
}

/* ---------- eventos del elemento de audio ---------- */
player.addEventListener("playing", () => {
  setDial("sonando");
  setEstado("Sonando " + CANALES[canalIdx].nombre);
  btnPlay.disabled = false;
  marcarFuente(canalIdx, true);
  if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
});
player.addEventListener("pause", () => {
  if (dial.dataset.estado === "cargando") return; // no anunciar pausa mientras cargamos
  setDial("parado");
  if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
  if (canalIdx >= 0 && player.readyState > 0) setEstado("En pausa");
});
player.addEventListener("waiting", () => setEstado("Buffering…"));
player.addEventListener("stalled", () => setEstado("Señal lenta…"));

/* ---------- controles ---------- */
btnPlay.addEventListener("click", () => {
  if (canalIdx < 0) {
    seleccionarCanal(leerUltimo() >= 0 ? leerUltimo() : 0);
    return;
  }
  if (dial.dataset.estado === "sonando") {
    player.pause();
  } else {
    setDial("cargando");
    setEstado("Conectando…");
    btnPlay.disabled = true;
    arrancar();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") seleccionarCanal((canalIdx < 0 ? 0 : canalIdx + 1) % CANALES.length);
  else if (e.key === "ArrowUp") seleccionarCanal((canalIdx < 0 ? CANALES.length - 1 : canalIdx + CANALES.length - 1) % CANALES.length);
  else if (e.key === " " && e.target === document.body) { e.preventDefault(); btnPlay.click(); }
});

/* ---------- arranque ---------- */
pintarCanales();
const ultimo = leerUltimo();
if (ultimo >= 0) {
  // no arranca solo (el autoplay sin gesto lo bloquea el navegador): deja el canal listo
  canalIdx = ultimo;
  elCanal.textContent = CANALES[ultimo].nombre;
  marcarActivo();
}
actualizarMediaSession();
