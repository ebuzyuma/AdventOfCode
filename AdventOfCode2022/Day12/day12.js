const utils = require("../utils");
const lines = utils.readInput(__dirname);

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const directionsToL = {
  "0,1": ">",
  "0,-1": "<",
  "1,0": "v",
  "-1,0": "^",
};

const charToInt = (ch) => {
  if (ch === "E") {
    return "z".charCodeAt(0);
  }
  if (ch === "S") {
    return "a".charCodeAt(0);
  }
  return ch.charCodeAt(0);
};

const getPossibleMoves = (grid, visited, [x, y]) => {
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

const printMap = (map) => {
  let str = "";
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      str += map[i][j] || " ";
    }
    str += "\n";
  }
  console.log(str);
};

const findMin = (lines, [x0, y0]) => {
  let visited = [...Array(lines.length)].map((x) => []);
  let viewMap = [...Array(lines.length)].map((x) => []);
  let queue = [[x0, y0]];
  visited[x0][y0] = 0;
  let [xe, ye] = [0, 0];
  while (queue.length > 0) {
    //printMap(viewMap);
    let next = new Set();
    queue.forEach(([x, y]) => {
      const moves = getPossibleMoves(lines, visited, [x, y]);
      moves.forEach(([x1, y1]) => {
        if (lines[x1][y1] === "E") {
          [xe, ye] = [x1, y1];
          visited[x1][y1] = Math.min(visited[x][y] + 1, visited[x1][y1] || 1000000);
        } else if (!visited[x1][y1] || visited[x1][y1] > visited[x][y] + 1) {
          visited[x1][y1] = visited[x][y] + 1;
          viewMap[x1][y1] = directionsToL[[x - x1, y - y1].toString()];
          next.add([x1, y1]);
        }
      });
    });

    queue = [...next.values()];
  }

  return visited[xe][ye];
};

let min = 10000000;
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === "a" || lines[i][j] === "S") {
      let x = findMin(lines, [i, j]);
      min = x ? Math.min(x, min) : min;
    }
  }
}

console.log(min);
