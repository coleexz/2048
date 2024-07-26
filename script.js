import Grid from "./Grid.js"; // Importa la clase Grid desde el archivo Grid.js
import Tile from "./Tile.js"; // Importa la clase Tile desde el archivo Tile.js

const gameBoard = document.getElementById("game-board"); // Obtiene el elemento del DOM con el id "game-board"

const grid = new Grid(gameBoard); // Crea una nueva instancia de Grid pasando el elemento del tablero de juego
grid.randomEmptyCell().tile = new Tile(gameBoard); // Coloca un nuevo Tile en una celda vacía aleatoria
grid.randomEmptyCell().tile = new Tile(gameBoard); // Coloca otro Tile en una celda vacía aleatoria
setupInput(); // Configura la escucha de eventos para la entrada del teclado
console.log(grid.cellsByColumn); // Imprime en la consola las celdas organizadas por columnas

function setupInput() {
    // Añade un event listener para el evento "keydown" que llama a handleInput, solo una vez
    window.addEventListener("keydown", handleInput, {once: true});
}

async function handleInput(e) {
    // Maneja la entrada del usuario basada en las teclas de flecha presionadas
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

    grid.cells.forEach(cell => cell.mergeTiles()); // Fusiona los tiles en cada celda si es posible

    const newTile = new Tile(gameBoard); // Crea un nuevo tile
    grid.randomEmptyCell().tile = newTile; // Coloca el nuevo tile en una celda vacía aleatoria

    // Comprueba si no hay movimientos posibles y muestra "Game Over" si es el caso
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("Game Over");
        });
        return;
    }

    setupInput(); // Vuelve a configurar la escucha de eventos para la entrada del teclado
}

function moveUp() {
    return slideTiles(grid.cellsByColumn); // Desliza los tiles hacia arriba
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse())); // Desliza los tiles hacia abajo
}

function moveLeft() {
    return slideTiles(grid.cellsByRow); // Desliza los tiles hacia la izquierda
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse())); // Desliza los tiles hacia la derecha
}

function slideTiles(cells) {
    // Desliza los tiles en las celdas especificadas.
    return Promise.all(
        // Utiliza flatMap para aplanar el array de promesas resultantes de los movimientos.
        cells.flatMap(group => {
            const promises = []; // Array para almacenar las promesas de las transiciones.
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]; // Obtiene la celda actual.
                if (cell.tile == null) continue; // Si la celda está vacía, pasa a la siguiente iteración.
                let lastValidCell; // Variable para almacenar la última celda válida para el movimiento.

                // Itera hacia atrás desde la celda actual para encontrar la celda válida más cercana.
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]; // Obtiene la celda de destino potencial.
                    if (!moveToCell.canAccept(cell.tile)) break; // Si la celda de destino no puede aceptar el tile, termina el bucle.
                    lastValidCell = moveToCell; // Actualiza la última celda válida.
                }

                if (lastValidCell != null) {
                    // Si se ha encontrado una celda válida para el movimiento.
                    promises.push(cell.tile.waitForTransition()); // Añade la promesa de la transición del tile actual.
                    if (lastValidCell.tile != null) {
                        // Si la celda de destino ya tiene un tile, se establece para fusionarse.
                        lastValidCell.mergeTile = cell.tile;
                    } else {
                        // Si la celda de destino está vacía, simplemente mueve el tile allí.
                        lastValidCell.tile = cell.tile;
                    }
                    cell.tile = null; // Vacía la celda original.
                }
            }
            return promises; // Devuelve el array de promesas para este grupo.
        })
    );
}


function canMoveUp() {
    return canMove(grid.cellsByColumn); // Comprueba si se puede mover hacia arriba
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse())); // Comprueba si se puede mover hacia abajo
}

function canMoveLeft() {
    return canMove(grid.cellsByRow); // Comprueba si se puede mover hacia la izquierda
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse())); // Comprueba si se puede mover hacia la derecha
}

function canMove(cells) {
    // Comprueba si se puede mover en la dirección especificada.
    return cells.some(group => {
        // Itera a través de cada grupo de celdas (puede ser una fila o columna).
        return group.some((cell, index) => {
            // Para cada celda dentro del grupo, verifica si se puede mover.
            if (index === 0) return false; // No se puede mover la primera celda en un grupo.
            if (cell.tile == null) return false; // Si la celda está vacía, no se puede mover.
            const moveToCell = group[index - 1]; // Obtiene la celda hacia la cual se intentará mover.
            return moveToCell.canAccept(cell.tile); // Comprueba si la celda de destino puede aceptar el tile.
        });
    });
}
