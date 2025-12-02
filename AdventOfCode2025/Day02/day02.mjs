import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let p1 = 0;
  let ids = input[0].split(",");
  const isInvalid = (num) => {
    let str = num.toString();
    if (str.length % 2 !== 0) return false;

    let left = str.slice(0, str.length / 2);
    let right = str.slice(str.length / 2);
    return left === right;
  };
  for (let id of ids) {
    let [from, to] = id.split("-").map(Number);
    for (let i = from; i <= to; i++) {
      if (isInvalid(i)) {
        p1 += i;
      }
    }
  }

  // Part 2
  let p2 = 0;
  const isInvalid2 = (num) => {
    let str = num.toString();
    for (let pl = 1; pl <= str.length / 2; pl++) {
      let templ = str.slice(0, pl);
      if (str.length % pl !== 0) continue;

      let count = str.length / templ.length;
      let built = templ.repeat(count);
      if (built === str) {
        return true;
      }
    }

    return false;
  };

  for (let id of ids) {
    let [from, to] = id.split("-").map(Number);
    for (let i = from; i <= to; i++) {
      if (isInvalid2(i)) {
        p2 += i;
      }
    }
  }

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
