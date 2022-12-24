const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

const dMoves = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [0, 0],
];

function parseInput(lines) {
  let grid = {};
  for (let row = 1; row < lines.length - 1; row++) {
    for (let column = 1; column < lines[row].length - 1; column++) {
      let value = lines[row][column];
      if (value !== ".") {
        setValue(grid, [column - 1, row - 1], [value]);
      }
    }
  }

  return grid;
}

const setValue = (grid, [x, y], value) => (grid[`${x},${y}`] = value);
const getValue = (grid, [x, y], fallback = undefined) => grid[`${x},${y}`] || fallback;
const toString = (grid, h, w, [x1, y1]) => {
  let str = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let g = getValue(grid, [x, y]);
      if (x == x1 && y == y1) {
        if (g) {
          console.error("Same spot");
        }
        str += "E";
      } else {
        str += g ? (g.length === 1 ? g[0] : g.length) : " ";
      }
    }
    str += "\n";
  }
  return str;
};
const print = (grid, h, w, [x1, y1]) => {
  let str = toString(grid, h, w, [x1, y1]);
  console.log(str);
};

function plus([a, b], [x, y]) {
  return [a + x, b + y];
}

function moveBlizzards(grid, h, w) {
  let nextGrid = {};

  for (let [key, blizzards] of Object.entries(grid)) {
    for (let blizzard of blizzards) {
      let [x, y] = key.split(",").map((p) => +p);
      switch (blizzard) {
        case ">":
          x = x === w - 1 ? 0 : x + 1;
          break;
        case "<":
          x = x === 0 ? w - 1 : x - 1;
          break;
        case "v":
          y = y === h - 1 ? 0 : y + 1;
          break;
        case "^":
          y = y === 0 ? h - 1 : y - 1;
          break;
        default:
          console.log("Unknown blizzard");
      }

      let next = getValue(nextGrid, [x, y]);
      if (!next) {
        next = [];
        setValue(nextGrid, [x, y], next);
      }

      next.push(blizzard);
    }
  }

  return nextGrid;
}

function solveDfs(input, h, w) {
  let start = [0, -1];
  let end = [w - 1, h];
  let [x, y] = start;
  let q = [[0, input, [x, y]]];
  let minT = 300;

  let visited = {};

  let blizzards = [input];
  let g = input;
  for (let t = 1; t <= minT; t++) {
    g = moveBlizzards(g, h, w);
    blizzards.push(g);
  }

  while (q.length > 0) {
    let [t, g, [x, y]] = q.pop();
    while (x != end[0] || y != end[1]) {
      // let ll = Object.keys(q).length;
      // if (t % 100 == 0 || ll % 50 == 0)
      //   console.log(new Date().toLocaleTimeString(), t, minT, x, y, ll);

      let currentStateKey = `${t}:${x},${y}`;
      if (visited[currentStateKey]) {
        t = minT;
        break;
      }
      visited[currentStateKey] = t;

      t++;

      if (t >= minT) {
        break;
      }
      let bestT = t + h - 1 - y + w - 1 - x;
      if (bestT > minT) {
        t = bestT;
        break;
      }

      g = blizzards[t];

      let possibleMoves = dMoves.map(([dx, dy]) => [x + dx, y + dy]);
      possibleMoves = possibleMoves.filter(
        ([x1, y1]) =>
          (x1 >= 0 && y1 >= 0 && x1 <= w - 1 && y1 <= h - 1) ||
          (x1 == start[0] && y1 == [start[1]]) ||
          (x1 == end[0] && y1 == end[1])
      );
      if (x === 0 && y === 0) {
        // can return to entrance
        possibleMoves.push([0, -1]);
      }
      if (x === w - 1 && y === h - 1) {
        possibleMoves.push([w - 1, h]);
      }

      // avoid where blizzard
      possibleMoves = possibleMoves.filter((move) => !getValue(g, move));

      // avoid already visited
      possibleMoves = possibleMoves.filter((move) => !visited[`${t + 1}:${move.toString()}`]);

      if (possibleMoves.length === 0) {
        t = Number.MAX_SAFE_INTEGER;
        break;
      }

      [x, y] = possibleMoves.shift();
      possibleMoves.forEach((nextPosition) => q.push([t, g, nextPosition]));
    }

    minT = Math.min(minT, t);
  }

  return minT;
}

function solveBfs(input, h, w, start, end) {
  let q = [start];
  let minTime = 300;

  let blizzards = [input];
  let g = input;
  for (let t = 1; t <= minTime; t++) {
    g = moveBlizzards(g, h, w);
    blizzards.push(g);
  }

  let t = 0;
  while (!q.some(([x1, y1]) => x1 === end[0] && y1 === end[1]) && t < minTime) {
    t++;
    let next = {};
    g = blizzards[t];
    for (let [x, y] of q) {
      // let ll = Object.keys(q).length;
      // if (t % 100 == 0 || ll % 50 == 0)
      //   console.log(new Date().toLocaleTimeString(), t, minT, x, y, ll);

      let possibleMoves = dMoves.map((d) => plus([x, y], d));
      possibleMoves = possibleMoves.filter(
        ([x1, y1]) =>
          (x1 >= 0 && y1 >= 0 && x1 <= w - 1 && y1 <= h - 1) ||
          (x1 == start[0] && y1 == [start[1]]) ||
          (x1 == end[0] && y1 == end[1])
      );
      if (x === 0 && y === 0) {
        // can return to entrance
        possibleMoves.push([0, -1]);
      }
      if (x === w - 1 && y === h - 1) {
        possibleMoves.push([w - 1, h]);
      }

      // avoid where blizzard
      possibleMoves = possibleMoves.filter((p) => !getValue(g, p));

      possibleMoves.forEach((nextPosition) => (next[`${nextPosition.toString()}`] = nextPosition));
    }

    q = Object.values(next);
  }

  return t;
}

