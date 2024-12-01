import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let split = input.map(x => x.split('   '));
  let left = split.map(arr => +arr[0]);
  let right = split.map(arr => +arr[1]);

  let sortLeft = left.numSort();
  let sortRight = right.numSort();

  let p1 = 0;
  for (let i = 0; i < sortLeft.length; i++) {
    p1 += Math.abs(sortLeft[i] - sortRight[i]);
  }

  // Part 2
  let p2 = 0;
  let tally = [];
  for (let num of right) {
    tally[num] = (tally[num] ?? 0) + 1;
  }

  for (let num of left) {
    p2 += num * (tally[num] ?? 0);
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
