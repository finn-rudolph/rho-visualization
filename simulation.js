import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getFunctionalGraph } from "./graph.js";
import { updateXY } from "./main.js";

const BG_COLOR = "#0C0C0F";

export function createSimulation(p, k, c) {
  const svg = d3.select("svg");
  svg.selectAll("g").remove();
  const [nodes, links] = getFunctionalGraph(p, k, c);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(30)
    )
    .force("charge", d3.forceManyBody().strength(-240))
    .force("x", d3.forceX(window.innerWidth / 2))
    .force("y", d3.forceY(window.innerHeight / 2))
    .on("tick", () => {
      // Update the simulation on each tick.
      lines
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeBoxes.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
    })
    .alpha(1.8)
    .alphaDecay(0.01);

  setTimeout(() => simulation.alphaDecay(0.0228), 5000);

  const lines = svg
    .append("g")
    .attr("stroke", "#888")
    .attr("marker-end", "url(#arrow)")
    .selectAll()
    .data(links)
    .join("line");

  // Create nodes with label at the center by wrapping a circle and a text
  // element in a group. The animation is then done by modifying the `transform`
  // attribute of the group.
  const nodeBoxes = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("fill", "white")
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .attr("id", (d) => "nd-" + d.index);

  nodeBoxes
    .append("circle")
    .attr("r", 4)
    .attr("transform", "translate(0, 0)")
    .attr("fill", "inherit");

  nodeBoxes
    .append("text")
    .attr("fill", "inherit")
    .attr("transform", "translate(10, 0)")
    .attr("font-family", "Jost", "monospace")
    .text((d) => d.index);

  // Implement dragging behaviour.
  nodeBoxes.call(
    d3
      .drag()
      .on("start", (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event) => {
        // Cool the simulation once dragging ended.
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      })
  );

  nodeBoxes.on("click", (event) => {
    const n = event.srcElement.__data__.index;
    updateXY(n, n);
  });

  // Adjust the center of gravity when the window size changes.
  window.addEventListener("resize", (_) => {
    simulation.force("x").x(window.innerWidth / 2);
    simulation.force("y").y(window.innerHeight / 2);
    simulation.alpha(0.7);
    simulation.alphaTarget(0).restart();
  });
}

export function setNodeColor(i, color) {
  d3.select("#nd-" + i)
    .select("circle")
    .attr("fill", color);
}

export function setLabelColor(i, color) {
  d3.select("#nd-" + i)
    .select("text")
    .attr("fill", color);
}

export function emphNode(i) {
  const nodeBox = d3.select("#nd-" + i);
  nodeBox.select("text").attr("font-weight", "800");
  nodeBox.select("text").attr("font-size", "1.618em");
  nodeBox.select("circle").attr("r", 10);
}

export function deemphNode(i) {
  const nodeBox = d3.select("#nd-" + i);
  nodeBox.select("text").attr("font-weight", "400");
  nodeBox.select("text").attr("font-size", "1em");
  nodeBox.select("circle").attr("r", 4);
}

// Set up the SVG and add it to the DOM.
const svg = d3
  .create("svg")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("display", "block")
  .style("background", BG_COLOR);

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
  .style("fill", "#888");

svg
  .append("defs")
  .append("style")
  .attr("type", "text/css")
  .text(
    "@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap')"
  );

document.querySelector("main").append(svg.node());
