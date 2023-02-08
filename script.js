const gameBoard = (() => {
  const b = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  return { b };
})();

const showWinner = (status) => {
  document.querySelector("h2").innerText = `${status}`;
  const modal = document.querySelector("#modal");
  modal.showModal();
  const closeModal = document.querySelector(".close-button");
  closeModal.addEventListener("click", () => {
    modal.close();
  });
};

const players = (() => {
  const player = "X";
  const opponent = "O";
  document.getElementById("chooseO").addEventListener("click", () => {
    players.player = "O";
    players.opponent = "X";
  });
  document.getElementById("chooseX").addEventListener("click", () => {
    players.player = "X";
    players.opponent = "O";
  });
  return { player, opponent };
})();

function updateBoard(column, row) {
  gameBoard.b[row][column] = players.player;
}

function checkWin(b) {
  for (let row = 0; row < 3; row += 1) {
    if (b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
      if (b[row][0] === players.player) {
        showWinner("You Won!");
        return +10;
      }
      if (b[row][0] === players.opponent) {
        showWinner("You Lost!");
        return -10;
      }
    }
  }
  for (let col = 0; col < 3; col += 1) {
    if (b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
      if (b[0][col] === players.player) {
        showWinner("You Won!");
        return +10;
      }
      if (b[0][col] === players.opponent) {
        showWinner("You Lost!");
        return -10;
      }
    }
  }
  if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    if (b[0][0] === players.player) {
      showWinner("You Won!");
      return +10;
    }
    if (b[0][0] === players.opponent) {
      showWinner("You Lost!");
      return -10;
    }
  }
  if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    if (b[0][2] === players.player) {
      showWinner("You Won!");
      return +10;
    }
    if (b[0][2] === players.opponent) {
      showWinner("You Lost!");
      return -10;
    }
  }
  return 0;
}

const clickButton = (() => {
  document.querySelectorAll("button").forEach((button) =>
    addEventListener("click", (e) => {
      if (e.target === button && e.target.className !== "clicked") {
        e.target.innerText = players.player;
        e.target.classList.add("clicked");
        updateBoard(e.target.dataset.column, e.target.dataset.row);
        checkWin(gameBoard.b);
      }
    })
  );
})();
