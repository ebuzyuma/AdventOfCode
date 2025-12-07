import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let p1 = 0;
  let beams = new Set([input[0].indexOf("S")]);
  for (const line of input.slice(1)) {
    // find all indexes of '^'
    let next = [];
    for (let i = 0; i < line.length; i++) {
      if (beams.has(i)) {
        if (line[i] === "^") {
          next.push(i - 1);
          next.push(i + 1);
          p1++;
        } else {
          next.push(i);
        }
      }
    }
    beams = new Set(next);
  }

  // Part 2
  let p2 = 0;
  const memo = {};

  const count = (row, col) => {
    const key = `${row},${col}`;
    if (key in memo) return memo[key];

    if (row === input.length - 1) {
      return 1;
    }

    if (input[row][col] === "^") {
      const t = count(row + 1, col - 1) + count(row + 1, col + 1);
      memo[key] = t;
      return t;
    } else {
      const t = count(row + 1, col);
      memo[key] = t;
      return t;
    }
  };

  p2 = count(1, input[0].indexOf("S"));

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
