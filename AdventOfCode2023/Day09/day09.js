const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function diff(arr) {
  let result = [];
  for (let i = 1; i < arr.length; i++) {
    result.push(arr[i] - arr[i - 1]);
  }
  return result;
}

function solve(input) {
  let values = input.map((line) => line.split(" ").map((x) => +x));
  let p1 = 0;
  for (let valueHistory of values) {
    let curr = valueHistory;
    let tails = [];
    while (!curr.every((n) => n == 0)) {
      // tails.push(curr.last());
      tails.push(curr[0]);
      curr = diff(curr);
    }

    // Part 1
    // let prediction = tails.sum();

    let prediction = 0;
    for (let j = tails.length - 1; j >= 0; j--) {
      prediction = tails[j] - prediction;
    }

    p1 += prediction;
  }
  return p1;
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
