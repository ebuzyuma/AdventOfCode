import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input, connectionsToDo) {
  const distance = ([x1, y1, z1], [x2, y2, z2]) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

  const boxes = input.map((line) => line.split(",").map(Number));

  const distances = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      let d = distance(boxes[i], boxes[j]);
      distances.push({ pair: [i, j], distance: d });
    }
  }

  const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
  let circuits = [];
  let p1 = 0;
  let p2 = 0;
  for (let i = 0; i < sortedDistances.length; i++) {
    const { pair } = sortedDistances[i];
    // console.log(`connection ${boxes[pair[0]]} - ${boxes[pair[1]]}`);
    const match = circuits.filter((c) => c.has(pair[0]) || c.has(pair[1]));
    if (match.length === 0) {
      circuits.push(new Set(pair));
    } else if (match.length === 1) {
      match[0].add(pair[0]);
      match[0].add(pair[1]);
    } else if (match.length === 2) {
      const secondIndex = circuits.indexOf(match[1]);
      match[1].forEach((v) => match[0].add(v));
      circuits.splice(secondIndex, 1);
    } else {
      throw Error("Unexpected connection");
    }

    if (i === connectionsToDo - 1) {
      circuits = circuits.sort((a, b) => b.size - a.size);
      const top = circuits.slice(0, 3).map((c) => c.size);
      p1 = top.product();
    }

    if (circuits.length === 1 && circuits[0].size === boxes.length) {
      p2 = boxes[pair[0]][0] * boxes[pair[1]][0];
      break;
    }
  }

  return { p1, p2 };
}

console.log("example:", solve(exampleInput, 10));
console.log(" puzzle:", solve(puzzleInput, 1000));
