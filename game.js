const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.75;

// =====================
// IMÁGENES
// =====================
const playerImg = new Image();
playerImg.src = "assets/jin-cube.jpg";

const itemImg = new Image();
itemImg.src = "assets/bt21.png";

// =====================
// HUD
// =====================
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const pauseBtn = document.getElementById("pauseBtn");

// =====================
// ESTADO DEL JUEGO
// =====================
let score = 0;
let lives = 3;
let gameOver = false;
let paused = false;

// =====================
// DIFICULTAD PROGRESIVA
// =====================
let baseItemSpeed = 4;
const speedIncreaseEvery = 20;
const speedIncrement = 1;

// =====================
// PERSONAJE
// =====================
const player = {
  width: 60,
  height: 60,
  x: canvas.width / 2 - 30,
  y: canvas.height - 80,
  speed: 7
};

// =====================
// OBJETOS
// =====================
let items = [];

// =====================
// CONTROLES
// =====================
let moveLeft = false;
let moveRight = false;

// =====================
// FUNCIONES
// =====================

// Crear objeto
function createItem() {
  if (paused || gameOver) return;

  items.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    speed: baseItemSpeed + Math.random() * 2
  });
}

// Colisiones
function isColliding(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.width > b.x &&
    a.y < b.y + b.size &&
    a.y + a.height > b.y
  );
}

// Pausa
function togglePause() {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶" : "⏸";
}

// Dibujar jugador
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Dibujar objetos
function drawItems() {
  items.forEach(item => {
    ctx.drawImage(itemImg, item.x, item.y, item.size, item.size);
  });
}

// Actualizar lógica
function update() {
  if (gameOver || paused) return;

  // Movimiento
  if (moveLeft) player.x -= player.speed;
  if (moveRight) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Objetos
  items.forEach((item, index) => {
    item.y += item.speed;

    // Colisión
    if (isColliding(player, item)) {
      score++;
      scoreEl.textContent = score;

      // Aumentar dificultad cada 20 puntos
      if (score % speedIncreaseEvery === 0) {
        baseItemSpeed += speedIncrement;
      }

      items.splice(index, 1);
    }

    // Falló
    if (item.y > canvas.height) {
      lives--;
      livesEl.textContent = lives;
      items.splice(index, 1);

      if (lives <= 0) {
        gameOver = true;
        alert(`💀 Game Over\nPuntaje: ${score}`);
        location.reload();
      }
    }
  });
}

// Loop principal
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawItems();
  update();

  // Pantalla de pausa
  if (paused) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSA", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

// =====================
// CONTROLES
// =====================

// Teclado
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    togglePause();
    return;
  }

  if (paused) return;

  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// Botón pausa
pauseBtn.addEventListener("click", togglePause);

// Controles táctiles
document.getElementById("leftBtn").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("leftBtn").addEventListener("touchend", () => moveLeft = false);

document.getElementById("rightBtn").addEventListener("touchstart", () => moveRight = true);
document.getElementById("rightBtn").addEventListener("touchend", () => moveRight = false);

// =====================
// SPAWNER
// =====================
setInterval(createItem, 1000);

// =====================
// INICIAR
// =====================
gameLoop();
