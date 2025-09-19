let sonido;
let zonas;

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
  noLoop();
  background(255);
}

function draw() {
  // vacío: atmósfera blanca sin visualización
}

function iniciarExperiencia() {
  document.getElementById("pantalla-inicial").style.display = "none";
  getAudioContext().resume();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const punto = [pos.coords.longitude, pos.coords.latitude];
      console.log("📍 Ubicación:", punto);

      const dentro = verificarZona(punto);
      console.log("📦 Dentro de zona:", dentro);

      if (dentro) {
        sonido.setVolume(1);
        sonido.play();
        loop();
      } else {
        console.log("🚫 Fuera de zona: no se reproduce sonido");
      }
    }, err => {
      console.log("❌ Error al obtener ubicación", err);
    });
  } else {
    console.log("❌ Geolocalización no disponible");
  }
}

function verificarZona(punto) {
  for (let i = 0; i < zonas.features.length; i++) {
    let coords = zonas.features[i].geometry.coordinates[0];
    if (puntoEnPoligono(punto, coords)) {
      return true;
    }
  }
  return false;
}

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