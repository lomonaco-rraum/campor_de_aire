let sonido;
let zonas;

function preload() {
  // Carga del sonido con verificación
  sonido = loadSound('voz2.wav', 
    () => console.log("✅ Sonido cargado correctamente"), 
    () => console.log("❌ Error al cargar el sonido")
  );

  // Carga del archivo GeoJSON con verificación
  zonas = loadJSON('zonas_de_aire.geojson', 
    () => console.log("✅ GeoJSON cargado correctamente"), 
    () => console.log("❌ Error al cargar el GeoJSON")
  );
}

function setup() {
  console.log("🎨 Canvas creado");
  createCanvas(windowWidth, windowHeight);
  background(245);
  noLoop();

  // Visualización de zonas sensibles como polígonos
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
  console.log("🌀 Visualidad pulsante activa");
  background(245);
  fill(160, 200, 255, 100);
  ellipse(width / 2, height / 2, sin(frameCount * 0.05) * 50 + 100);
}

function iniciarExperiencia() {
  console.log("🔊 Botón activado, atmósfera desplegada");
  document.getElementById("pantalla-inicial").style.display = "none";
  userStartAudio(); // Asegurate de tener p5.sound cargado en index.html
  sonido.setVolume(1);
  sonido.play();
  loop();
}