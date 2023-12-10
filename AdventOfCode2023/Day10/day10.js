const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

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

function findEnclosed(map, loop) {

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
function pointIsInPoly(p, polygon) {
  var isInside = false;
  var minX = polygon[0].x,
    maxX = polygon[0].x;
  var minY = polygon[0].y,
    maxY = polygon[0].y;
  for (var n = 1; n < polygon.length; n++) {
    var q = polygon[n];
    minX = Math.min(q.x, minX);
    maxX = Math.max(q.x, maxX);
    minY = Math.min(q.y, minY);
    maxY = Math.max(q.y, maxY);
  }

  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
    return false;
  }

  var i = 0,
    j = polygon.length - 1;
  for (i, j; i < polygon.length; j = i++) {
    if (
      polygon[i].y > p.y != polygon[j].y > p.y &&
      p.x <
        ((polygon[j].x - polygon[i].x) * (p.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) +
          polygon[i].x
    ) {
      isInside = !isInside;
    }
  }

  return isInside;
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

  let polygon = loop.map(([r, c]) => ({ x: c, y: r }));
  let loop2 = loop.map(x => key(x[0], x[1]));

  let inside = 0;
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (loop2.includes(key(row, col))) {
        continue;
      }
      if (pointIsInPoly({ x: col, y: row }, polygon)) {
        inside++;
      }
    }
  }
  // console.log(loop);

  // let connections = findConnections(map, sRow, sCol);
  // let previous = [
  //   [sRow, sCol],
  //   [sRow, sCol],
  // ];
  // let steps = 1;

  // while (key(connections[0]) != key(connections[1])
  //   && !(key(previous[0]) == key(connections[1]) && key(previous[1]) == key(connections[0]))
  // ) {
  //   let nextConnections = [
  //     findNext(map, connections[0], previous[0]),
  //     findNext(map, connections[1], previous[1]),
  //   ];
  //   previous = connections;
  //   connections = nextConnections;
  //   steps++;
  //   if (steps > 7060) {
  //     console.log(previous[0], '->', connections[0], previous[1], '->', connections[1]);
  //   }
  // }

  return [(loop.length - 1) / 2, inside];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
