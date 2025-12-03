import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  const getJoltage = (batteries) => {
    let pos1 = -1;
    let m1 = 9;
    for (; m1 >= 1; m1--) {
      let pos = batteries.indexOf(m1.toString());
      if (pos !== -1 && pos !== batteries.length - 1) {
        pos1 = pos;
        break;
      }
    }

    let m2 = 9;
    for (; m2 >= 1; m2--) {
      let pos = batteries.indexOf(m2.toString(), pos1 + 1);
      if (pos !== -1) {
        break;
      }
    }

    let max = `${m1}${m2}`;
    return parseInt(max, 10);
  };

  const p1 = input.map(getJoltage).sum();

  // Part 2
  const getJoltage2 = (batteries) => {
    let max = "";
    let pos1 = -1;

    const size = 12;
    for (let i = size - 1; i >= 0; i--) {
      let m1 = 9;
      for (; m1 >= 1; m1--) {
        let search = batteries.slice(0, i !== 0 ? -i : batteries.length);
        let pos = search.indexOf(m1.toString(), pos1 + 1);
        if (pos !== -1) {
          pos1 = pos;
          break;
        }
      }

      max = `${max}${m1}`;
    }
    return parseInt(max, 10);
  };
  let p2 = input.map(getJoltage2).sum();

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
