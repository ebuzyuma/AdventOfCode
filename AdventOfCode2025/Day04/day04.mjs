import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let grid = {};
  let maxX = input[0].length;
  let maxY = input.length;
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      grid[`${x},${y}`] = input[y][x];
    }
  }

  const getValue = (grid, x, y) => grid[`${x},${y}`];
  const setValue = (grid, x, y, value) => {
    grid[`${x},${y}`] = value;
  };

  const getNeighbors = (grid, x, y, nValue = "@") => {
    let result = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        let nx = x + dx;
        let ny = y + dy;
        let neighborValue = getValue(grid, nx, ny);
        if (neighborValue === nValue) result.push(neighborValue);
      }
    }

    return result;
  };

  const getRemovable = (grid) => {
    let result = [];
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        if (getValue(grid, x, y) !== "@") continue;
        let n = getNeighbors(grid, x, y);
        if (n.length < 4) {
          result.push([x, y]);
        }
      }
    }
    return result;
  };

  const p1 = getRemovable(grid).length;

  // Part 2
  let p2 = 0;
  let removed = -1;
  while (removed !== 0) {
    let removable = getRemovable(grid);
    removed = removable.length;
    p2 += removed;
    for (let [x, y] of removable) {
      setValue(grid, x, y, "#");
    }
  }

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
