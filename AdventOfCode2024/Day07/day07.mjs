import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function canBeTrue([test, numbers]) {
  let s = [...numbers];
  let results = [s.shift()];
  while (s.length > 0) {
    let newResults = [];
    let next = s.shift();
    for (let result of results) {
      if (result > test) {
        continue;
      }

      newResults.push(result * next);
      newResults.push(result + next);
    }

    results = newResults;
  }

  return results.includes(test);
}

function canBeTrue2([test, numbers]) {
  let s = numbers.map((x) => BigInt(x));
  let results = [s.shift()];
  while (s.length > 0) {
    let newResults = [];
    let next = s.shift();
    for (let result of results) {
      if (result > test) {
        continue;
      }

      newResults.push(result * next);
      newResults.push(result + next);
      newResults.push(BigInt(`${result}${next}`));
    }

    results = newResults;
  }

  return results.includes(BigInt(test));
}

function solve(input) {
  // Part 1
  let calibrations = input
    .map((x) => x.split(": "))
    .map(([a, b]) => [+a, b.split(" ").map((n) => +n)]);

  let valid = calibrations.filter((x) => canBeTrue(x));
  let p1 = valid.map((x) => x[0]).sum();

  // Part 2
  let valid2 = calibrations.filter((x) => canBeTrue2(x));
  let p2 = valid2.map((x) => x[0]).sum();
  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
