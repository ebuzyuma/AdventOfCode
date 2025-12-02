import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let p1 = 0;
  let position = 50;
  for (let rotation of input) {
    let dir = rotation[0];
    let dist = +rotation.slice(1);
    if (dir === "L") {
      position -= dist;
    } else {
      position += dist;
    }
    position = position % 100;
    if (position < 0) {
      position += 100;
    }

    if (position === 0) {
      p1++;
    }
  }

  // Part 2
  let p2 = 0;
  position = 50;
  let fromZero = false;
  for (let rotation of input) {
    let dir = rotation[0];
    let dist = +rotation.slice(1);
    if (dist >= 100) {
      p2 += Math.floor(dist / 100);
    }
    dist = dist % 100;

    if (dir === "L") {
      position -= dist;
    } else {
      position += dist;
    }

    if (position > 100) {
      p2++;
      position = position % 100;
    }
    if (position < 0) {
      position += 100;
      if (!fromZero) p2++;
    }

    if (position === 0 || position === 100) {
      position = 0;
      p2++;
      fromZero = true;
    } else {
      fromZero = false;
    }
  }

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
