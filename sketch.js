let sonido;
let zonas;

function preload() {
  sonido = loadSound('voz2.wav'); // asegurate que el archivo esté en la raíz
  zonas = loadJSON('zonas_de_aire.geojson'); // nombre exacto del archivo GeoJSON
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245);
  noLoop();

  // Visualización de zonas sensibles
if (zonas && zonas.features) {
  for (let i = 0; i < zonas.features.length; i++) {
    let coords = zonas.features[i].geometry.coordinates[0]; // primer anillo del polígono
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
  // Visualidad pulsante
  fill(160, 200, 255, 100);
  ellipse(width / 2, height / 2, sin(frameCount * 0.05) * 50 + 100);
}

function iniciarExperiencia() {
  document.getElementById("pantalla-inicial").style.display = "none";
  userStartAudio();
  sonido.play();
  loop();
}