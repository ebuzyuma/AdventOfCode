import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let antennas = {};

  const h = input.length;
  const w = input[0].length;
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      let x = input[row][col];
      if (x != "." && x != "#") {
        antennas[x] = antennas[x] ?? [];
        antennas[x].push([row, col]);
      }
    }
  }

  let antinodes = new Set();
  let antinodes2 = new Set();
  for (let [key, value] of Object.entries(antennas)) {
    for (let i = 0; i < value.length - 1; i++) {
      for (let j = i + 1; j < value.length; j++) {
        const p1 = value[i];
        const p2 = value[j];
        const dRow = p2[0] - p1[0];
        const dCol = p2[1] - p1[1];
        let a1 = [p1[0] - dRow, p1[1] - dCol];
        let a2 = [p2[0] + dRow, p2[1] + dCol];
        if (a1[0] >= 0 && a1[0] < h && a1[1] >= 0 && a1[1] < w) {
          antinodes.add(a1.join("x"));
        }
        if (a2[0] >= 0 && a2[0] < h && a2[1] >= 0 && a2[1] < w) {
          antinodes.add(a2.join("x"));
        }

        let k = -1;
        antinodes2.add(p1.join("x"));
        while (true) {
          a1 = [p1[0] + k * dRow, p1[1] + k * dCol];
          if (a1[0] >= 0 && a1[0] < h && a1[1] >= 0 && a1[1] < w) {
            antinodes2.add(a1.join("x"));
            k--;
          } else {
            break;
          }
        }
        k = 1;
        antinodes2.add(p2.join("x"));
        while (true) {
          a2 = [p2[0] + k * dRow, p2[1] + k * dCol];
          if (a2[0] >= 0 && a2[0] < h && a2[1] >= 0 && a2[1] < w) {
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

  // Part 2
  let p2 = antinodes2.size;
  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
