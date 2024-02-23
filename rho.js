import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getFunctionalGraph } from "./graph.js";

let pInput = document.getElementById("pInput");
let kInput = document.getElementById("kInput");
pInput.value = 97;
kInput.value = 2;

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
      .distance(30)
  )
  .force("charge", d3.forceManyBody().strength(-250))
  .force("x", d3.forceX(window.innerWidth / 2))
  .force("y", d3.forceY(window.innerHeight / 2))
  .on("tick", ticked);

const svg = d3
  .create("svg")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("display", "block")
  .style("background", "black");

// Define the arrow that goes at the tip of the edges.
svg
  .append("defs")
  .append("marker")
  .attr("id", "arrow")
  .attr("refX", 12)
  .attr("refY", 5)
  .attr("markerWidth", 20)
  .attr("markerHeight", 20)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M 0 0 10 5 0 10 2.5 5")
  .style("fill", "#bbb");

const d3Links = svg
  .append("g")
  .attr("stroke", "#bbb")
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
window.addEventListener("resize", (_) => {
  simulation.force("x").x(window.innerWidth / 2);
  simulation.force("y").y(window.innerHeight / 2);
  simulation.alpha(0.7);
  simulation.alphaTarget(0).restart();
});

document.querySelector("main").append(svg.node());
