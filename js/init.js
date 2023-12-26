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
    html: "<b></b> milliseconds",
    timer: 4500,
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
