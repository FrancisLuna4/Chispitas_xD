const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

document.body.style.backgroundColor = "white";

const playerWidth = 50;
const playerHeight = 50;
let playerX = 100;
let playerY = canvas.height - playerHeight - 50;
let playerSpeed = 5;
let playerImage = new Image();
playerImage.src = "personaje.jpg";

let heartWidth = 30;
let heartHeight = 30;
let hearts = [];
let heartsCollected = 0;
let heartImage = new Image();
heartImage.src = "chokomilk.jpeg";

let enemies = [];
let enemyImage = new Image();
enemyImage.src = "enemigo.jpeg";
const enemyWidth = 40;
const enemyHeight = 40;

let lasers = [];
const laserSpeed = 8;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let gameFinished = false;
let finalAnimationStarted = false;
let finalAnimationOpacity = 0; // Controla la opacidad de la animación final

const regalo = new Image();
regalo.src = "regalo.jpeg";

let imageToDisplay = null;
let imageTimeout = null;

const temporaryImageSettings = {
  duration: 2000,
  opacity: 0.8,
  x: canvas.width - 850,
  y: 20,
  width: 900,
  height: 300
};

function movePlayer() {
  if (moveLeft && playerX > 0) playerX -= playerSpeed;
  if (moveRight && playerX < canvas.width - playerWidth) playerX += playerSpeed;
  if (moveUp && playerY > 0) playerY -= playerSpeed;
  if (moveDown && playerY < canvas.height - playerHeight) playerY += playerSpeed;
}

function createHeart() {
  if (!gameFinished && heartsCollected < 15) {
    const heartX = Math.random() * (canvas.width - heartWidth);
    const heartY = Math.random() * (canvas.height - heartHeight);
    hearts.push({ x: heartX, y: heartY });
  }
}

function createEnemy() {
  if (!gameFinished && heartsCollected >= 3 && heartsCollected < 15) {
    const enemyX = Math.random() * (canvas.width - enemyWidth);
    enemies.push({ x: enemyX, y: 0, speed: 2 });
  }
}

function showCollectedHeartImage(index) {
  let img = new Image();
  switch (index) {
    case 1: img.src = "laimagen1.jpg"; break;
    case 2: img.src = "iman2.jpg"; break;
    case 3: img.src = "florida3.jpg"; break;
    case 4: img.src = "queteimporta4.jpg"; break;
    case 5: img.src = "amoaminovia5.jpg"; break;
    case 6: img.src = "gorillaz6.jpg"; break;
    case 7: img.src = "blur7.jpg"; break;
    case 8: img.src = "ano8.jpg"; break;
    case 9: img.src = "2anos9.jpg"; break;
    case 10: img.src = "noce10.jpg"; break;
    case 15: img.src = "regalo.jpeg"; break;
    default: return;
  }

  img.onload = () => {
    imageToDisplay = img;
    clearTimeout(imageTimeout);
    if (index !== 15) {
      imageTimeout = setTimeout(() => {
        imageToDisplay = null;
      }, temporaryImageSettings.duration);
    }
  };
}

function collectHearts() {
  for (let i = 0; i < hearts.length; i++) {
    const h = hearts[i];
    if (
      playerX < h.x + heartWidth &&
      playerX + playerWidth > h.x &&
      playerY < h.y + heartHeight &&
      playerY + playerHeight > h.y
    ) {
      hearts.splice(i, 1);
      heartsCollected++;
      showCollectedHeartImage(heartsCollected);
      if (heartsCollected >= 15) {
        startFinalAnimation();
      }
      break;
    }
  }
}

function startFinalAnimation() {
  gameFinished = true;
  finalAnimationStarted = true;
  // Comienza la animación de aparición de la imagen "regalo.jpeg"
  let fadeInInterval = setInterval(() => {
    if (finalAnimationOpacity < 1) {
      finalAnimationOpacity += 0.02; // Aumenta la opacidad gradualmente
    } else {
      clearInterval(fadeInInterval); // Detiene el proceso cuando la imagen está completamente visible
    }
  }, 50);

  // Desaparecer enemigos al empezar la animación
  enemies = [];
}

function shootLaser() {
  if (!gameFinished && heartsCollected >= 3) {
    lasers.push({
      x: playerX + playerWidth / 2 - 2,
      y: playerY,
      width: 4,
      height: 20
    });
  }
}

function drawPlayer() {
  ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

function drawHearts() {
  for (let i = 0; i < hearts.length; i++) {
    ctx.drawImage(heartImage, hearts[i].x, hearts[i].y, heartWidth, heartHeight);
  }
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    ctx.drawImage(enemyImage, e.x, e.y, enemyWidth, enemyHeight);
    e.y += e.speed;

    if (
      playerX < e.x + enemyWidth &&
      playerX + playerWidth > e.x &&
      playerY < e.y + enemyHeight &&
      playerY + playerHeight > e.y
    ) {
      document.location.reload();
    }
  }
}

function drawLasers() {
  for (let i = 0; i < lasers.length; i++) {
    const l = lasers[i];
    ctx.fillStyle = "red";
    ctx.fillRect(l.x, l.y, l.width, l.height);
    l.y -= laserSpeed;
  }
  lasers = lasers.filter(l => l.y > 0);
}

function checkLaserHits() {
  for (let i = 0; i < lasers.length; i++) {
    const l = lasers[i];
    for (let j = 0; j < enemies.length; j++) {
      const e = enemies[j];
      if (
        l.x < e.x + enemyWidth &&
        l.x + l.width > e.x &&
        l.y < e.y + enemyHeight &&
        l.y + l.height > e.y
      ) {
        enemies.splice(j, 1);
        lasers.splice(i, 1);
        break;
      }
    }
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Chokomilks recogidos: " + heartsCollected, 10, 30);
}

function update() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Mostrar la imagen "regalo.jpeg" lentamente con opacidad
  if (finalAnimationStarted) {
    ctx.globalAlpha = finalAnimationOpacity;
    ctx.drawImage(regalo, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    return;
  }

  // Aquí se dibujan las imágenes de los corazones recogidos por debajo de los personajes y enemigos
  if (imageToDisplay && heartsCollected < 15) {
    ctx.globalAlpha = temporaryImageSettings.opacity;
    // Dibujamos la imagen en la parte inferior, por encima del fondo, pero por debajo de los personajes y enemigos
    ctx.drawImage(
      imageToDisplay,
      temporaryImageSettings.x,
      temporaryImageSettings.y,
      temporaryImageSettings.width,
      temporaryImageSettings.height
    );
    ctx.globalAlpha = 1.0;
  }

  movePlayer();
  collectHearts();
  drawHearts();
  drawEnemies();
  drawLasers();
  checkLaserHits();
  drawPlayer();
  drawScore();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveLeft = true;
  if (event.key === "ArrowRight") moveRight = true;
  if (event.key === "ArrowUp") moveUp = true;
  if (event.key === "ArrowDown") moveDown = true;
  if (event.key === " " || event.key === "Spacebar") shootLaser();
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") moveLeft = false;
  if (event.key === "ArrowRight") moveRight = false;
  if (event.key === "ArrowUp") moveUp = false;
  if (event.key === "ArrowDown") moveDown = false;
});

setInterval(createHeart, 2000);
setInterval(createEnemy, 3000);

function gameLoop() {
  update();
  if (finalAnimationOpacity < 1) {
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();
