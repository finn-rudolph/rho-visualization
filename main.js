import { createSimulation } from "./simulation.js";

const pInput = document.getElementById("p-input");
const kInput = document.getElementById("k-input");
let p = 69;
let k = 1;
pInput.value = p;
kInput.value = k;

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
    createSimulation(p, k);
  }
});

const xDisplay = document.getElementById("x-display");
const yDisplay = document.getElementById("y-display");
const playButton = document.getElementById("play");
const stepButton = document.getElementById("step");
let x = 1;
let y = 1;
xDisplay.textContent = x;
yDisplay.textContent = y;
playButton.textContent = " > ";
stepButton.textContent = " >> ";

createSimulation(p, k, x, y);
