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

  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[0].length; c++) {
      const value = input[r][c];
      setValue(map, r, c, value);
    }
  }

  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const explore = (map, [row, col], visited) => {
    let regio = [];
    let plant = getValue(map, row, col);
    let q = [[row, col]];
    while (q.length > 0) {
      let [r, c] = q.pop();
      if (getValue(visited, r, c)) {
        // visited on previous iteration
        continue;
      }
      let neighbors = [];
      for (let [dr, dc] of dirs) {
        let [r1, c1] = [r + dr, c + dc];
        let nValue = getValue(map, r1, c1);
        if (nValue === plant) {
          neighbors.push([r1, c1]);
        }
      }

      regio.push({ pos: [r, c], neighbors: neighbors });

      let toExplore = neighbors.filter(([r1, c1]) => getValue(visited, r1, c1) === undefined);
      q.push(...toExplore);
      setValue(visited, r, c, true);
    }

    return regio;
  };

  let regios = [];
  let visited = {};
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[0].length; c++) {
      if (getValue(visited, r, c)) {
        continue;
      }
      let regio = explore(map, [r, c], visited);
      regios.push(regio);
    }
  }

  // Part 1
  const perimeterPrice = (regio) => {
    let area = regio.length;
    let perimeter = regio.map((x) => 4 - x.neighbors.length).sum();
    return perimeter * area;
  };
  const p1 = regios.map((x) => perimeterPrice(x)).sum();

  // Part 2
  const fenceSpace = 0.1;
  const toSides = ([r, c], neighbors) => {
    let s = [];
    let nSet = new Set(neighbors.map(([r1, c1]) => key(r1, c1)));
    for (let [dr, dc] of dirs) {
      let [r1, c1] = [r + dr, c + dc];
      if (!nSet.has(key(r1, c1))) {
        s.push([r + fenceSpace * dr, c + fenceSpace * dc]);
      }
    }

    return s;
  };

  const sidePrice = (regio) => {
    let area = regio.length;

    let sidesCount = 0;
    let allSides = regio.flatMap((x) => toSides(x.pos, x.neighbors));
    while (allSides.length > 0) {
      let [r, c] = allSides.shift();
      sidesCount++;
      for (let [dr, dc] of dirs) {
        let [r1, c1] = [r + dr, c + dc];
        let step = 1;
        let existing = allSides.findIndex(([r2, c2]) => r2 === r1 && c2 === c1);
        while (existing > -1) {
          allSides.splice(existing, 1);
          step++;
          [r1, c1] = [r + step * dr, c + step * dc];
          existing = allSides.findIndex(([r2, c2]) => r2 === r1 && c2 === c1);
        }
      }
    }

    return sidesCount * area;
  };

  const p2 = regios.map((x) => sidePrice(x)).sum();

  return [p1, p2];
}

// too low 808507

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
