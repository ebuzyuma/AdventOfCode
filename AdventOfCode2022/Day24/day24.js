const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function parseInput(lines) {
  let grid = {};
  for (let i = 1; i < lines.length - 1; i++) {
    for (let j = 1; j < lines[i].length - 1; j++) {
      if (lines[i][j] !== ".") {
        setValue(grid, [j - 1, i - 1], [lines[i][j]]);
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
      let [x, y] = key.split(",").map((x) => +x);
      switch (blizzard) {
        case ">":
          x++;
          if (x === w) x = 0;
          break;
        case "<":
          x--;
          if (x === -1) x = w - 1;
        case "v":
          y++;
          if (y === h) y = 0;
        case "^":
          y--;
          if (y === -1) y = h - 1;
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

function solve1(input, h, w) {
  let [x, y] = [0, -1];
  let q = [[0, input, [x, y], [[x, y]]]];
  let minT = 265;

  let visited = {};

  let blizzards = [input];
  let g = input;
  for (let t = 1; t <= minT; t++) {
    g = moveBlizzards(g, h, w);
    blizzards.push(g);
  }

  while (q.length > 0) {
    let [t, g, [x, y]] = q.pop();
    while (x != w - 1 || y != h - 1) {
      let ll = Object.keys(q).length;
      // if (t % 100 == 0 || ll % 50 == 0)
      //   console.log(new Date().toLocaleTimeString(), t, minT, x, y, ll);

      t++;

      let currentStateKey = `${t}:${x},${y}`;
      if (visited[currentStateKey]) {
        t = minT;
        break;
      }
      visited[currentStateKey] = t;

      if (t >= minT) {
        break;
      }
      let bestT = t + h - 1 - y + w - 1 - x;
      if (bestT > minT) {
        t = bestT;
        break;
      }

      g = blizzards[t];

      let possibleMoves = directions.map((d) => plus([x, y], d));
      possibleMoves = possibleMoves.filter(
        ([x, y]) => x >= 0 && y >= 0 && x <= w - 1 && y <= h - 1
      );
      if (x === 0 && y === 0) {
        // can return to entrance
        possibleMoves.push([0, -1]);
      }
      // or stay
      possibleMoves.push([x, y]);

      // avoid where blizzard
      possibleMoves = possibleMoves.filter((p) => !getValue(g, p));

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

  return minT + 1;
}

function solve2(input) {}

const input = parseInput(lines);
const exInput = parseInput(example);

console.log(solve1(exInput, example.length - 2, example[0].length - 2));
console.log(solve1(input, lines.length - 2, lines[0].length - 2));

console.log(solve2(exInput));
console.log(solve2(input));
