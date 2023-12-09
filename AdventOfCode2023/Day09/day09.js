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
  let headPredictions = [];
  let tailPredictions = [];
  for (let valueHistory of values) {
    let curr = valueHistory;
    let heads = [];
    let tails = [];
    while (!curr.every((n) => n == 0)) {
      heads.push(curr[0]);
      tails.push(curr.last());
      curr = diff(curr);
    }

    // Part 1
    let tailPrediction = tails.sum();
    tailPredictions.push(tailPrediction)

    // Part 2
    let headPrediction = 0;
    for (let j = heads.length - 1; j >= 0; j--) {
      headPrediction = heads[j] - headPrediction;
    }
    headPredictions.push(headPrediction)
  }

  return [tailPredictions.sum(), headPredictions.sum()];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
