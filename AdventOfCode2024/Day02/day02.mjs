import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function isSafe(report) {
  let directions = report[0] - report[1];
  let i = 0;
  while (i < report.length - 1) {
    let diff = report[i] - report[i + 1];
    if (Math.abs(diff) > 3 || Math.sign(diff) != Math.sign(directions)) {
      return false;
    }
    i++;
  }
  return true;
}

function remove(report, i) {
  return [...report.slice(0, i), ...report.slice(i + 1)];
}

function isSafe2(report) {
  if (isSafe(report)) {
    return true;
  }
  let i = 0;
  while (i < report.length) {
    if (isSafe(remove(report, i))) {
      return true;
    }
    i++
  }
  return false;
}

function solve(input) {
  // Part 1
  let reports = input.map((x) => x.split(" ").map((n) => +n));
  let safe = reports.filter((x) => isSafe(x));
  let p1 = safe.length;

  // Part 2
  let safe2 = reports.filter((x) => isSafe2(x));
  let p2 = safe2.length;

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
