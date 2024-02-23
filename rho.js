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
    d3
      .forceLink(links)
      .id((d) => d.id)
      .distance(50)
  )
  .force("charge", d3.forceManyBody().strength(-100))
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
  .attr("refX", 14)
  .attr("refY", 6)
  .attr("markerWidth", 20)
  .attr("markerHeight", 20)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M 0 0 12 6 0 12 3 6")
  .style("fill", "#aaa");

const d3Links = svg
  .append("g")
  .attr("stroke", "#aaa")
  .attr("marker-end", "url(#arrow)")
  .selectAll()
  .data(links)
  .join("line");

// Create nodes with label at the center by wrapping a circle and a text element
// in a group. The animation is then done by modifying the `transform`
// attribute of the group.
const d3Nodes = svg
  .append("g")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");

d3Nodes
  .append("circle")
  .attr("r", 3)
  .attr("transform", "translate(0, 0)")
  .attr("fill", "#fff");

d3Nodes
  .append("text")
  .attr("fill", "white")
  .attr("transform", "translate(10, 0)")
  .attr("font-family", "Source Code Pro")
  // .attr("text-anchor", "left")
  // .attr("x", (d) => d.x)
  // .attr("y", (d) => d.y)
  .text((d) => d.index);

// Dragging behaviour and simulation loop.
d3Nodes.call(
  d3.drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded)
);

function ticked() {
  d3Links
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  d3Nodes.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
}

function dragStarted(event) {
  if (!event.active) simulation.alphaTarget(0.4).restart();
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

// Adjust the center of gravity when the window size changes.
window.addEventListener("resize", (event) => {
  simulation.force("center").x(window.innerWidth / 2);
  simulation.force("center").y(window.innerHeight / 2);
  simulation.alphaTarget(0).restart();
});

document.querySelector("main").append(svg.node());
