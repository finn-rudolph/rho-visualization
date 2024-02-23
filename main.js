import { createSimulation } from "./simulation.js";

let pInput = document.getElementById("pInput");
let kInput = document.getElementById("kInput");
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

createSimulation(p, k);

let xDisplay = document.getElementById("xDisplay");
let yDisplay = document.getElementById("yDisplay");
let playButton = document.getElementById("play");
let stepButton = document.getElementById("step");
