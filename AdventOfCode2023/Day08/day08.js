const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");
const input = puzzleInput;

let instructions = input[0];
let networkLines = input.slice(2);
const lineRegex = /^(?<from>\w+) = \((?<left>\w+), (?<right>\w+)\)$/;
let map = {};
for (let line of networkLines) {
  const match = lineRegex.exec(line);
  const { from, left, right } = match.groups;
  map[from] = { left, right };
}

function findPath(from, to, instructions, map) {
  let current = from;
  let path = [current];
  let step = 0;
  while (current !== to) {
    let dir = instructions[step % instructions.length];
    current = dir === "L" ? map[current].left : map[current].right;
    path.push(current);
    step++;
  }

  return path;
}

let p1 = findPath("AAA", "ZZZ", instructions, map);
console.log(p1.length - 1);

// Part 2
// Observation:
// Following instructions for node ending with A,
// there is only element that ends on Z and that element repeats
let starts = Object.keys(map).filter((x) => RegExp(/..A/).exec(x));
function findCircle(from, instructions, map) {
  let current = from;
  let path = [current];
  let zIndex = {};
  let step = 0;
  let maxRepeat = 300;
  while (path.length < instructions.length * maxRepeat) {
    let dir = instructions[step % instructions.length];
    current = dir === "L" ? map[current].left : map[current].right;
    path.push(current);
    if (current.endsWith("Z")) {
      zIndex[current] ??= { ends: [] };
      zIndex[current].ends.push(step);
    }
    step++;
  }

  for (let key of Object.keys(zIndex)) {
    let ends = zIndex[key].ends;
    zIndex[key].start = ends[0];
    zIndex[key].circle = ends[1] - ends[0];
  }

  return zIndex;
}

let circleDetails = starts.map((s) => findCircle(s, instructions, map));

function gcd(a, b) {
  if (b == 0) {
    return a;
  }
  return gcd(b, a % b);
}

let circleValues = circleDetails.map((v) => Object.values(v)[0].circle);
let a = circleValues[0];
for (let i = 1; i < circleValues.length; i++) {
  let b = circleValues[i];
  let lcd = (a * b) / gcd(a, b);
  a = lcd;
}
console.log(a);
