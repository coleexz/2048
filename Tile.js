export default class Tile {
  #tileElement; // Elemento DOM que representa la tile
  #x; // Coordenada x de la tile en la cuadrícula
  #y; // Coordenada y de la tile en la cuadrícula
  #value; // Valor numérico de la tile

  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div"); // Crea un elemento div para la tile
    this.#tileElement.classList.add("tile"); // Añade la clase "tile" al elemento
    tileContainer.appendChild(this.#tileElement); // Añade el elemento de la tile al contenedor de tiles
    this.value = value; // Establece el valor de la tile (2 o 4 al azar)
  }

  get value() {
    return this.#value; // Devuelve el valor de la tile
  }

  set value(v) {
    this.#value = v; // Establece el valor de la tile
    this.#tileElement.textContent = v; // Establece el contenido de texto del elemento de la tile al valor
    const power = Math.log2(v); // Calcula el logaritmo base 2 del valor de la tile
    const backgroundLightness = 100 - power * 9; // Calcula el brillo del fondo basado en el valor de la tile
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    ); // Establece la propiedad CSS de brillo del fondo
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    ); // Establece la propiedad CSS de brillo del texto
    this.#tileElement.style.setProperty(
      "--tile-color",
      this.getTileColor(v)
    ); // Establece la propiedad CSS del color de la tile basado en su valor
  }

  set x(value) {
    this.#x = value; // Establece la coordenada x de la tile
    this.#tileElement.style.setProperty("--x", value); // Actualiza la propiedad CSS de la coordenada x
  }

  set y(value) {
    this.#y = value; // Establece la coordenada y de la tile
    this.#tileElement.style.setProperty("--y", value); // Actualiza la propiedad CSS de la coordenada y
  }

  remove() {
    this.#tileElement.remove(); // Elimina el elemento DOM de la tile
  }

  waitForTransition(animation = false) {
    // Espera a que termine la transición o animación
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        { once: true }
      ); // Añade un event listener para la transición o animación y resuelve la promesa cuando termina
    });
  }

  getTileColor(value) {
    // Devuelve el color de fondo de la tile basado en su valor
    switch (value) {
        case 2:
        return "#e8eaf6"; // very light lavender
        case 4:
        return "#c5cae9"; // light lavender blue
        case 8:
        return "#9fa8da"; // lavender blue
        case 16:
        return "#7986cb"; // medium blue lavender
        case 32:
        return "#5c6bc0"; // rich blue
        case 64:
        return "#3f51b5"; // strong blue
        case 128:
        return "#3949ab"; // deep indigo
        case 256:
        return "#303f9f"; // darker indigo
        case 512:
        return "#283593"; // dark blue indigo
        case 1024:
        return "#1a237e"; // very dark indigo
        case 2048:
        return "#0d47a1"; // bold deep blue
        default:
        return "#b71c1c"; // dark red for higher tiles
    }
    }
}