function solveBfs(input, h, w, start, end) {
  let q = [start];
  let minTime = 900;

  let blizzards = [input];
  let g = input;
  for (let t = 1; t <= minTime; t++) {
    g = moveBlizzards(g, h, w);
    blizzards.push(g);
  }

  let t = 0;
  while (!q.some(([x1, y1]) => x1 === end[0] && y1 === end[1]) && t < minTime) {
    t++;
    let next = {};
    g = blizzards[t];
    for (let [x, y] of q) {
      // let ll = Object.keys(q).length;
      // if (t % 100 == 0 || ll % 50 == 0)
      //   console.log(new Date().toLocaleTimeString(), t, minT, x, y, ll);

      let possibleMoves = dMoves.map((d) => plus([x, y], d));
      possibleMoves = possibleMoves.filter(
        ([x1, y1]) =>
          (x1 >= 0 && y1 >= 0 && x1 <= w - 1 && y1 <= h - 1) ||
          (x1 == start[0] && y1 == [start[1]]) ||
          (x1 == end[0] && y1 == end[1])
      );
      if (x === 0 && y === 0) {
        // can return to entrance
        possibleMoves.push([0, -1]);
      }
      if (x === w - 1 && y === h - 1) {
        possibleMoves.push([w - 1, h]);
      }

      // avoid where blizzard
      possibleMoves = possibleMoves.filter((p) => !getValue(g, p));

      possibleMoves.forEach((nextPosition) => (next[`${nextPosition.toString()}`] = nextPosition));
    }

    q = Object.values(next);
  }

  console.log("t1", t);

  [start, end] = [end, start];
  q = [start];
  while (!q.some(([x1, y1]) => x1 === end[0] && y1 === end[1]) && t < minTime) {
    t++;
    let next = {};
    g = blizzards[t];
    for (let [x, y] of q) {
      // let ll = Object.keys(q).length;
      // if (t % 100 == 0 || ll % 50 == 0)
      //   console.log(new Date().toLocaleTimeString(), t, minT, x, y, ll);

      let possibleMoves = dMoves.map((d) => plus([x, y], d));
      possibleMoves = possibleMoves.filter(
        ([x1, y1]) =>
          (x1 >= 0 && y1 >= 0 && x1 <= w - 1 && y1 <= h - 1) ||
          (x1 == start[0] && y1 == [start[1]]) ||
          (x1 == end[0] && y1 == end[1])
      );
      if (x === 0 && y === 0) {
        // can return to entrance
        possibleMoves.push([0, -1]);
      }
      if (x === w - 1 && y === h - 1) {
        possibleMoves.push([w - 1, h]);
      }

      // avoid where blizzard
      possibleMoves = possibleMoves.filter((p) => !getValue(g, p));

      possibleMoves.forEach((nextPosition) => (next[`${nextPosition.toString()}`] = nextPosition));
    }

    q = Object.values(next);
  }

  console.log("t2", t);

  [start, end] = [end, start];
  q = [start];
  while (!q.some(([x1, y1]) => x1 === end[0] && y1 === end[1]) && t < minTime) {
    t++;
    let next = {};
    g = blizzards[t];
    for (let [x, y] of q) {
      // let ll = Object.keys(q).length;
      // if (t % 100 == 0 || ll % 50 == 0)
      //   console.log(new Date().toLocaleTimeString(), t, minT, x, y, ll);

      let possibleMoves = dMoves.map((d) => plus([x, y], d));
      possibleMoves = possibleMoves.filter(
        ([x1, y1]) =>
          (x1 >= 0 && y1 >= 0 && x1 <= w - 1 && y1 <= h - 1) ||
          (x1 == start[0] && y1 == [start[1]]) ||
          (x1 == end[0] && y1 == end[1])
      );
      if (x === 0 && y === 0) {
        // can return to entrance
        possibleMoves.push([0, -1]);
      }
      if (x === w - 1 && y === h - 1) {
        possibleMoves.push([w - 1, h]);
      }

      // avoid where blizzard
      possibleMoves = possibleMoves.filter((p) => !getValue(g, p));

      possibleMoves.forEach((nextPosition) => (next[`${nextPosition.toString()}`] = nextPosition));
    }

    q = Object.values(next);
  }

  return t;
}

const exInput = parseInput(example);
let [eh, ew] = [example.length - 2, example[0].length - 2];
console.log(solveDfs(exInput, eh, ew));

const input = parseInput(lines);
let [h, w] = [lines.length - 2, lines[0].length - 2];
console.log(solveDfs(input, h, w));

console.log(solveBfs(exInput, eh, ew, [0, -1], [ew - 1, eh]));
console.log(solveBfs(input, h, w, [0, -1], [w - 1, h]));
