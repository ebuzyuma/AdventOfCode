import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  let map = {};
  const key = (r, c) => `${r}x${c}`;
  const setValue = (map, r, c, value) => (map[key(r, c)] = value);
  const getValue = (map, r, c) => map[key(r, c)];

  let trailheads = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const value = input[i][j];
      setValue(map, i, j, value);
      if (value === "0") {
        trailheads.push([i, j]);
      }
    }
  }

  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const explore = (map, [row, col]) => {
    let q = [[row, col]];
    let high = [];
    while (q.length > 0) {
      let [r, c] = q.pop();
      let qValue = +getValue(map, r, c);
      if (qValue === 9) {
        high.push(key(r, c));
      }
      for (let [dr, dc] of dirs) {
        let [r1, c1] = [r + dr, c + dc];
        let nValue = getValue(map, r1, c1);
        if (nValue === ".") {
          continue;
        } else if (qValue + 1 === +nValue) {
          q.push([r1, c1]);
        }
      }
    }

    return high;
  };

  // Part 1
  const paths = trailheads.map((x) => explore(map, x));
  const p1 = paths.map((h) => new Set(h).size).sum();
  const p2 = paths.map((h) => h.length).sum();
  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
