let zonas;
let video, audio, texto, titulo, imagen;
let portada, zonaDetectada, contenido, multimedia;
let btnConocer, btnImagenes;

function setup() {
  noCanvas();

  // Elementos del DOM
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

  // Etapa 1: portada → detectar zona
  portada.mousePressed(() => {
    portada.hide();

    loadJSON('map.geojson', data => {
      zonas = data;

      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        verificarZona(lat, lon);
      }, err => {
        mostrarMensajeFueraDeZona();
      });
    });
  });

  // Etapa 2 → 3: mostrar texto curatorial
  btnConocer.mousePressed(() => {
    zonaDetectada.style('display', 'none');
    contenido.style('display', 'flex');
  });

  // Etapa 3 → 4: mostrar video (sin activar audio)
  btnImagenes.mousePressed(() => {
    contenido.style('display', 'none');
    multimedia.style('display', 'flex');
    video.play();
  });
}

function verificarZona(lat, lon) {
  for (let feature of zonas.features) {
    if (dentroDelPoligono([lon, lat], feature.geometry.coordinates[0])) {
      mostrarZona(feature.properties);
      return;
    }
  }

  mostrarMensajeFueraDeZona();
}

function mostrarMensajeFueraDeZona() {
  titulo.html("No estás dentro de ninguna zona activa.");

  // Ocultar imagen si no hay zona activa
  imagen.style.display = 'none';

  zonaDetectada.style('display', 'flex');

  // Agregar subtítulo final
  const subtituloFinal = createP("Intenta en otro sitio para acceder a la experiencia");
  subtituloFinal.parent(zonaDetectada);
  subtituloFinal.style('margin-top', '1em');
  subtituloFinal.style('font-family', 'Cutive Mono');
  subtituloFinal.style('font-size', '1em');
  subtituloFinal.style('color', '#444');

  // Ocultar botón "Conocer más"
  btnConocer.hide();
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
  // Etapa 2: mostrar título e imagen
  titulo.html(props.titulo || "Zona activa");

  // Mostrar imagen solo si hay zona activa
  imagen.src = props.imagen || "assets/default.jpg";
  imagen.style.display = 'block';

  zonaDetectada.style('display', 'flex');

  // Reproducir audio en esta etapa
  audio.src = props.audio || props.video.replace('.mp4', '.wav');
  audio.load();
  audio.play();

  // Preparar video para etapa 4
  video.src = props.video || "";
  video.load();

  // Cargar texto curatorial para etapa 3
  fetch(props.texto)
    .then(res => res.text())
    .then(data => {
      texto.html(data);
    });
}