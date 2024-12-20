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

function solve(input, minSizeP1, minSizeP2) {
  // Parse map
  const map = {};
  let start = [0, 0];
  let end = [0, 0];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      setValue(map, i, j, input[i][j]);
      if (input[i][j] === "S") {
        start = [i, j];
      } else if (input[i][j] === "E") {
        end = [i, j];
      }
    }
  }

  const findPath = (map, s, e) => {
    let path = [s];
    let q = [s];
    let visited = {};
    while (q.length > 0) {
      let next = [];
      for (let q1 of q) {
        let [r, c] = q1;
        setValue(visited, r, c, s);
        let n = dirs
          .map(([dr, dc]) => [r + dr, c + dc])
          .filter((p) => !getValue(visited, ...p))
          .filter((p) => getValue(map, ...p) !== "#");

        next.push(...n);
      }

      console.assert(next.length === 1);
      path.push(next[0]);
      if (next[0][0] === e[0] && next[0][1] === e[1]) {
        break;
      }

      q = next;
    }

    return path;
  };

  // there is single path from start to end
  const racePath = findPath(map, start, end);

  // Part 1
  const findAllCheats = (path) => {
    const cheats = {};
    const path1 = path.map((p) => key(...p));
    for (let i = 0; i < path.length; i++) {
      const [r, c] = path[i];

      let savings = dirs
        .filter(
          ([dr, dc]) =>
            !path.includes(key(r + dr, c + dc)) && path1.includes(key(r + 2 * dr, c + 2 * dc))
        )
        .map(([dr, dc]) => [r + 2 * dr, c + 2 * dc])
        .map(([r, c]) => path1.findIndex((p) => p === key(r, c)))
        .filter((ip) => ip > i)
        .map((ip) => ip - i - 2);

      for (let d of savings) {
        cheats[d] = (cheats[d] ?? 0) + 1;
      }
    }

    return cheats;
  };

  const cheats = findAllCheats(racePath);
  let p1 = Object.keys(cheats)
    .filter((k) => k >= minSizeP1)
    .map((k) => cheats[k])
    .sum();

  // Part 2
  const findAllCheatsBySize = (path, cheatSize, minSize) => {
    const cheats = {};
    for (let i = 0; i < path.length; i++) {
      const [r, c] = path[i];
      let savings = path
        .map((p, j) => [j, Math.abs(p[0] - r) + Math.abs(p[1] - c)])
        .slice(i + minSize)
        .filter(([j, d]) => d <= cheatSize && d < j - i) // shorter options
        .map(([j, d]) => j - i - d); // saving

      for (let d of savings) {
        cheats[d] = (cheats[d] ?? 0) + 1;
      }
    }

    return cheats;
  };

  let cheats2 = findAllCheatsBySize(racePath, 20, minSizeP2);
  let p2 = Object.keys(cheats2)
    .filter((k) => k >= minSizeP2)
    .map((k) => cheats2[k])
    .sum();

  return [p1, p2];
}

// 1377
console.log("example:", solve(exampleInput, 0, 50));
console.log(" puzzle:", solve(puzzleInput, 100, 100));
