let zonas;
let video, imagen, texto, titulo;
let portada, contenido;

function setup() {
  noCanvas();
  titulo = select('#titulo');
  video = select('#video').elt;
  imagen = select('#imagen').elt;
  texto = select('#texto');
  portada = select('#pantalla-inicial');
  contenido = select('#contenido-curatorial');

  portada.mousePressed(() => {
    portada.hide();
    contenido.show();

    loadJSON('map.geojson', data => {
      zonas = data;
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        verificarZona(lat, lon);
      }, err => {
        titulo.html("No se pudo obtener tu ubicación.");
      });
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
  titulo.html("No estás dentro de ninguna zona activa.");
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
  titulo.html(props.titulo || "Zona activa");
  imagen.src = props.imagen || "assets/default.jpg";
  video.src = props.video || "";
  video.load();
  video.style.display = 'none';
  texto.html('');

  document.body.onclick = () => {
    video.style.display = 'block';
    video.play();

    fetch(props.texto)
      .then(res => res.text())
      .then(data => {
        texto.html(data);
      });
  };
}