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
  [0, 1], // ">":
  [1, 0], // v:
  [0, -1], // "<":
  [-1, 0], // "^":
];

const print = (map, rMax, cMax) => {
  for (let r = 0; r < rMax; r++) {
    let str = "" + r + ": ";
    for (let c = 0; c < cMax; c++) {
      str += getValue(map, r, c);
    }
    console.log(str);
  }
  console.log();
};

function solve(input, xMax, yMax) {
  // Parsing
  let map = {};
  let reindeer = [];
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[0].length; c++) {
      const value = input[r][c];
      if (value === "S") {
        reindeer = [r, c];
        setValue(map, r, c, ".");
      } else {
        setValue(map, r, c, value);
      }
    }
  }

  // Part 1
  const rotateP = 1000;
  const dfs = (map, pos) => {
    // east is starting point
    let end = [];
    let q = [{ pos, dir: 0, score: 0, from: undefined, paths: [[pos]] }];
    let visited = {};
    const vKey = (r, c, d) => `${r}x${c}:${d}`;
    while (q.length > 0) {
      const cur = q.shift();
      const curValue = getValue(map, ...cur.pos);
      const vValue = visited[vKey(...cur.pos, cur.dir)];

      // came to visited from another path with the same score
      if (vValue) {
        if (vValue.score === cur.score) {
          vValue.from.push(cur.from);
          vValue.paths.push(...cur.paths);
        }
        continue;
      } else {
        visited[vKey(...cur.pos, cur.dir)] = {
          score: cur.score,
          from: [cur.from],
          paths: cur.paths,
        };
      }

      if (curValue === "E") {
        end = cur.pos;
        continue;
      }

      const iDirs = [cur.dir, cur.dir - 1, cur.dir + 1]
        .map((d) => (d < 0 ? d + dirs.length : d))
        .map((d) => d % dirs.length);
      const prices = [0, rotateP, rotateP];
      for (let i = 0; i < iDirs.length; i++) {
        let [dr, dc] = dirs[iDirs[i]];
        const [nr, nc] = [cur.pos[0] + dr, cur.pos[1] + dc];

        const nValue = getValue(map, nr, nc);
        if (nValue === "#") {
          continue;
        }

        const vValue = visited[vKey(nr, nc, iDirs[i])];
        const nScore = cur.score + 1 + prices[i];
        if (vValue && nScore > vValue.score) {
          continue;
        }

        q.push({
          from: cur.pos,
          pos: [nr, nc],
          dir: iDirs[i],
          score: cur.score + 1 + prices[i],
          paths: cur.paths.map((p) => [...p, [nr, nc]]),
        });
      }

      q.orderBy((x) => x.score);
    }

    let best = Object.keys(visited)
      .filter((k) => k.startsWith(key(...end)))
      .orderBy((x) => visited[x].score)[0];
    let bestPath = visited[best];

    return [bestPath, visited];
  };

  const [best, visited] = dfs(map, reindeer);

  const p1 = best.score;

  // Part 2
  let seats = new Set();
  let q = best.paths[0].map((p) => key(...p));
  while (q.length > 0) {
    const cur = q.pop();
    if (seats.has(cur)) {
      continue;
    }

    seats.add(cur);
    // possible paths to the point
    let bestPathKey = Object.keys(visited)
      .filter((k) => k.startsWith(cur))
      .orderBy((x) => visited[x].score)[0];
    let best = visited[bestPathKey];
    let qSet = new Set(q);
    for (let path of best.paths) {
      const points = path.map((p) => key(...p)).filter((p) => !qSet.has(p) && !seats.has(p));
      q.push(...points);
    }
  }
  const p2 = seats.size;

  return [p1, p2];
}

console.log("example:", solve(exampleInput, 11, 7));
console.log(" puzzle:", solve(puzzleInput, 101, 103));
