// get the canvas
const gameBoard = document.querySelector("#gameBoard");
// To paint on the canvas, we need to context(ctx)
const ctx = gameBoard.getContext("2d");
// get width and height attributes of the gameBoard(canvas) of the inline style of canvas
const gameWidth = gameBoard.width; // 500
const gameHeight = gameBoard.height; // 500
const scoreTxt = document.querySelector("#scoreTxt");
const resetBtn = document.querySelector("#resetBtn");
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red"; // It's an Apple
const unitSize = 25; // 25px
let running = false; // Initial value to false if the game is running or not
let xVelocity = unitSize; // How far we move on the x-axis every single game Tick = unitSize(we'll be moving 25 pixel on the x-axis every game Tick)
/*
  Note:
  - If xVelocity is positive we will move to the right
  - If xvelocity is negative we will move to the left
*/
let yVelocity = 0;
/* 
  we aren't moving to up or down 
  if we move down we set yVelocity to unitSize 
  if we move to up we set yVelocity to -unitSize 
*/
// food coordinates(x, y)
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
  running = true;
  scoreTxt.textContent = score;
  createFood();
  drawFood();
  nextTick();
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 75);
  } else {
    displayGameOver();
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize); // randomFood(min:0,max: 500-25=475)
  foodY = randomFood(0, gameWidth - unitSize); // randomFood(min:0,max: 500-25=475)
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head); // add head to the beginning of the snake
  // if food is eaten
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreTxt.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirection() {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0: // left border
      running = false;
      break;
    case snake[0].x >= gameWidth: // right border
      running = false;
      break;
    case snake[0].y < 0: // top border
      running = false;
      break;
    case snake[0].y >= gameHeight: // bottom border
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;
}

function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}
