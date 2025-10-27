let zonas;
let video, imagen, texto, titulo;

function setup() {
  noCanvas();
  titulo = select('#titulo');
  video = select('#video').elt;
  imagen = select('#imagen').elt;
  texto = select('#texto');

  zonas = loadJSON('map.geojson', () => {
    console.log("✅ GeoJSON cargado correctamente");
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      verificarZona(lat, lon);
    });
  });
}

function verificarZona(lat, lon) {
  for (let feature of zonas.features) {
    if (dentroDelPoligono([lon, lat], feature.geometry.coordinates[0])) {
      mostrarZona(feature.properties);
      return;
    }
  }
  console.log("❌ No estás dentro de ninguna zona.");
}

function dentroDelPoligono(punto, poligono) {
  let x = punto[0], y = punto[1];
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    let xi = poligono[i][0], yi = poligono[i][1];
    let xj = poligono[j][0], yj = poligono[j][1];
    let intersecta = ((yi > y) !== (yj > y)) &&
                     (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersecta) dentro = !dentro;
  }
  return dentro;
}

function mostrarZona(props) {
  titulo.html(props.titulo);
  video.src = props.video;
  video.load();
  video.play();

  imagen.src = props.imagen;

  fetch(props.texto)
    .then(res => res.text())
    .then(data => {
      texto.html(data);
    });
}