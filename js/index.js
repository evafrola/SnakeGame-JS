//HTML Elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const highScoreBoard = document.getElementById("highScoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

//Game settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2,
};
const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};

//Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquare;
let moveInterval;
let timerInterval; //Time start the game
let highScore = localStorage.getItem("highScore");

//Function to draw snake
function drawSnake() {
  snake.forEach((square) => drawSquare(square, "snakeSquare"));
}

//Function to draw square
function drawSquare(square, type) {
  const [row, column] = square.split("");
  boardSquares[row][column] = squareTypes[type];

  //Add in to the html
  const squareElement = document.getElementById(square);
  squareElement.setAttribute("class", `square ${type}`);

  if (type === "emptySquare") {
    emptySquare.push(square);
  } else {
    if (emptySquare.indexOf(square) !== -1) {
      emptySquare.splice(emptySquare.indexOf(square), 1);
    }
  }
}

//Function to move snake
function moveSnake() {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0");
  const [row, column] = newSquare.split("");
  if (
    newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === "ArrowRight" && column == 0) ||
    (direction === "ArrowLeft" && column == 9) ||
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    gameOver();
  } else {
    snake.push(newSquare);

    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, "emptySquare");
    }

    drawSnake();
  }
}

//Function to score increase for adding food
function addFood() {
  score++;
  updateScore();
  createRandomFood();
}

//Function alert game over
function gameOver() {
  gameOverSign.style.display = "block";
  clearInterval(moveInterval);
  updateHighScore();
  startButton.disabled = false;
}

//Function to set a new direction
function setDirection(newDirection) {
  direction = newDirection;
}

//Function to move snake in the board
function directionEvent(key) {
  switch (key.code) {
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowLeft" && setDirection(key.code);
      break;
  }
}

//Function to create food on the board randomly
function createRandomFood() {
  const randomEmptySquare =
    emptySquare[Math.floor(Math.random() * emptySquare.length)];
  drawSquare(randomEmptySquare, "foodSquare");
}

//Function to update the high score
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  highScoreBoard.innerHTML = highScore;
}

//Function to update score the game
function updateScore() {
  scoreBoard.innerHTML = score;
}

//Function to create board game
function createBoard() {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquare.push(squareValue);
    });
  });
}

//Function to restart the game
function setGame() {
  snake = ["00", "01", "02", "03"];
  score = snake.length;
  direction = "ArrowRight";
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );
  board.innerHTML = "";
  emptySquare = [];
  createBoard();
}

//Function alert starting game
function alertStarting() {
  Swal.fire({
    title: "The game will start!",
    html: "Start in: <b></b> seconds.",
    timer: 5000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    //When the alert ends the game is run
    if (result.dismiss === Swal.DismissReason.timer) {
      drawSnake();
      updateScore();
      updateHighScore();
      createRandomFood();
      //User keyboard event to move snake
      document.addEventListener("keydown", directionEvent);
      //Move the snake in the interval established
      moveInterval = setInterval(() => moveSnake(), gameSpeed);
    }
  });
}

//Function to start the game
function startGame() {
  setGame();
  gameOverSign.style.display = "none";
  startButton.disabled = true;
  alertStarting();
}

// Event to start the game with countdown
startButton.addEventListener("click", startGame);

//Event to loaded high score
document.addEventListener("DOMContentLoaded", updateHighScore);
