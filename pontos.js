// Pontos mapeados pelo app: prédios do mapa do enunciado + anfiteatro.
// Fonte: centro de cada prédio no OpenStreetMap (campus Prof. Pedro C. Fornari,
// Av. Dr. Adoniro Ladeira, Jundiaí). A Biblioteca não tem nome no OSM; é o prédio
// colado ao Prédio 2, como no mapa do enunciado.
const PONTOS = [
  { nome: "Prédio 1",              lat: -23.214412, lon: -46.891534 },
  { nome: "Prédio 2",              lat: -23.212863, lon: -46.892935 },
  { nome: "Prédio 3",              lat: -23.213953, lon: -46.892904 },
  { nome: "Prédio 4",              lat: -23.214494, lon: -46.893442 },
  { nome: "Biblioteca",            lat: -23.213193, lon: -46.892648 },
  { nome: "Prédio Administrativo", lat: -23.213798, lon: -46.892063 },
  { nome: "Anfiteatro",            lat: -23.215327, lon: -46.891176 },
];

// Ponto único usado quando você está longe (centro dos prédios acima)
const CAMPUS = {
  nome: "UniAnchieta",
  lat: PONTOS.reduce((s, p) => s + p.lat, 0) / PONTOS.length,
  lon: PONTOS.reduce((s, p) => s + p.lon, 0) / PONTOS.length,
};

// A partir desta distância do campus, mostra só o pino "UniAnchieta"
const DISTANCIA_SEPARAR_PREDIOS = 1000;   // metros

// Distância em metros entre duas coordenadas (fórmula de Haversine)
function distanciaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
