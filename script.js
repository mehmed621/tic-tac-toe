//Factory Function for players
const createPlayer = (name, role) => {
  return { name, role };
};


//startGame IIFE
const startGame = (function(){
  let playersArr = [];
  let isGameOver;
  let currentPlayer;

  function start(){
    const player1 = createPlayer(document.querySelector("#player1").value, "X");
    const player2 = createPlayer(document.querySelector("#player2").value, "O");
    playersArr = [player1, player2];

    currentPlayer = 0;
    isGameOver = false;
    Gameboard.createBoard();
  };

  function restart(){
    for (let i = 0; i < 9; i++) {
      Gameboard.update("", i);
    }
    Gameboard.createBoard();
    document.querySelector("#declare-result").innerText = "";
    isGameOver = false;
  };


  function handleClick(event){
    if (isGameOver) {
      return;
    }

    let cellNumber = +event.target.id.split("-")[1];
    if (Gameboard.setBoard()[cellNumber] !== ""){ 
      return; 
    }

    Gameboard.update(playersArr[currentPlayer].role, cellNumber);

    if(checkForWinner(Gameboard.setBoard(), playersArr[currentPlayer].role)) {
      showResults.declare(`${playersArr[currentPlayer].name} wins!`);
      isGameOver = true;
    } else if (checkForDraw(Gameboard.setBoard())) {
      showResults.declare("It's draw!");
      isGameOver = true;
    }

    if(currentPlayer === 0){
      currentPlayer = 1;
    } else{
      currentPlayer = 0;
    }
  };

  return { start, handleClick, restart };
})();



// Gameboard IIFE
const Gameboard = (function(){
  let spots = ["", "", "", "", "", "", "", "", ""];
  const createBoard = () => {
    let boardCells = "";
    spots.forEach((spot, index) => {
      boardCells += `<div class="cell" id="spot-${index}">${spot}</div>`;
    });
    document.querySelector("#board").innerHTML = boardCells;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", startGame.handleClick);
    });
  };

  const setBoard = () => {
    return spots;
  };

  const update = (value, index) => {
    spots[index] = value;
    createBoard();
  };


  return { createBoard, setBoard, update };
})();


// Results IIFE
const showResults = (function(){
  const declare = (result) => {
    let resulth3 = document.querySelector("#declare-result")
    resulth3.innerText = result;
  };
  return { declare };
})();


//Checking for a draw
function checkForDraw(cells) {
  return cells.every((cell) => cell !== "");
}

//Checking for winner
function checkForWinner(combination) {
  const winCombinations = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];

  for (let i=0; i < winCombinations.length; i++) {
    const [a, b, c] = winCombinations[i];
    if (combination[a] && combination[a] === combination[b] && combination[a] === combination[c]) {
      return true;
    }
  }
  return false;
}


//Reset the game
const resetBtn = document.querySelector("#restart-btn");
resetBtn.addEventListener("click", startGame.restart);

//Start the game
const startBtn = document.querySelector("#start-btn");
startBtn.addEventListener("click", startGame.start);
