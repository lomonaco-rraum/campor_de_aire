let zonas;
let zonaActiva = null;
let audio = null;

function preload() {
  zonas = loadJSON('map.geojson',
    () => console.log("✅ GeoJSON cargado correctamente"),
    () => console.log("❌ Error al cargar el GeoJSON")
  );
}

function setup() {
  noCanvas();
}

function iniciarExperiencia() {
  document.getElementById("pantalla-inicial").style.display = "none";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const punto = [pos.coords.longitude, pos.coords.latitude];
      zonaActiva = buscarZona(punto);
      if (zonaActiva) {
        mostrarSubportada(zonaActiva.properties);
      } else {
        mostrarMensajeFueraDeZona();
      }
    }, err => {
      console.log("❌ Error al obtener ubicación", err);
    });
  }
}

function buscarZona(punto) {
  for (let i = 0; i < zonas.features.length; i++) {
    let poligono = zonas.features[i].geometry;
    if (turf.booleanPointInPolygon(punto, poligono)) {
      return zonas.features[i];
    }
  }
  return null;
}

function mostrarSubportada(props) {
  document.getElementById("subportada").style.display = "flex";
  document.getElementById("titulo-zona").textContent = props.titulo;
}

function mostrarContenidoFinal() {
  if (!zonaActiva) return;

  document.getElementById("subportada").style.display = "none";
  document.getElementById("contenido-curatorial").style.display = "block";

  const props = zonaActiva.properties;

  const video = document.getElementById("video");
  video.src = props.video;
  video.load();
  video.play();
}

function mostrarMensajeFueraDeZona() {
  document.getElementById("mensaje-fuera").style.display = "block";
}