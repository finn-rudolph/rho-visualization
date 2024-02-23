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

const link = svg
  .append("g")
  .attr("stroke", "white")
  .attr("marker-end", "url(#arrow)")
  .selectAll()
  .data(links)
  .join("line");

const node = svg
  .append("g")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");

const _node = node
  .append("circle")
  .attr("r", 10)
  .attr("stroke", "white")
  .attr("fill", "none");

node
  .append("text")
  .attr("stroke", "white")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .text((d) => d.index);

// Dragging behaviour and simulation loop.
node.call(
  d3.drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded)
);

window.addEventListener("resize", (event) => {
  simulation.force("center").x(window.innerWidth / 2);
  simulation.force("center").y(window.innerHeight / 2);
  simulation.alphaTarget(0).restart();
});

function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
}

function dragStarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragEnded(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

document.querySelector("main").append(svg.node());
