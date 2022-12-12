const utils = require("../utils");
const lines = utils.readInput(__dirname);

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const charToInt = (ch) => {
  if (ch === "E") {
    return "z".charCodeAt(0);
  }
  if (ch === "S") {
    return "a".charCodeAt(0);
  }
  return ch.charCodeAt(0);
};

const getPossibleMoves = (grid, [x, y]) => {
  let possible = [];
  let current = charToInt(grid[x][y]);
  directions.forEach(([dx, dy]) => {
    [x1, y1] = [x + dx, y + dy];

    if (grid[x1] && grid[x1][y1]) {
      let next = charToInt(grid[x1][y1]);
      if (next === current + 1 || next <= current) {
        possible.push([x1, y1]);
      }
    }
  });

  return possible;
};

const findMin = (grid, [x0, y0]) => {
  let visited = [...Array(grid.length)].map((x) => []);
  let queue = [[x0, y0]];
  visited[x0][y0] = 0;
  let minPathLength = Number.MAX_SAFE_INTEGER;
  while (queue.length > 0) {
    let next = new Set();
    queue.forEach(([x, y]) => {
      const moves = getPossibleMoves(grid, [x, y]);
      moves.forEach(([x1, y1]) => {
        if (grid[x1][y1] === "E" && visited[x][y] + 1 < minPathLength) {
          minPathLength = visited[x][y] + 1;
        } else if (!visited[x1][y1] || visited[x1][y1] > visited[x][y] + 1) {
          visited[x1][y1] = visited[x][y] + 1;
          next.add([x1, y1]);
        }
      });
    });

    queue = [...next.values()];
  }

  return minPathLength;
};

// Part 1
console.log(findMin(lines, [0, 0]));

// Part 2
let min = Number.MAX_SAFE_INTEGER;
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === "a" || lines[i][j] === "S") {
      let x = findMin(lines, [i, j]);
      min = x < min ? x : min;
    }
  }
}

console.log(min);
