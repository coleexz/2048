const GRID_SIZE = 4; // Define el tamaño de la cuadrícula, 4x4 en este caso
const CELL_SIZE = 20; // Define el tamaño de cada celda en unidades vmin
const CELL_GAP = 2; // Define el espacio entre las celdas en unidades vmin

export default class Grid {
  #cells; // Propiedad privada para almacenar las celdas de la cuadrícula

  constructor(gridElement) {
    // Configura las propiedades CSS para el elemento de la cuadrícula
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    // Crea las celdas de la cuadrícula y las asigna a la propiedad privada #cells
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE, // Calcula la posición x de la celda
        Math.floor(index / GRID_SIZE) // Calcula la posición y de la celda
      );
    });
  }

  get cells() { 
    return this.#cells; // Devuelve todas las celdas de la cuadrícula
  }
  
  get cellsByRow() {
    // Organiza las celdas por filas
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByColumn() {
    // Organiza las celdas por columnas
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    // Filtra y devuelve las celdas que están vacías (sin tiles)
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    // Selecciona aleatoriamente una celda vacía y la devuelve
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }
}

class Cell {
  #cellElement; // Elemento DOM que representa la celda
  #x; // Coordenada x de la celda en la cuadrícula
  #y; // Coordenada y de la celda en la cuadrícula
  #tile; // Tile actual de la celda
  #mergeTile; // Tile que se va a fusionar con el tile actual

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get mergeTile() {
    return this.#mergeTile; // Devuelve el tile que se va a fusionar
  }

  set mergeTile(value) { 
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  get x() {
    return this.#x; // Devuelve la coordenada x de la celda
  }

  get y() {
    return this.#y; // Devuelve la coordenada y de la celda
  }

  get tile() {
    return this.#tile; // Devuelve el tile actual de la celda
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  canAccept(tile) {
    // Comprueba si la celda puede aceptar un tile (si está vacía o si los valores de los tiles coinciden)
    return (
      this.#tile == null ||
      (this.mergeTile == null && this.tile.value == tile.value)
    );
  }

  mergeTiles() {
    // Fusiona los tiles si es posible
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

function createCellElements(gridElement) {
  const cells = []; // Array para almacenar las celdas
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(new Cell(cell, i % GRID_SIZE, Math.floor(i / GRID_SIZE)));
    gridElement.append(cell); // Añade la celda al elemento de la cuadrícula
  }
  return cells; // Devuelve el array de celdas creadas
}
