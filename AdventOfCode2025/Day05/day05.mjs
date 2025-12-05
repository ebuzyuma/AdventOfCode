import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let p1 = 0;
  let [freshRows, ingredients] = input.splitBy("");

  let fresh = freshRows.map((row) => row.split("-").map(Number)).orderBy((r) => r[0]);

  for (let ingredient of ingredients) {
    for (let row of fresh) {
      if (ingredient >= row[0] && ingredient <= row[1]) {
        p1 += 1;
        break;
      }
    }
  }

  // Part 2
  let merged = [];
  for (let i = 0; i < fresh.length; i++) {
    let j = 0;
    for (; j < merged.length; j++) {
      let m = merged[j];
      if (fresh[i][0] <= m[1]) {
        m[1] = Math.max(m[1], fresh[i][1]);
        break;
      }
    }
    if (j === merged.length) {
      merged.push(fresh[i]);
    }
  }

  let p2 = merged.map((r) => r[1] - r[0] + 1).sum();

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
