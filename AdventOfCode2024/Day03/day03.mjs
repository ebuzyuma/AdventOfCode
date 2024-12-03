import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let all = input.join(" ");
  let matches = all.matchAll(/mul\((?<left>\d{1,3}),(?<right>\d{1,3})\)/g);
  let p1 = BigInt(0);
  for (let match of matches) {
    const left = +match.groups.left;
    const right = +match.groups.right;
    p1 += BigInt(left) * BigInt(right);
  }

  // Part 2
  let p2 = BigInt(0);
  let matches2 = all.matchAll(/(do\(\))|(don't\(\))|(mul\((?<left>\d{1,3}),(?<right>\d{1,3})\))/g);
  let enabled = true;
  for (let match of matches2) {
    if (match[0] == "do()") {
      enabled = true;
    } else if (match[0] == "don't()") {
      enabled = false;
    } else if (enabled) {
      const left = +match.groups.left;
      const right = +match.groups.right;
      p2 += BigInt(left) * BigInt(right);
    }
  }

  return [p1, p2];
}

//27842056
console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
