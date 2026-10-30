/**
 * Lista de canales de TDT — edición libre.
 * Cada canal tiene una lista de "fuentes" en orden de preferencia;
 * la app las prueba en serie y cambia automáticamente si una falla.
 *
 * Nota: los canales privados (Antena 3, La Sexta, Cuatro y compañía)
 * no publican señales libres; los enlaces que aparecen son los que los
 * proyectos públicos (TDTChannels, iptv-org) han usado últimamente.
 * Si tienes un enlace propio, añádelo al principio de la lista.
 */
const CANALES = [
  {
    nombre: "La 1",
    web: "https://www.rtve.es/play/videos/directo/canales-lineales/",
    fuentes: [
      "https://rtvelivestream.rtve.es/rtvesec/la1/la1_main.m3u8",
      "https://ztnr.rtve.es/ztnr/5190066.m3u8", // La 1 Canarias
      "https://ztnr.rtve.es/ztnr/3293681.m3u8"  // La 1 Catalunya
    ]
  },
  {
    nombre: "La 2",
    web: "https://www.rtve.es/play/la-2/",
    fuentes: [
      "https://rtvelivestream.rtve.es/rtvesec/la2/la2_main.m3u8",
      "https://ztnr.rtve.es/ztnr/3987218.m3u8", // La 2 Catalunya
      "https://ztnr.rtve.es/ztnr/5468585.m3u8"  // La 2 Canarias
    ]
  },
  {
    nombre: "Telemadrid",
    web: "https://www.telemadrid.es/emision-en-directo",
    fuentes: [
      "https://live.telemadrid.cross-media.es/6389770581112/eu-central-1/6416060453001/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiajI5YjgyLmVncmVzcy5haGc3NmwiLCJhY2NvdW50X2lkIjoiNjQxNjA2MDQ1MzAwMSIsImVobiI6ImxpdmUudGVsZW1hZHJpZC5jcm9zcy1tZWRpYS5lcyIsImlzcyI6ImJsaXZlLXBsYXliYWNrLXNvdXJjZS1hcGkiLCJzdWIiOiJwYXRobWFwdG9rZW4iLCJhdWQiOlsiNjQxNjA2MDQ1MzAwMSJdLCJqdGkiOiI2Mzg5NzcwNTgxMTEyIn0.kqriAMUkHT6m0V6wkCHJum_EUyL4PAi1zJMKlfmYHEU/playlist-hls.m3u8"
    ]
  },
  {
    nombre: "La Otra",
    web: "https://www.telemadrid.es/emision-en-directo-laotra",
    fuentes: [
      "https://live.telemadrid.cross-media.es/6389770474112/eu-central-1/6416060453001/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiajI5YjgyLmVncmVzcy5haGc3NmwiLCJhY2NvdW50X2lkIjoiNjQxNjA2MDQ1MzAwMSIsImVobiI6ImxpdmUudGVsZW1hZHJpZC5jcm9zcy1tZWRpYS5lcyIsImlzcyI6ImJsaXZlLXBsYXliYWNrLXNvdXJjZS1hcGkiLCJzdWIiOiJwYXRobWFwdG9rZW4iLCJhdWQiOlsiNjQxNjA2MDQ1MzAwMSJdLCJqdGkiOiI2Mzg5NzcwNDc0MTEyIn0.1KSxZK60xNAZZsa7dbYR8Equ8aG930d6qFDsYKUmmdE/playlist-hls.m3u8",
      "https://laotra-1-23-secure2.akamaized.net/master.m3u8"
    ]
  },
  {
    nombre: "Be Mad",
    web: "https://www.bemad.es/",
    fuentes: [
      "https://directos.bemad.es/orilinear02/live/linear02/main/main.isml/main-audio_spa=128000-video=1500000.m3u8",
      "https://livehlsdai-i.akamaihd.net/hls/live/571642/bemad/bitrate_1.m3u8"
    ]
  },
  {
    nombre: "Cuatro",
    web: "https://www.mediasetinfinity.es/directo/cuatro",
    fuentes: [
      "https://livehlsdai-i.akamaihd.net/hls/live/571643/cuatro/bitrate_1.m3u8",
      "https://directos.mediaset.es/orilinear01/live/linear01/main/main.isml/main.m3u8"
    ]
  },
  {
    nombre: "La Sexta",
    web: "https://www.atresplayer.com/directo/",
    fuentes: [
      "https://livestartover.atresmedia.com/lasexta/master.m3u8",
      "http://a3live-lh.akamaihd.net/i/lasexta_1@35272/master.m3u8"
    ]
  },
  {
    nombre: "Antena 3",
    web: "https://www.atresplayer.com/directo/",
    fuentes: [
      "https://livestartover.atresmedia.com/antena3/master.m3u8",
      "http://177.10.184.193:8000/play/a06a/index.m3u8"
    ]
  },
  {
    nombre: "BOM Cine",
    web: "https://bomcine.com/",
    fuentes: [
      "https://tsw.streamingwebtv24.it:1936/inteccdn3/inteccdn3/playlist.m3u8"
    ]
  },
  {
    nombre: "Trece",
    web: "https://trece.tv/",
    fuentes: [
      "https://play.cdn.enetres.net/091DB7AFBD77442B9BA2F141DCC182F5021/021/playlist.m3u8",
      "https://play.cdn.enetres.net/091DB7AFBD77442B9BA2F141DCC182F5021/live.smil/playlist.m3u8"
    ]
  },

  /* ---------- Radio (verificadas 30-10-2026) ---------- */
  // COPE: net1 = emisión nacional (lo que emite la web de COPE).
  // "Deportes COPE" es un programa de la cadena (15:05 y 20:30), no una
  // emisora aparte; el segundo directo real de COPE es COPE Madrid.
  {
    nombre: "COPE",
    tipo: "radio",
    web: "https://www.cope.es/",
    fuentes: [
      "https://flucast09-h-cloud.flumotion.com/cope/net1.aac",
      "https://flucast-bl05.flumotion.com/cope/net1.mp3",
      "https://flucast11-o-cloud.flumotion.com/cope/net2.mp3"
    ]
  },
  {
    nombre: "COPE Madrid",
    tipo: "radio",
    web: "https://www.cope.es/emisoras/comunidad-de-madrid/madrid-provincia/madrid",
    fuentes: [
      "https://flucast-bl04.flumotion.com/cope/madrid.mp3"
    ]
  },
  {
    nombre: "Onda Cero",
    tipo: "radio",
    web: "https://www.ondacero.es/",
    fuentes: [
      "https://radio-atres-live.ondacero.es/api/livestream-redirect/OCAAC.aac",
      "https://atres-live.ondacero.es/live/ondacero/bitrate_1.m3u8"
    ]
  },
  // La "segunda emisión" de Onda Cero es el canal de eventos
  // (retransmisiones puntuales; suena programación normal cuando no hay evento).
  {
    nombre: "Onda Cero Eventos",
    tipo: "radio",
    web: "https://www.ondacero.es/",
    fuentes: [
      "https://atres-live.ondacero.es/live/ondaceroeventos1/bitrate_1.m3u8"
    ]
  },
  {
    nombre: "Capital Radio",
    tipo: "radio",
    web: "https://www.capitalradio.es/",
    fuentes: [
      "https://mdstrm.com/audio/67d2a8685ae4234de49e40f6/live.m3u8"
    ]
  },
  {
    nombre: "Intereconomía",
    tipo: "radio",
    web: "https://www.intereconomia.com/",
    fuentes: [
      "https://intereconomia.emitironline.com/",
      "https://streaming.intereconomia.com/siliconorg"
    ]
  }
];
