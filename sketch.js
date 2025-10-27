let zonas;
let video, audio, texto, titulo, imagen;
let portada, zonaDetectada, contenido, multimedia;
let btnConocer, btnImagenes;

function setup() {
  noCanvas();
  titulo = select('#titulo');
  imagen = select('#imagen').elt;
  video = select('#video').elt;
  audio = select('#audio').elt;
  texto = select('#texto');
  portada = select('#pantalla-inicial');
  zonaDetectada = select('#zona-detectada');
  contenido = select('#contenido-curatorial');
  multimedia = select('#multimedia');
  btnConocer = select('#btn-conocer');
  btnImagenes = select('#btn-imagenes');

  portada.mousePressed(() => {
    portada.hide();
    loadJSON('map.geojson', data => {
      zonas = data;
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        verificarZona(lat, lon);
      }, err => {
        titulo.html("No se pudo obtener tu ubicación.");
        zonaDetectada.show();
      });
    });
  });

  btnConocer.mousePressed(() => {
    zonaDetectada.style('display', 'none');
    contenido.style('display', 'flex');
  });

  btnImagenes.mousePressed(() => {
    contenido.style('display', 'none');
    multimedia.style('display', 'flex');
    video.play();
    audio.play();
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
  zonaDetectada.show();
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
  zonaDetectada.style('display', 'flex');

  video.src = props.video || "";
  video.load();
  audio.src = props.audio || props.video.replace('.mp4', '.wav');
  audio.load();

  fetch(props.texto)
    .then(res => res.text())
    .then(data => {
      texto.html(data);
    });
}