import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getFunctionalGraph } from "./graph.js";

let pInput = document.getElementById("pInput");
let kInput = document.getElementById("kInput");
pInput.value = 17;
kInput.value = 1;

// Make the input fields resize according to the user input.
for (let input of [pInput, kInput]) {
  input.addEventListener("input", () => {
    input.style.width = input.value.length + "ch";
  });
  input.dispatchEvent(new Event("input"));
}

const [nodes, links] = getFunctionalGraph(pInput.value, kInput.value);
console.log(nodes);
console.log(links);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink(links).id((d) => d.id)
  )
  .force("charge", d3.forceManyBody())
  .force(
    "center",
    d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
  )
  .on("tick", ticked);

console.log(links);

const svg = d3
  .create("svg")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("display", "block")
  .style("background", "black");

svg
  .append("defs")
  .append("marker")
  .attr("id", "arrow")
  .attr("refX", 16)
  .attr("refY", 6)
  .attr("markerWidth", 30)
  .attr("markerHeight", 30)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M 0 0 12 6 0 12 3 6")
  .style("fill", "white");

// Add a line for each link, and a circle for each node.
const link = svg
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .attr("marker-end", "url(#arrow)")
  .selectAll()
  .data(links)
  .join("line");

const node = svg
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll()
  .data(nodes)
  .join("circle")
  // .attr("marker-end", "url(#arrow)")
  .attr("r", 5)
  .attr("fill", (d) => color(d.group));

node.append("title").text((d) => d.id);

// Add a drag behavior.
node.call(
  d3.drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded)
);

window.addEventListener("resize", (event) => {
  simulation.force("center").x(window.innerWidth / 2);
  simulation.force("center").y(window.innerHeight / 2);
  simulation.alphaTarget(0).restart();
});

// Set the position attributes of links and nodes each time the simulation ticks.
function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}

// Reheat the simulation when drag starts, and fix the subject position.
function dragStarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

// Update the subject (dragged node) position during drag.
function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

// Restore the target alpha so the simulation cools after dragging ends.
// Unfix the subject position now that it’s no longer being dragged.
function dragEnded(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

document.querySelector("main").append(svg.node());
