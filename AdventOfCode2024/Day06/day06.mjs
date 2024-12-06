import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let map = {};
  let startRow, startCol;
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      if (input[row][col] == "#") {
        map[`${row}x${col}`] = input[row][col];
      } else if (input[row][col] == "^") {
        startRow = row;
        startCol = col;
      }
    }
  }

  let [gRow, gCol] = [startRow, startCol];
  let [drow, dcol] = [-1, 0];
  let path = [[gRow, gCol]];
  while (gRow >= 0 && gRow < input.length && gCol >= 0 && gCol < input[0].length) {
    let [nextRow, nextCol] = [gRow + drow, gCol + dcol];
    if (map[`${nextRow}x${nextCol}`] == "#") {
      [drow, dcol] = [dcol, -drow];
    } else {
      [gRow, gCol] = [nextRow, nextCol];
      path.push([gRow, gCol]);
    }
  }

  // remove last one
  path.pop();

  let unique = path.uniqueBy((x) => `${x[0]}x${x[1]}`);
  let p1 = unique.length;

  // Part 2
  let p2 = 0;
  for (let p of unique) {
    if (p == path[0]) continue;

    map[`${p[0]}x${p[1]}`] = "#";

    [gRow, gCol] = [startRow, startCol];
    [drow, dcol] = [-1, 0];
    let newPath = [`${gRow}x${gCol}`];
    while (
      gRow >= 0 &&
      gRow < input.length &&
      gCol >= 0 &&
      gCol < input[0].length &&
      newPath.length < path.length * 2
    ) {
      let [nextRow, nextCol] = [gRow + drow, gCol + dcol];
      if (map[`${nextRow}x${nextCol}`] == "#") {
        [drow, dcol] = [dcol, -drow];
      } else {
        [gRow, gCol] = [nextRow, nextCol];
        newPath.push(`${gRow}x${gCol}`);
      }
    }

    if (newPath.length == path.length * 2) {
      p2++;
    }

    delete map[`${p[0]}x${p[1]}`];
  }

  return [p1, p2];
}

//27842056
console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
