import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  const [rulesInput, updatesInput] = input.splitBy("");
  const updates = updatesInput.map((x) => x.split(",").map((n) => +n));

  const rules = rulesInput.map((x) => x.split("|"));
  let p1 = 0;
  let incorrect = [];
  for (let update of updatesInput) {
    let isValid = true;
    for (let rule of rules) {
      if (update.includes(rule[0]) && update.includes(rule[1])) {
        if (!update.match(`(${rule[0]}).*?(,${rule[1]})`)) {
          isValid = false;
          break;
        }
      }
    }

    if (isValid) {
      let numbers = update.split(",").map((n) => +n);
      let middle = numbers[(numbers.length - 1) / 2];
      p1 += middle;
    } else {
      incorrect.push(update);
    }
  }

  // Part 2
  let p2 = 0;
  const rulesMap = {};
  for (let rule of rules) {
    rulesMap[rule[0]] = rulesMap[rule[0]] ?? [];
    rulesMap[rule[0]].push(rule[1]);
  }

  for (let update of incorrect) {
    let numbers = update.split(",");
    numbers.sort((a, b) => {
      if (rulesMap[a]?.includes(b)) {
        return -1;
      }
      if (rulesMap[b]?.includes(a)) {
        return 1;
      }

      return 0;
    });

    let middle = numbers[(numbers.length - 1) / 2];
    p2 += +middle;
  }

  return [p1, p2];
}

//27842056
console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
