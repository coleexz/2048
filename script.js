import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
let score = 0;

// Función para actualizar el score
function updateScore(points) {
  score += points;
  scoreElement.textContent = score;
}

// Función para mostrar el formulario de "Game Over"
function showGameOverForm() {
  const gameOverForm = document.getElementById("game-over-form");
  gameOverForm.style.display = "block";
}

// Función para manejar el envío del formulario
function handleFormSubmit(event) {
  event.preventDefault();
  const playerName = document.getElementById("player-name").value;
  const playerIG = document.getElementById("player-ig").value;

  // Enviar la puntuación a la base de datos
  fetch("http://localhost:3000/save-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: playerName, ig: playerIG, score: score })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Puntuación guardada:", data);
      document.getElementById("game-over-form").style.display = "none";
      updateLeaderboard();
    })
    .catch(error => console.error("Error al guardar la puntuación:", error));
}

document.getElementById("player-form").addEventListener("submit", handleFormSubmit);

// Variables de paginación
let allLeaderboardData = [];
let currentPage = 0;
const pageSize = 5; // Cambia el tamaño de página a 5 para mostrar solo 5 elementos

// Función para obtener todos los datos del leaderboard
function updateLeaderboard() {
  fetch("http://localhost:3000/leaderboard")
    .then(response => response.json())
    .then(data => {
      allLeaderboardData = data; // Guardar todos los registros
      currentPage = 0; // Reiniciar a la primera página
      displayLeaderboard(); // Mostrar la página actual
    })
    .catch(error => console.error("Error al obtener el leaderboard:", error));
}

// Función para mostrar los registros de la página actual
function displayLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

  // Calcular los elementos a mostrar en la página actual
  const start = currentPage * pageSize;
  const end = Math.min(start + pageSize, allLeaderboardData.length); // Evita exceder la longitud total
  const pageData = allLeaderboardData.slice(start, end);

  pageData.forEach((player, index) => {
    const listItem = document.createElement("li");

    const rankSpan = document.createElement("span");
    rankSpan.textContent = `${start + index + 1}`; // Calcula el rango global

    const nameSpan = document.createElement("span");
    nameSpan.textContent = player.name;

    const igSpan = document.createElement("span");
    igSpan.textContent = player.ig;

    const scoreSpan = document.createElement("span");
    scoreSpan.textContent = player.score;

    listItem.appendChild(rankSpan);
    listItem.appendChild(nameSpan);
    listItem.appendChild(igSpan);
    listItem.appendChild(scoreSpan);
    leaderboardList.appendChild(listItem);
  });

  // Habilitar/deshabilitar botones de paginación
  document.getElementById("prev-button").disabled = currentPage === 0;
  document.getElementById("next-button").disabled = end >= allLeaderboardData.length;
}

// Función para ir a la siguiente página
function nextPage() {
  if ((currentPage + 1) * pageSize < allLeaderboardData.length) {
    currentPage++;
    displayLeaderboard();
  }
}

// Función para ir a la página anterior
function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    displayLeaderboard();
  }
}

// Inicializar el leaderboard al cargar la página
updateLeaderboard();
document.getElementById("next-button").addEventListener("click", nextPage);
document.getElementById("prev-button").addEventListener("click", prevPage);

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach(cell => cell.mergeTiles(updateScore));

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    showGameOverForm();
    return;
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;

        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()));
}

function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
