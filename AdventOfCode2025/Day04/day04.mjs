import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let p1 = 0;
  let grid = {};
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      grid[`${x},${y}`] = input[y][x];
    }
  }

  const getNeighbors = (x, y, grid) => {
    let result = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        let nx = x + dx;
        let ny = y + dy;
        let neighborValue = grid[`${nx},${ny}`];
        if (neighborValue === "@") result.push(neighborValue);
      }
    }

    return result;
  };
  const getRemovable = (grid) => {
    let result = [];
    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[y].length; x++) {
        if (grid[`${x},${y}`] !== "@") continue;
        let n = getNeighbors(x, y, grid);
        if (n.length < 4) {
          result.push([x, y]);
        }
      }
    }
    return result;
  };

  p1 = getRemovable(grid).length;

  // Part 2
  let p2 = 0;
  let removed = -1;
  while (removed !== 0) {
    let removable = getRemovable(grid);
    removed = removable.length;
    p2 += removed;
    for (let [x, y] of removable) {
      grid[`${x},${y}`] = "#";
    }
  }

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
