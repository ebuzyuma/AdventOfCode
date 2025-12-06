import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
// read and do no trim input!
const exampleInput = utils.readInput(scriptDirectory, "example.txt", true);
const puzzleInput = utils.readInput(scriptDirectory, "input.txt", true);

function solve(input) {
  // Part 1
  let p1 = 0;
  let numbers = input.slice(0, -1).map((x) => x.trim().split(/\s+/).map(Number));
  let operators = input.slice(-1)[0].trimEnd().split(/\s+/);

  const calculate = (nums, operator) => {
    let result = 0;
    if (operator === "+") {
      return nums.sum();
    } else if (operator === "*") {
      return nums.product();
    }
    return result;
  };

  for (let i = 0; i < numbers[0].length; i++) {
    let column = [];
    for (let j = 0; j < input.length - 1; j++) {
      column.push(numbers[j][i]);
    }

    p1 += calculate(column, operators[i]);
  }

  // Part 2
  let p2 = 0;
  let column = [];
  let colOperator;
  for (let i = 0; i < input[0].length; i++) {
    colOperator = colOperator || input[input.length - 1][i]; // operator always first

    let j = 0;
    for (j = 0; j < input.length; j++) {
      if (input[j][i] !== " ") {
        break;
      }
    }
    if (j === input.length || i === input[0].length - 1) {
      // all spaces, column finished => calculate
      p2 += calculate(column, colOperator);
      column = [];
      colOperator = undefined;
    } else {
      let num = "";
      for (let k = 0; k < input.length - 1; k++) {
        num += input[k][i];
      }
      column.push(Number(num));
    }
  }

  return { p1, p2 };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
