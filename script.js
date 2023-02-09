const gameBoard = () => {
  const b = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  return { b };
};

function newGame() {
  const buttons = document.getElementsByClassName("grid");
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].innerText = "";
    buttons[i].classList.remove("clicked");
  }
  newBoard = gameBoard();
}

class Move {
  constructor() {
    let row;
    let col;
  }
}

const players = (() => {
  const player = "X";
  const opponent = "O";
  const chooseX = document.getElementById("chooseX");
  chooseX.classList.add("chosen");
  chooseX.addEventListener("click", () => {
    players.player = "X";
    players.opponent = "O";
    chooseX.classList.add("chosen");
    chooseO.classList.remove("chosen");
    newGame();
  });
  const chooseO = document.getElementById("chooseO");
  chooseO.addEventListener("click", () => {
    players.player = "O";
    players.opponent = "X";
    chooseO.classList.add("chosen");
    chooseX.classList.remove("chosen");
    newGame();
  });
  return { player, opponent };
})();

let newBoard = gameBoard();

const showWinner = (status) => {
  document.querySelector("h2").innerText = `${status}`;
  const modal = document.querySelector("#modal");
  modal.showModal();
  const closeModal = document.querySelector(".close-button");
  closeModal.addEventListener("click", () => {
    modal.close();
    newGame();
    newBoard = gameBoard();
  });
};

function isMovesLeft(board) {
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[i][j] !== "X" && board[i][j] !== "O") return true;
  return false;
}

function evaluate(b) {
  for (let row = 0; row < 3; row += 1) {
    if (b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
      if (b[row][0] === players.player) {
        return +10;
      }
      if (b[row][0] === players.opponent) {
        return -10;
      }
    }
  }
  for (let col = 0; col < 3; col += 1) {
    if (b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
      if (b[0][col] === players.player) {
        return +10;
      }
      if (b[0][col] === players.opponent) {
        return -10;
      }
    }
  }
  if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    if (b[0][0] === players.player) {
      return +10;
    }
    if (b[0][0] === players.opponent) {
      return -10;
    }
  }
  if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    if (b[0][2] === players.player) {
      return +10;
    }
    if (b[0][2] === players.opponent) {
      return -10;
    }
  }
  return 0;
}

function checkWin() {
  if (evaluate(newBoard.b) === 10) {
    showWinner("You won!");
    return true;
  }
  if (evaluate(newBoard.b) === -10) {
    showWinner("You lost!");
    return true;
  }
  if (!isMovesLeft(newBoard.b)) {
    showWinner("Draw!");
    return true;
  }
  return false;
}

const clickButton = (() => {
  const buttons = document.querySelectorAll("button.grid");
  buttons.forEach((button) =>
    addEventListener("click", (e) => {
      if (e.target === button && !e.target.classList.contains("clicked")) {
        e.target.innerText = players.player;
        e.target.classList.add("clicked");
        updateBoard(
          e.target.dataset.column,
          e.target.dataset.row,
          players.player
        );
        if (!checkWin() && isMovesLeft(newBoard.b)) opponentMove();
        checkWin();
      }
    })
  );
})();

function updateBoard(column, row, mark) {
  newBoard.b[row][column] = mark;
}

function opponentMove() {
  const tempBoard = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      if (newBoard.b[i][j] === "X") tempBoard[i][j] = "O";
      else if (newBoard.b[i][j] === "O") tempBoard[i][j] = "X";
    }
  }
  const bestMove = findBestMove(tempBoard);
  const grid = document.getElementsByClassName("grid");
  updateBoard(bestMove.col, bestMove.row, players.opponent);
  grid[3 * bestMove.row + bestMove.col].innerText = players.opponent;
  grid[3 * bestMove.row + bestMove.col].classList.add("clicked");
}

function minimax(board, depth, isMax) {
  const score = evaluate(board);
  if (score == 10) return score;
  if (score == -10) return score;
  if (isMovesLeft(board) == false) return 0;
  if (isMax) {
    let best = -1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] !== "X" && board[i][j] !== "O") {
          const temp = board[i][j];
          board[i][j] = players.player;
          best = Math.max(best, minimax(board, depth + 1, !isMax));
          board[i][j] = temp;
        }
      }
    }
    return best;
  }
  let best = 1000;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] !== "X" && board[i][j] !== "O") {
        const temp = board[i][j];
        board[i][j] = players.opponent;
        best = Math.min(best, minimax(board, depth + 1, !isMax));
        board[i][j] = temp;
      }
    }
  }
  return best;
}

function findBestMove(board) {
  let bestVal = -1000;
  const bestMove = new Move();
  bestMove.row = -1;
  bestMove.col = -1;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] !== "X" && board[i][j] !== "O") {
        const temp = board[i][j];
        board[i][j] = players.player;
        const moveVal = minimax(board, 0, false);
        board[i][j] = temp;
        if (moveVal > bestVal) {
          bestMove.row = i;
          bestMove.col = j;
          bestVal = moveVal;
        }
      }
    }
  }
  return bestMove;
}
