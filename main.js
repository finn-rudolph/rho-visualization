import {
  createSimulation,
  setNodeColor,
  setLabelColor,
  deemphNode,
  emphNode,
} from "./simulation.js";
import { successor } from "./graph.js";

const X_COLOR = "#1DE4FF";
const Y_COLOR = "#FFE043";
const SIM_INTERVAL = 1000;

export const pInput = document.getElementById("p-input");
export const kInput = document.getElementById("k-input");
export const cInput = document.getElementById("c-input");
export const xDisplay = document.getElementById("x-display");
export const yDisplay = document.getElementById("y-display");
const playButton = document.getElementById("play");
const stepButton = document.getElementById("step");
const exponent = document.getElementById("exponent");
const constant = document.getElementById("constant");

let p = 71;
let k = 1;
let c = 1;
export let x, y;

pInput.value = p;
kInput.value = k;
cInput.value = c;

let running = false;
let intervalId;

function nextXY(p, k, c, x, y) {
  return [successor(p, k, c, x), successor(p, k, c, successor(p, k, c, y))];
}

export function updateXY(newX, newY) {
  if (x !== undefined) {
    setNodeColor(x, "white");
    setLabelColor(x, "white");
    setNodeColor(y, "white");
    setLabelColor(y, "white");
    deemphNode(x);
    deemphNode(y);
  }

  setNodeColor(newY, Y_COLOR);
  setNodeColor(newX, X_COLOR);
  setLabelColor(newX, X_COLOR);
  setLabelColor(newY, Y_COLOR);
  emphNode(newX);
  emphNode(newY);

  xDisplay.textContent = newX;
  yDisplay.textContent = newY;
  x = newX;
  y = newY;
}

function startAlgorithm() {
  playButton.textContent = "pause";
  intervalId = setInterval(() => {
    updateXY(...nextXY(p, k, c, x, y));
    if (x === y) stopAlgorithm();
  }, SIM_INTERVAL);
  running = true;
}

function stopAlgorithm() {
  playButton.textContent = "play_arrow";
  clearInterval(intervalId);
  running = false;
}

// Make the input fields resize according to the user input.
for (let input of [pInput, kInput, cInput]) {
  input.addEventListener("input", () => {
    input.style.width = input.value.length + "ch";
  });
  input.dispatchEvent(new Event("input"));
}

// If the user changes either p, k or c and presses `Enter`, the new graph is
// generated.
window.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    (pInput.value != p || kInput.value != k || cInput.value != c)
  ) {
    p = parseInt(pInput.value);
    k = parseInt(kInput.value);
    c = parseInt(cInput.value);
    exponent.textContent = 2 * k;
    constant.textContent = c;
    if (running) {
      stopAlgorithm();
    }
    createSimulation(p, k, c);
    updateXY(1, 1);
  }
});

playButton.addEventListener("click", () => {
  if (!running) startAlgorithm();
  else stopAlgorithm();
});

stepButton.addEventListener("click", () => {
  updateXY(...nextXY(p, k, c, x, y));
});

createSimulation(p, k, c);
updateXY(1, 1);

const pseudocodeShow = document.getElementById("pseudocode-show");
const pseudocode = document.getElementById("pseudocode");
const pseudocodeHide = document.getElementById("pseudocode-hide");

pseudocodeShow.addEventListener("click", () => {
  pseudocode.style.visibility = "visible";
  pseudocodeShow.style.visibility = "hidden";
});

pseudocodeHide.addEventListener("click", () => {
  pseudocode.style.visibility = "hidden";
  pseudocodeShow.style.visibility = "visible";
});
