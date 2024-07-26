export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.appendChild(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    const power = Math.log2(v);
    const backgroundLightness = 100 - power * 9;
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    );
    this.#tileElement.style.setProperty(
      "--tile-color",
      this.getTileColor(v)
    );
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        { once: true }
      );
    });
  }

  getTileColor(value) {
    switch (value) {
      case 2:
        return "#f7d794"; // peach
      case 4:
        return "#ff5252"; // red
      case 8:
        return "#ff7f50"; // coral
      case 16:
        return "#ffa07a"; // light salmon
      case 32:
        return "#ffd700"; // gold
      case 64:
        return "#da70d6"; // orchid
      case 128:
        return "#7b68ee"; // medium slate blue
      case 256:
        return "#00fa9a"; // medium spring green
      case 512:
        return "#48d1cc"; // medium turquoise
      case 1024:
        return "#20b2aa"; // light sea green
      case 2048:
        return "#778899"; // light slate gray
      default:
        return "#8b0000"; // dark red
    }
  }
}
