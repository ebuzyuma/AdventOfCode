const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

function parseInput(lines) {
  let grid = {};
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "#") {
        setValue(grid, [j, i], [j, i]);
      }
    }
  }

  return grid;
}

const setValue = (grid, [x, y], value) => (grid[`${x},${y}`] = value);
const getValue = (grid, [x, y], fallback = undefined) => grid[`${x},${y}`] || fallback;
const print = (grid) => {
  let values = Object.values(grid);
  let xs = values.map((v) => v[0]);
  let ys = values.map((v) => v[1]);
  let [xMin, xMax] = [Math.min(...xs), Math.max(...xs)];
  let [yMin, yMax] = [Math.min(...ys), Math.max(...ys)];
  let str = "";
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      let g = getValue(grid, [x, y]) ? "#" : " ";
      str += g;
    }
    str += "\n";
  }
  console.log(str);
};

const directions = [
  // north
  [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  // south
  [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
  // west
  [
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ],
  // east
  [
    [1, -1],
    [1, 0],
    [1, 1],
  ],
];

function plus([a, b], [x, y]) {
  return [a + x, b + y];
}

function getNext(grid, elf, dirs) {
  let hasNeighborsPerDirection = dirs.map((id) =>
    directions[id].some((d) => !!getValue(grid, plus(elf, d)))
  );

  if (hasNeighborsPerDirection.every((d) => !d)) {
    return elf;
  }

  let iMove = hasNeighborsPerDirection.findIndex((d) => !d);
  if (iMove >= 0) {
    let next = plus(elf, directions[dirs[iMove]][1]);
    return next;
  }

  // nowhere to move
  return elf;
}

function eq([a, b], [x, y]) {
  return a === x && b === y;
}

function round(grid, dirs) {
  let elves = Object.values(grid);
  let proposals = {}; // newPosition => [elf comes from]
  let anyMoves = false;
  for (let elf of elves) {
    let nextPosition = getNext(grid, elf, dirs);
    if (!eq(elf, nextPosition)) {
      // Move
      anyMoves = true;
    }
    let proposal = getValue(proposals, nextPosition);
    if (!proposal) {
      proposal = [];
      setValue(proposals, nextPosition, proposal);
    }
    proposal.push(elf);
  }

  let nextGrid = {};
  for (let [key, fromElves] of Object.entries(proposals)) {
    if (fromElves.length === 1) {
      // move
      let p = key.split(",").map((x) => +x);
      setValue(nextGrid, p, p);
    } else {
      // multiple proposals => stay
      for (let elf of fromElves) {
        setValue(nextGrid, elf, elf);
      }
    }
  }

  return [nextGrid, anyMoves];
}

function coverage(grid) {
  let values = Object.values(grid);
  let xs = values.map((v) => v[0]);
  let ys = values.map((v) => v[1]);
  let [xMin, xMax] = [Math.min(...xs), Math.max(...xs)];
  let [yMin, yMax] = [Math.min(...ys), Math.max(...ys)];
  let count = 0;
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      if (!getValue(grid, [x, y])) {
        count++;
      }
    }
  }

  return count;
}

function iterate(grid, time) {
  //print(grid);
  let dirs = [0, 1, 2, 3];
  for (let t = 1; t <= time; t++) {
    //console.log(t);
    [grid, anyMoves] = round(grid, dirs);
    const first = dirs.shift();
    dirs.push(first);
    //print(grid);
  }

  let c = coverage(grid);
  return c;
}

function toFixed(grid) {
  let anyMoves = true;
  let i = 1;
  let dirs = [0, 1, 2, 3];
  while (anyMoves) {
    [grid, anyMoves] = round(grid, dirs);
    const first = dirs.shift();
    dirs.push(first);
    i++;
  }

  return [i - 1];
}

const input = parseInput(lines);
const exInput = parseInput(example);

console.log(iterate(exInput, 10));
console.log(iterate(input, 10));

console.log(toFixed(exInput));
console.log(toFixed(input));
