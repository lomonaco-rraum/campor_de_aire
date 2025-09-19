let sonido;
let zonas;
let dentroDeZona = false;

function preload() {
  sonido = loadSound('voz2.wav',
    () => console.log("✅ Sonido cargado correctamente"),
    () => console.log("❌ Error al cargar el sonido")
  );

  zonas = loadJSON('zonas_de_aire.geojson',
    () => console.log("✅ GeoJSON cargado correctamente"),
    () => console.log("❌ Error al cargar el GeoJSON")
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245);
  noLoop();

  // Visualización de zonas (opcional)
  if (zonas && zonas.features) {
    for (let i = 0; i < zonas.features.length; i++) {
      let coords = zonas.features[i].geometry.coordinates[0];
      beginShape();
      for (let j = 0; j < coords.length; j++) {
        let lon = coords[j][0];
        let lat = coords[j][1];
        let x = map(lon, -180, 180, 0, width);
        let y = map(lat, -90, 90, height, 0);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  }
}

function draw() {
  background(245);
  noStroke();
  fill(160, 200, 255, 100);
  ellipse(width / 2, height / 2, sin(frameCount * 0.05) * 50 + 100);
}

function iniciarExperiencia() {
  document.getElementById("pantalla-inicial").style.display = "none";
  getAudioContext().resume();

  // Obtener ubicación del espectador
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      dentroDeZona = verificarZona(lat, lon);

      if (dentroDeZona) {
        console.log("✅ Dentro de zona");
        sonido.setVolume(1);
        sonido.play();
        loop();
      } else {
        console.log("🚫 Fuera de zona");
      }
    }, err => {
      console.log("❌ Error al obtener ubicación", err);
    });
  } else {
    console.log("❌ Geolocalización no disponible");
  }
}

// Verifica si el punto está dentro de alguna zona del GeoJSON
function verificarZona(lat, lon) {
  for (let i = 0; i < zonas.features.length; i++) {
    let coords = zonas.features[i].geometry.coordinates[0];
    if (puntoEnPoligono([lon, lat], coords)) {
      return true;
    }
  }
  return false;
}

// Algoritmo clásico para verificar si un punto está dentro de un polígono
function puntoEnPoligono(punto, poligono) {
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