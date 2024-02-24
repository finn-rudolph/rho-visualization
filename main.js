import { createSimulation, setNodeColor, setLabelColor } from "./simulation.js";
import { successor } from "./graph.js";

export const pInput = document.getElementById("p-input");
export const kInput = document.getElementById("k-input");
export const xDisplay = document.getElementById("x-display");
export const yDisplay = document.getElementById("y-display");
const playButton = document.getElementById("play");
const stepButton = document.getElementById("step");

let p = 69;
let k = 1;
export let x, y;

pInput.value = p;
kInput.value = k;

playButton.textContent = ">";
stepButton.textContent = ">>";

let playing = false;
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
  }

  setNodeColor(newY, "#F525B7");
  setNodeColor(newX, "#25F3F5");
  setLabelColor(newX, "#25F3F5");
  setLabelColor(newY, "#F525B7");

  xDisplay.textContent = newX;
  yDisplay.textContent = newY;
  x = newX;
  y = newY;
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
    if (playing) {
      playButton.dispatchEvent(new Event("click"));
    }
    createSimulation(p, k, x, y);
    updateXY(1, 1);
  }
});

playButton.addEventListener("click", () => {
  if (playing) {
    playButton.textContent = ">";
    clearInterval(intervalId);
  } else {
    playButton.textContent = "||";
    intervalId = setInterval(() => {
      updateXY(...nextXY(p, k, x, y));
    }, 600);
  }
  playing ^= 1;
});

stepButton.addEventListener("click", () => {
  updateXY(...nextXY(p, k, x, y));
});

createSimulation(p, k, x, y);
updateXY(1, 1);
