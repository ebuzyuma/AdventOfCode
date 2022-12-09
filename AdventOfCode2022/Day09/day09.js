const utils = require("../utils");
const lines = utils.readInput(__dirname);

let grid = {
  head: { x: 0, y: 0 },
  tail: { x: 0, y: 0 },
  tailVisited: { "0x0": 1 },
};
const dirMap = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

const printGrid = (grid) => {
  const maxX = Math.max(grid.head.x, grid.tail.x, 0) + 3;
  const minY = Math.min(grid.head.y, grid.tail.y, 0) - 2;
  let s = "";
  for (let y = Math.max(grid.head.y, grid.tail.y, 0) + 3; y > minY; y--) {
    for (let x = Math.min(grid.head.x, grid.tail.x, 0) - 2; x < maxX; x++) {
      if (x == grid.head.x && y == grid.head.y) {
        s += "H";
      } else if (x == grid.tail.x && y == grid.tail.y) {
        s += "T";
      } else {
        s += ".";
      }
    }
    s += "\n";
  }

  console.log(s);
};

const moveHead = (grid, dir) => {
  grid.head.x += dir[0];
  grid.head.y += dir[1];

  const dx = grid.head.x - grid.tail.x;
  const dy = grid.head.y - grid.tail.y;
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    grid.tail.x += dx / (Math.abs(dx) || 1);
    grid.tail.y += dy / (Math.abs(dy) || 1);
    key = `${grid.tail.x}x${grid.tail.y}`;
    grid.tailVisited[key] = grid.tailVisited[key] || 0;
    grid.tailVisited[key]++;
  }
};

for (let i = 0; i < lines.length; i++) {
  const s = lines[i].split(" ");
  const dir = dirMap[s[0]];
  const count = +s[1];
  for (let j = 0; j < count; j++) {
    //printGrid(grid);
    moveHead(grid, dir);
  }
}

console.log(Object.entries(grid.tailVisited).length);

// Part 2
let grid10 = {
  rope: [...Array(10)].map((x) => ({ x: 0, y: 0 })),
  tailVisited: { "0x0": 1 },
};

const moveKnot = (grid, i) => {
  const dx = grid.rope[i - 1].x - grid.rope[i].x;
  const dy = grid.rope[i - 1].y - grid.rope[i].y;
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    grid.rope[i].x += dx / (Math.abs(dx) || 1);
    grid.rope[i].y += dy / (Math.abs(dy) || 1);
  }
};

const moveHead10 = (grid, dir) => {
  grid.rope[0].x += dir[0];
  grid.rope[0].y += dir[1];

  for (let i = 1; i < grid.rope.length; i++) {
    moveKnot(grid, i);
  }

  key = `${grid.rope[9].x}x${grid.rope[9].y}`;
  grid.tailVisited[key] = grid.tailVisited[key] || 0;
  grid.tailVisited[key]++;
};

for (let i = 0; i < lines.length; i++) {
  const s = lines[i].split(" ");
  const dir = dirMap[s[0]];
  const count = +s[1];
  for (let j = 0; j < count; j++) {
    //printGrid(grid);
    moveHead10(grid10, dir);
  }
}

console.log(Object.entries(grid10.tailVisited).length);
