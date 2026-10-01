// Configuración inicial de escena Three.js
const container = document.getElementById('canvas-container');
const startScreen = document.getElementById('start-screen');
const btnDescubrir = document.getElementById('btn-descubrir');
const headerTitle = document.getElementById('header-title');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Controles interactivos de cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;
controls.maxDistance = 120;
controls.minDistance = 10;

camera.position.z = 50;

// Lista de etiquetas / virtudes flotantes
const palabras = [
  "Sueños", "Libertad", "Velocidad", "Pasión", "Fuerza",
  "Rueda", "Destino", "Especial", "Único", "Campeón",
  "Espectador", "Garaje", "Fiesta", "Turbo", "Esperanza",
  "Mágica", "Aventura", "Noche", "Ruta", "Camino"
];

// URLs de imágenes locales. Cada archivo está en assets/images/ y se carga con rutas relativas válidas.
const imageUrls = [
  'assets/images/hotwheels-1.png',
  'assets/images/hotwheels-2.png',
  'assets/images/hotwheels-3.png',
  'assets/images/hotwheels-4.png'
];

const textureLoader = new THREE.TextureLoader();
const universeGroup = new THREE.Group();
scene.add(universeGroup);

// Crear partículas de fondo (estrellas)
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1000;
const starPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 300;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0x00ffcc, size: 0.8, transparent: true, opacity: 0.6 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Generar elementos flotantes de motos
const itemCount = 50;
for (let i = 0; i < itemCount; i++) {
  const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
  const texture = textureLoader.load(randomImage);

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(material);

  // Posicionamiento en espiral tipo galaxia 3D
  const radius = 12 + Math.random() * 45;
  const theta = Math.random() * Math.PI * 2;
  const phi = (Math.random() - 0.5) * Math.PI;

  sprite.position.x = radius * Math.cos(theta) * Math.cos(phi);
  sprite.position.y = radius * Math.sin(phi);
  sprite.position.z = radius * Math.sin(theta) * Math.cos(phi);

  const scale = 4 + Math.random() * 5;
  sprite.scale.set(scale, scale, 1);

  universeGroup.add(sprite);
}

// Generar texto 2D flotante en Canvas
function createTextSprite(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.font = 'Bold 28px "Segoe UI", sans-serif';
  ctx.fillStyle = '#00ffcc';
  ctx.shadowColor = '#00ffcc';
  ctx.shadowBlur = 10;
  ctx.textAlign = 'center';
  ctx.fillText(text, 128, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(8, 2, 1);
  return sprite;
}

// Agregar palabras flotantes
palabras.forEach(palabra => {
  const textSprite = createTextSprite(palabra);
  const radius = 15 + Math.random() * 40;
  const theta = Math.random() * Math.PI * 2;
  const phi = (Math.random() - 0.5) * Math.PI;

  textSprite.position.x = radius * Math.cos(theta) * Math.cos(phi);
  textSprite.position.y = radius * Math.sin(phi);
  textSprite.position.z = radius * Math.sin(theta) * Math.cos(phi);

  universeGroup.add(textSprite);
});

// Bucle de animación 3D
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  starField.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

// Transición interactiva al hacer clic
btnDescubrir.addEventListener('click', () => {
  startScreen.style.opacity = '0';
  setTimeout(() => {
    startScreen.style.visibility = 'hidden';
    headerTitle.style.opacity = '1';
  }, 1200);
});

// Responsive Design
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
