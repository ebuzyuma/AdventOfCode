import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let antennas = {};

  const rows = input.length;
  const cols = input[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = input[row][col];
      if (x != "." && x != "#") {
        antennas[x] = antennas[x] ?? [];
        antennas[x].push([row, col]);
      }
    }
  }

  const isInGrid = (node) => {
    return node[0] >= 0 && node[0] < rows && node[1] >= 0 && node[1] < cols;
  };

  const plus = (n1, n2) => [n1[0] + n2[0], n1[1] + n2[1]];

  let antinodes = new Set();
  let antinodes2 = new Set();
  for (let [key, value] of Object.entries(antennas)) {
    for (let i = 0; i < value.length - 1; i++) {
      for (let j = i + 1; j < value.length; j++) {
        const p1 = value[i];
        const p2 = value[j];
        const dRow = p2[0] - p1[0];
        const dCol = p2[1] - p1[1];
        let a1 = plus(p1, [-dRow, -dCol]);
        let a2 = plus(p2, [dRow, dCol]);
        if (isInGrid(a1)) {
          antinodes.add(a1.join("x"));
        }
        if (isInGrid(a2)) {
          antinodes.add(a2.join("x"));
        }

        // Part 2
        let k = 0;
        while (true) {
          a1 = plus(p1, [k * dRow, k * dCol]);
          if (isInGrid(a1)) {
            antinodes2.add(a1.join("x"));
            k--;
          } else {
            break;
          }
        }
        k = 0;
        while (true) {
          a2 = plus(p2, [k * dRow, k * dCol]);
          if (isInGrid(a2)) {
            antinodes2.add(a2.join("x"));
            k++;
          } else {
            break;
          }
        }
      }
    }
  }

  const p1 = antinodes.size;
  const p2 = antinodes2.size;
  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
