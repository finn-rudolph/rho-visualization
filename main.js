import {
  createSimulation,
  setNodeColor,
  setLabelColor,
  deemphNode,
  emphNode,
} from "./simulation.js";
import { successor } from "./graph.js";

const X_COLOR = "#00E6FF";
const Y_COLOR = "#FFE000";
const SIM_INTERVAL = 1000;

export const pInput = document.getElementById("p-input");
export const kInput = document.getElementById("k-input");
export const xDisplay = document.getElementById("x-display");
export const yDisplay = document.getElementById("y-display");
const playButton = document.getElementById("play");
const stepButton = document.getElementById("step");

let p = 47;
let k = 1;
export let x, y;

pInput.value = p;
kInput.value = k;

playButton.textContent = ">";
stepButton.textContent = ">>";

let running = false;
let intervalId;

function nextXY(p, k, x, y) {
  return [successor(p, k, x), successor(p, k, successor(p, k, y))];
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
  playButton.textContent = "||";
  intervalId = setInterval(() => {
    updateXY(...nextXY(p, k, x, y));
    if (x === y) stopAlgorithm();
  }, SIM_INTERVAL);
  running = true;
}

function stopAlgorithm() {
  playButton.textContent = ">";
  clearInterval(intervalId);
  running = false;
}

// Make the input fields resize according to the user input.
for (let input of [pInput, kInput]) {
  input.addEventListener("input", () => {
    input.style.width = input.value.length + "ch";
  });
  input.dispatchEvent(new Event("input"));
}

// If the user changes either p or k and presses `Enter`, the new graph is
// generated.
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (pInput.value != p || kInput.value != k)) {
    p = pInput.value;
    k = kInput.value;
    if (running) {
      stopAlgorithm();
    }
    createSimulation(p, k, x, y);
    updateXY(1, 1);
  }
});

playButton.addEventListener("click", () => {
  if (!running) startAlgorithm();
  else stopAlgorithm();
});

stepButton.addEventListener("click", () => {
  updateXY(...nextXY(p, k, x, y));
});

createSimulation(p, k, x, y);
updateXY(1, 1);
