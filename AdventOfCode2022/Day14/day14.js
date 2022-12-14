const utils = require("../utils");
const lines = utils.readInput(__dirname);

let paths = [];
for (let i = 0; i < lines.length; i++) {
  let points = lines[i].split(" -> ");
  let path = [];
  for (let j = 0; j < points.length; j++) {
    let [x, y] = points[j].split(",");
    path.push({ x: +x, y: +y });
  }

  paths.push(path);
}

const setValue = (grid, x, y, value) => (grid[`${x},${y}`] = value);
const getValue = (grid, x, y, fallback = undefined) => grid[`${x},${y}`] || fallback;
const print = (grid, width, height, x0 = 0, y0 = 0) => {
  for (let y = y0; y < height; y++) {
    let line = "";
    for (let x = x0; x < width; x++) {
      line += getValue(grid, x, y, " ");
    }
    console.log(line);
  }
};

let grid = {};
let minX = Number.MAX_SAFE_INTEGER;
let maxX = 0;
let maxY = 0;
for (let i = 0; i < paths.length; i++) {
  let path = paths[i];
  for (let j = 0; j < path.length - 1; j++) {
    let p1 = path[j];
    let p2 = path[j + 1];
    minX = Math.min(minX, p1.x, p2.x);
    maxX = Math.max(maxX, p1.x, p2.x);
    maxY = Math.max(maxY, p1.y, p2.y);
    let [x1, x2] = p1.x > p2.x ? [p2.x, p1.x] : [p1.x, p2.x];
    let [y1, y2] = p1.y > p2.y ? [p2.y, p1.y] : [p1.y, p2.y];
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        setValue(grid, x, y, "#");
      }
    }
  }
}

print(grid, maxX + 1, maxY + 1, minX);

const dropSand = (grid, [x0, y0], maxY) => {
  let [x, y] = [x0, y0];
  while (!getValue(grid, x, y + 1)) {
    if (y === maxY) {
      return [x, y];
    }
    y++;
  }
  if (!getValue(grid, x - 1, y + 1)) {
    return dropSand(grid, [x - 1, y + 1], maxY);
  }
  if (!getValue(grid, x + 1, y + 1)) {
    return dropSand(grid, [x + 1, y + 1], maxY);
  }

  return [x, y];
};

const fillPart1 = (grid, maxY) => {
  let [x, y] = [0, 0];
  let units = 0;
  while (y != maxY) {
    units++;
    [x, y] = dropSand(grid, [500, 0], maxY);
    setValue(grid, x, y, "o");
  }

  return units - 1;
};

let part1 = fillPart1({ ...grid }, maxY);
console.log(part1);

// Part 2
const fillPart2 = (grid, maxY) => {
  let [x, y] = [500, 1];
  let units = 0;
  while (y != 0) {
    units++;
    [x, y] = dropSand(grid, [500, 0], maxY);
    setValue(grid, x, y, "o");
  }
  return units;
};

const addFloor = (grid, [x1, x2], y) => {
  for (let x = x1; x <= x2; x++) {
    setValue(grid, x, y, "#");
  }
};

let grid2 = { ...grid };
addFloor(grid2, [500 - maxY - 2, 500 + maxY + 2], maxY + 2);
const part2 = fillPart2(grid2, maxY + 2);
console.log(part2);
