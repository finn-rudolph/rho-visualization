import { createSimulation, runOneStep } from "./simulation.js";

const pInput = document.getElementById("p-input");
const kInput = document.getElementById("k-input");
const xDisplay = document.getElementById("x-display");
const yDisplay = document.getElementById("y-display");
const playButton = document.getElementById("play");
const stepButton = document.getElementById("step");

let p = 69;
let k = 1;
let x = 1;
let y = 1;

pInput.value = p;
kInput.value = k;
xDisplay.textContent = x;
yDisplay.textContent = y;
playButton.textContent = ">";
stepButton.textContent = ">>";

let playing = false;
let intervalId;

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
    x = 1;
    y = 1;
    xDisplay.textContent = x;
    yDisplay.textContent = y;
    if (playing) {
      playButton.dispatchEvent(new Event("click"));
    }
    createSimulation(p, k, x, y);
  }
});

createSimulation(p, k, x, y);

playButton.addEventListener("click", () => {
  if (playing) {
    playButton.textContent = ">";
    clearInterval(intervalId);
  } else {
    playButton.textContent = "||";
    intervalId = setInterval(() => {
      [x, y] = runOneStep(p, k, x, y);
      xDisplay.textContent = x;
      yDisplay.textContent = y;
    }, 600);
  }
  playing ^= 1;
});

stepButton.addEventListener("click", () => {
  [x, y] = runOneStep(p, k, x, y);
  xDisplay.textContent = x;
  yDisplay.textContent = y;
});
