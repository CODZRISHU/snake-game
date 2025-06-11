const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const startPopup = document.getElementById("startPopup");
const gameOverPopup = document.getElementById("gameOverPopup");
const finalScoreEl = document.getElementById("finalScore");
const finalTimeEl = document.getElementById("finalTime");

let gridSize = 20;
let snake = [];
let direction = {};
let food = {};
let score = 0;
let seconds = 0;
let gameOver = false;
let gameInterval;
let timerInterval;

function startGame() {
  // Hide start popup
  startPopup.style.display = "none";

  // Initialize values
  snake = [{ x: 160, y: 200 }];
  direction = { x: 1, y: 0 };
  food = spawnFood();
  score = 0;
  seconds = 0;
  gameOver = false;
  scoreEl.textContent = score;
  timerEl.textContent = seconds;

  // Start game loop and timer
  gameInterval = setInterval(draw, 150);
  timerInterval = setInterval(() => {
    if (!gameOver) {
      seconds++;
      timerEl.textContent = seconds;
    }
  }, 1000);
}

function draw() {
  if (gameOver) return;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2.5, 0, 2 * Math.PI);
  ctx.fill();

  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize,
  };

  if (isCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.beginPath();
    ctx.roundRect(snake[i].x, snake[i].y, gridSize, gridSize, 5);
    ctx.fill();
  }
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};

function isCollision(head) {
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height
  ) return true;

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) return true;
  }
  return false;
}

function spawnFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  } while (snake.some(part => part.x === x && part.y === y));
  return { x, y };
}

function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  finalScoreEl.textContent = score;
  finalTimeEl.textContent = seconds;
  gameOverPopup.style.display = "flex";
}

function resetGame() {
  gameOverPopup.style.display = "none";
  startGame();
}

document.addEventListener("keydown", (e) => {
  if ((e.key === "ArrowUp" || e.key === "w") && direction.y === 0)
    direction = { x: 0, y: -1 };
  else if ((e.key === "ArrowDown" || e.key === "s") && direction.y === 0)
    direction = { x: 0, y: 1 };
  else if ((e.key === "ArrowLeft" || e.key === "a") && direction.x === 0)
    direction = { x: -1, y: 0 };
  else if ((e.key === "ArrowRight" || e.key === "d") && direction.x === 0)
    direction = { x: 1, y: 0 };
});
