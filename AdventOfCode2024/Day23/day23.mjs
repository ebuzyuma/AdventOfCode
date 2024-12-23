import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

const key = (r, c) => `${r}x${c}`;
const setValue = (map, r, c, value) => (map[key(r, c)] = value);
const getValue = (map, r, c) => map[key(r, c)];

function solve(input) {
  const graph = {};
  const nodes = [];
  const neighbors = {};
  for (let connection of input) {
    let [a, b] = connection.split("-");
    setValue(graph, a, b, [a, b]);
    neighbors[a] ??= [];
    neighbors[a].push(b);
    neighbors[b] ??= [];
    neighbors[b].push(a);
    nodes.push(a, b);
  }

  // Part 1
  let threes = new Set();
  for (let connection of Object.keys(graph)) {
    let [a, b] = graph[connection];
    for (let c of nodes) {
      if (c === a || c === b) {
        continue;
      }

      if (![a, b, c].some((x) => x.startsWith("t"))) {
        continue;
      }

      const key = [a, b, c].sort().join("|");
      if (threes.has(key)) {
        continue;
      }

      if (neighbors[a].includes(c) && neighbors[b].includes(c)) {
        threes.add(key);
      }
    }
  }

  let p1 = [...threes].filter((x) => x.split("|").some((s) => s.startsWith("t"))).length;

  // Part 2
  let maxConnected = {};
  let globalMax = [];
  for (let u in neighbors) {
    if (maxConnected[u]) {
      continue;
    }
    let connected = [u];
    for (let v of neighbors[u]) {
      if (connected.every((x) => neighbors[v].includes(x))) {
        connected.push(v);
      }
    }

    for (let c of connected) {
      if (!maxConnected[c] || connected.length > maxConnected[c].length) {
        maxConnected[c] = connected;
      }
      if (connected.length > globalMax.length) {
        globalMax = connected;
      }
    }
  }
  const p2 = globalMax.sort().join(",");

  return [p1, p2];
}

// 2339 1174 1119

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
