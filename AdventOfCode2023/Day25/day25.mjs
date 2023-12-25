import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function randomNode(arr) {
  let r = Math.random() * arr.length;
  r = Math.floor(r);
  return arr[r];
}

function contract(graph) {
  let node1 = randomNode(Object.keys(graph));
  let node2 = randomNode(Array(...graph[node1].values()));
  let newGraph = { ...graph };
  delete newGraph[node1];
  delete newGraph[node2];
  let newNode = `${node1},${node2}`;
  newGraph[newNode] = new Set();
  for (let node of graph[node1].values()) {
    if (node === node2) {
      continue;
    }
    newGraph[newNode].add(node);
    newGraph[node] = new Set(newGraph[node]);
    newGraph[node].add(newNode);
    newGraph[node].delete(node1);
  }
  for (let node of graph[node2].values()) {
    if (node === node1) {
      continue;
    }
    newGraph[newNode].add(node);
    newGraph[node] = new Set(newGraph[node]);
    newGraph[node].add(newNode);
    newGraph[node].delete(node2);
  }
  return newGraph;
}

function solve(input) {
  let wires = {};
  let edges = {};

  for (let line of input) {
    let [from, adjacent] = line.split(": ");
    wires[from] ??= new Set();
    for (let to of adjacent.split(" ")) {
      wires[to] ??= new Set();
      wires[from].add(to);
      wires[to].add(from);
      edges[`${[from, to].sort().join("-")}`] = { node1: from, node2: to };
    }
  }

  // Part 1
  let p1 = 0;
  let contracted;
  let cutEdges = [];
  while (cutEdges.length != 3) {
    contracted = wires;
    while (Object.keys(contracted).length > 2) {
      contracted = contract(contracted);
    }

    let [s1, s2] = Object.keys(contracted).map((s) => s.split(","));
    cutEdges = [];
    for (let node1 of s1) {
      for (let node2 of s2) {
        if (wires[node1].has(node2)) {
          cutEdges.push({ node1, node2 });
        }
      }
    }
    p1 = s1.length * s2.length;
    console.log(cutEdges.length);
  }

  // console.log(contracted);
  console.log(cutEdges);

  return [p1];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
