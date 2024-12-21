import * as utils from "../utils.mjs";
import { dirname } from "path";
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
      pathCache[key] = [];
      return [];
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

    let q = [{ p: aPos, path: [] }];
    let visited = {};
    while (q.length > 0) {
      let next = [];
      for (let q1 of q) {
        let {
          p: [r, c],
          path,
        } = q1;
        if (r === bPos[0] && c === bPos[1]) {
          pathCache[key] = path;
          return path;
        }
        visited[`${r}x${c}`] = true;
        let n = Object.entries(dirs)
          .map(([dir, [dr, dc]]) => [dir, [r + dr, c + dc, dir]])
          .filter(([dir, [r, c]]) => r >= 0 && r < pad.length && c >= 0 && c < pad[0].length)
          .filter(([dir, [r, c]]) => !visited[`${r}x${c}`])
          .filter(([dir, [r, c]]) => pad[r][c] !== " ")
          .map(([dir, [r, c]]) => ({ p: [r, c], path: [...path, dir] }));

        next.push(...n);
      }

      q = next;
    }

    // const path = [];
    // const dr = bPos[0] - aPos[0];
    // const dc = bPos[1] - aPos[1];
    // for (let i = 0; i > dr; i--) {
    //   path.push("^");
    // }

    // for (let i = 0; i < dc; i++) {
    //   path.push(">");
    // }

    // for (let i = 0; i < dr; i++) {
    //   path.push("v");
    // }

    // for (let i = 0; i > dc; i--) {
    //   path.push("<");
    // }

    // pathCache[key] = path;
    // return path;
  };
  const type = (pad, code) => {
    let fullPath = [];
    code = "A" + code;
    for (let i = 0; i < code.length - 1; i++) {
      const sub = findPath(pad, code[i], code[i + 1]);
      fullPath.push(...sub, "A");
    }

    return fullPath.join("");
  };

  // Part 1
  let p1 = 0;
  for (let code of input) {
    console.log(Object.keys(pathCache).length);
    const t1 = type(numPad, code);
    const t2 = type(dirPad, t1);
    const t3 = type(dirPad, t2);
    const numCode = parseInt(code.substring(0, code.length - 1));
    p1 += t3.length * numCode;
  }

  // Part 2
  let p2 = 0;

  return [p1, p2];
}
// 180184
console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
