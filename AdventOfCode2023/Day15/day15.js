const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function hash(str) {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    let asci = str.charCodeAt(i);
    value += asci;
    value = value * 17;
    value = value % 256;
  }

  return value;
}

function solve(input) {
  // Part 1
  let p1 = input[0]
    .split(",")
    .map((s) => hash(s))
    .sum();

  // Part 2
  let p2 = 0;
  let boxes = {};
  for (let cmd of input[0].split(",")) {
    let [label, focalLength] = cmd.split(/[=-]/);
    let box = hash(label);
    boxes[box] = boxes[box] || [];
    if (!focalLength) {
      boxes[box] = boxes[box].filter((x) => x.label !== label);
    } else {
      let ex = boxes[box].find((x) => x.label === label);
      if (ex) {
        ex.focalLength = focalLength;
      } else {
        boxes[box].push({ label, focalLength });
      }
    }
  }

  for (let [key, lenses] of Object.entries(boxes)) {
    for (let i = 0; i < lenses.length; i++) {
      let power = (1 + +key) * (i + 1) * lenses[i].focalLength;
      p2 += power;
    }
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
