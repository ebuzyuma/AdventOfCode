import * as utils from "../utils.mjs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

const key = (r, c) => `${r}x${c}`;
const setValue = (map, r, c, value) => (map[key(r, c)] = value);
const getValue = (map, r, c) => map[key(r, c)];

const dirs = {
  ">": [0, 1],
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
};

function solve(input) {
  const numPad = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [" ", "0", "A"],
  ];
  const dirPad = [
    [" ", "^", "A"],
    ["<", "v", ">"],
  ];
  const pathCache = {};
  const findPath = (pad, a, b) => {
    const key = `${a}x${b}`;
    if (pathCache[key]) {
      return pathCache[key];
    }

    if (a === b) {
      pathCache[key] = [[]];
      return [[]];
    }

    let aPos, bPos;

    for (let r = 0; r < pad.length; r++) {
      for (let c = 0; c < pad[r].length; c++) {
        if (pad[r][c] === a) {
          aPos = [r, c];
        }
        if (pad[r][c] === b) {
          bPos = [r, c];
        }
      }
    }

    let q = [{ p: aPos, paths: [[]] }];
    let visited = {};
    while (q.length > 0) {
      let next = [];
      for (let q1 of q) {
        let {
          p: [r, c],
          paths,
        } = q1;
        visited[`${r}x${c}`] = true;
        let n = Object.entries(dirs)
          .map(([dir, [dr, dc]]) => [dir, [r + dr, c + dc, dir]])
          .filter(([dir, [r, c]]) => r >= 0 && r < pad.length && c >= 0 && c < pad[0].length)
          .filter(([dir, [r, c]]) => !visited[`${r}x${c}`])
          .filter(([dir, [r, c]]) => pad[r][c] !== " ")
          .map(([dir, [r, c]]) => ({ p: [r, c], paths: paths.map((path) => [...path, dir]) }));

        next.push(...n);
      }

      const match = next.filter(({ p: [r, c] }) => r === bPos[0] && c === bPos[1]);
      if (match.length > 0) {
        const result = match.flatMap(({ paths }) => paths);
        pathCache[key] = result;
        return result;
      }

      q = next;
    }
  };
  const type = (pad, code) => {
    let fullPath = [""];
    code = "A" + code;
    for (let i = 0; i < code.length - 1; i++) {
      const sub = findPath(pad, code[i], code[i + 1]);
      fullPath = fullPath.flatMap((path) => sub.map((s) => path + s.join("") + "A"));
    }

    return fullPath;
  };

  // Part 1
  let p1 = 0;
  for (let code of input) {
    const t1 = type(numPad, code);
    let t2 = [];
    for (let t of t1) {
      const tt = type(dirPad, t);
      t2.push(...tt);
    }
    const best2 = Math.min(...new Set(t2.map((x) => x.length)));
    t2 = t2.filter((x) => x.length === best2);
    let best3 = Number.MAX_VALUE;
    for (let t of t2) {
      const tt = type(dirPad, t);
      best3 = Math.min(best3, ...new Set(tt.map((x) => x.length)));
    }

    const numCode = parseInt(code.substring(0, code.length - 1));
    p1 += best3 * numCode;
  }

  // Part 2
  const rCache = {};
  const findBest = (a, b, n) => {
    const key = `${a}x${b}x${n}`;
    // console.log(key);
    if (rCache[key]) {
      return rCache[key];
    }

    const paths = pathCache[`${a}x${b}`];
    if (n === 0) {
      rCache[key] = paths[0].length + 1;
      return rCache[key];
    }

    if (paths[0].length === 0) {
      // Staying on same key
      rCache[key] = 1;
      return 1;
    }

    let best = Number.MAX_VALUE;
    for (let path of paths) {
      let pBest = findBest("A", path[0], n - 1) + findBest(path.last(), "A", n - 1);
      for (let i = 0; i < path.length - 1; i++) {
        pBest += findBest(path[i], path[i + 1], n - 1);
      }

      best = Math.min(best, pBest);
    }

    rCache[key] = best;
    return best;
  };

  const type2 = (pad, code, n) => {
    let fullPath = 0;
    code = "A" + code;
    for (let i = 0; i < code.length - 1; i++) {
      const sub = findBest(code[i], code[i + 1], n);
      fullPath += sub;
    }

    return fullPath;
  };
  const run = (input, nRobots) => {
    let complexity = 0;
    for (let code of input) {
      // console.log("cracking", code);
      const t1 = type(numPad, code);
      const t2 = [];
      for (let t of t1) {
        const tt = type2(dirPad, t, nRobots);
        t2.push(tt);
      }

      const shortest = Math.min(...t2);
      const numCode = parseInt(code.substring(0, code.length - 1));
      complexity += shortest * numCode;
    }
    return complexity;
  };
  const p2 = run(input, 25 - 1);

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
