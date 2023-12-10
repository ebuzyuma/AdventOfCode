const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

let rowIndex = 0;
let colIndex = 1;

function key(row, col) {
  return `${row}x${col}`;
}

function setValue(map, row, col, value) {
  map[`${row}x${col}`] = value;
}

function getValue(map, row, col) {
  return map[`${row}x${col}`];
}

let start = "S";
let vPipe = "|";
let hPipe = "-";
let upToRight = "L";
let upToLeft = "J";
let downToRight = "F";
let downToLeft = "7";

function findConnections(map, sRow, sCol) {
  let connections = [];

  let above = getValue(map, sRow - 1, sCol);
  if ([vPipe, downToLeft, downToRight].includes(above)) {
    connections.push([sRow - 1, sCol]);
  }

  let below = getValue(map, sRow + 1, sCol);
  if ([vPipe, upToLeft, upToRight].includes(below)) {
    connections.push([sRow + 1, sCol]);
  }

  let left = getValue(map, sRow, sCol - 1);
  if ([hPipe, downToRight, upToRight].includes(left)) {
    connections.push([sRow, sCol - 1]);
  }

  let right = getValue(map, sRow, sCol + 1);
  if ([hPipe, downToLeft, upToLeft].includes(right)) {
    connections.push([sRow, sCol + 1]);
  }

  if (connections.length > 2) {
    throw Error("Unexpected");
  }

  return connections;
}

function getConnections(map, row, col) {
  let value = getValue(map, row, col);
  switch (value) {
    case vPipe:
      return [
        [row - 1, col],
        [row + 1, col],
      ];
    case hPipe:
      return [
        [row, col - 1],
        [row, col + 1],
      ];
    case upToLeft:
      return [
        [row - 1, col],
        [row, col - 1],
      ];
    case upToRight:
      return [
        [row - 1, col],
        [row, col + 1],
      ];
    case downToLeft:
      return [
        [row + 1, col],
        [row, col - 1],
      ];
    case downToRight:
      return [
        [row + 1, col],
        [row, col + 1],
      ];
    default:
      throw Error("wrong pipe: " + value);
  }
}

function findNext(map, [row, col], prev) {
  let connections = getConnections(map, row, col);
  let next = connections.find((cords) => key(cords) != key(prev));
  return next;
}

function findLoop(map, [sRow, sCol]) {
  let loop = [[sRow, sCol]];
  let connections = findConnections(map, sRow, sCol);
  let curr = connections[0];
  loop.push(curr);
  let prev = [sRow, sCol];
  while (key([sRow, sCol]) !== key(curr)) {
    let next = findNext(map, curr, prev);
    prev = curr;
    curr = next;
    loop.push(curr);
  }

  return loop;
}

function pointIsInPolygon([row, col], polygon) {
  let isInside = false;
  let minRow = polygon[0][rowIndex];
  let maxRow = polygon[0][rowIndex];
  let minCol = polygon[0][colIndex];
  let maxCol = polygon[0][colIndex];
  for (let [r, c] of polygon) {
    minRow = Math.min(r, minRow);
    maxRow = Math.max(r, maxRow);
    minCol = Math.min(c, minCol);
    maxCol = Math.max(c, maxCol);
  }

  if (row < minRow || row > maxRow || col < minCol || col > maxCol) {
    return false;
  }

  // Source: https://wrfranklin.org/Research/Short_Notes/pnpoly.html
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let pi = polygon[i];
    let pj = polygon[j];
    if (
      pi[rowIndex] > row != pj[rowIndex] > row &&
      col <
        ((pj[colIndex] - pi[colIndex]) * (row - pi[rowIndex])) / (pj[rowIndex] - pi[rowIndex]) +
          pi[colIndex]
    ) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function findEnclosed(input, map, loop) {
  let inside = [];
  let loop2 = loop.map((x) => key(x[0], x[1]));

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (loop2.includes(key(row, col))) {
        continue;
      }
      if (pointIsInPolygon([row, col], loop)) {
        inside.push([row, col]);
      }
    }
  }

  return inside;
}

function solve(input) {
  let map = {};
  let sRow = 0,
    sCol = 0;
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      let value = input[row][col];
      setValue(map, row, col, value);
      if (value == start) {
        sRow = row;
        sCol = col;
      }
    }
  }

  let loop = findLoop(map, [sRow, sCol]);
  let inside = findEnclosed(input, map, loop);

  return [(loop.length - 1) / 2, inside.length];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
