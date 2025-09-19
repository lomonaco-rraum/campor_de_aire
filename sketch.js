let sonido;
let zonas;

function preload() {
  console.log("Preload iniciado");
   sonido = loadSound('voz2.wav'); // desactivado para testeo
   zonas = loadJSON('zonas_de_aire.geojson'); // desactivado para testeo
}

function setup() {
  console.log("Setup iniciado");
  createCanvas(windowWidth, windowHeight);
  background(245);
  noLoop();

  // Testeo visual mínimo
  fill(0);
  textSize(24);
  text("Campos de aire está vivo", 50, 100);
}

function draw() {
  console.log("Draw ejecutado");
  background(200);
  fill(160, 200, 255, 100);
  ellipse(width / 2, height / 2, sin(frameCount * 0.05) * 50 + 100);
}

function iniciarExperiencia() {
  console.log("Botón activado");
  document.getElementById("pantalla-inicial").style.display = "none";
   userStartAudio();
   sonido.play();
   userStartAudio ();
  loop();
}