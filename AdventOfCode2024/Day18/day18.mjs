import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

const key = (r, c) => `${r}x${c}`;
const setValue = (map, r, c, value) => (map[key(r, c)] = value);
const getValue = (map, r, c) => map[key(r, c)];

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const print = (map, rMax, cMax) => {
  for (let r = 0; r < rMax; r++) {
    let str = "" + r + ": ";
    for (let c = 0; c < cMax; c++) {
      str += getValue(map, r, c) ?? ".";
    }
    console.log(str);
  }
  console.log();
};

function solve(input, xMax, yMax, p1Size) {
  const coords = input.map((x) => x.split(",").map((n) => +n));
  let map = {};
  for (let c of coords.slice(0, p1Size)) {
    setValue(map, ...c, "#");
  }

  // Part 1
  const findPath = (map) => {
    let q = [{ p: [0, 0], s: 0 }];
    let visited = {};
    while (q.length > 0) {
      let next = [];
      for (let q1 of q) {
        let {
          p: [r, c],
          s,
        } = q1;
        setValue(visited, r, c, s);
        let n = dirs
          .map(([dr, dc]) => [r + dr, c + dc])
          .filter(([r, c]) => r >= 0 && r < yMax && c >= 0 && c < xMax)
          .filter((p) => !getValue(visited, ...p))
          .filter((p) => !getValue(map, ...p))
          .map((p) => ({ p, s: s + 1 }));

        next.push(...n);
      }

      q = next.uniqueBy((x) => key(x.p));
    }

    return getValue(visited, yMax - 1, xMax - 1);
  };

  const p1 = findPath(map);

  // Part 2
  let p2 = [];
  let end = true;
  let i = p1Size;
  while (end) {
    setValue(map, ...coords[i], "#");
    // console.log(i);
    // print(map, xMax, yMax);
    end = findPath(map);
    p2 = coords[i].join(",");
    i++;
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput, 7, 7, 12));
console.log(" puzzle:", solve(puzzleInput, 71, 71, 1024));
