import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  let split = input.splitBy("");
  let locks = [];
  let keys = [];
  for (let rows of split) {
    if (rows[0].startsWith("#")) {
      locks.push(rows);
    } else {
      keys.push(rows);
    }
  }
  let p1 = 0;
  const countCols = (aa, sym) => {
    let pins = [];
    for (let c = 0; c < aa[0].length; c++) {
      let t = 0;
      for (let r = 0; r < aa.length; r++) {
        if (aa[r][c] === sym) {
          t++;
        }
      }
      pins.push(t);
    }

    return pins;
  };

  const keyPins = keys.map((k) => countCols(k, "."));
  const lockPins = locks.map((l) => countCols(l, "#"));
  for (let key of keyPins) {
    for (let lock of lockPins) {
      let diff = key.map((k, i) => k - lock[i]);
      diff = diff.uniqueBy((d) => d);
      let overlap = diff.every((d) => d >= 0);
      if (overlap) {
        p1++;
      }
    }
  }

  return [p1];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
