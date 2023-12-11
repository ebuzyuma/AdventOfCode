const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function getKey(row, col) {
  return `${row}x${col}`;
}

function setValue(map, row, col, value) {
  map[getKey(row, col)] = value;
}

function getValue(map, row, col) {
  return map[getKey(row, col)];
}

let emptySpaceChar = ".";
let galaxyChar = "#";

function applyGravityEffect(input) {
  let colLength = input[0].length;
  let result = [];
  for (let row = 0; row < input.length; row++) {
    result.push(input[row]);
    if (!input[row].includes(galaxyChar)) {
      result.push(emptySpaceChar.repeat(colLength));
    }
  }

  let r2 = Array(result.length).fill("");
  for (let col = 0; col < colLength; col++) {
    let column = result.map((r) => r[col]);
    r2 = r2.map((x, i) => x + column[i]);
    if (!column.includes(galaxyChar)) {
      r2 = r2.map((x) => x + emptySpaceChar);
    }
  }

  return r2;
}

function findEmpty(input) {
  let colLength = input[0].length;
  let emptyRows = [];
  for (let row = 0; row < input.length; row++) {
    if (!input[row].includes(galaxyChar)) {
      emptyRows.push(row);
    }
  }

  let emptyCols = [];
  for (let col = 0; col < colLength; col++) {
    let column = input.map((r) => r[col]);
    if (!column.includes(galaxyChar)) {
      emptyCols.push(col);
    }
  }

  return [emptyRows, emptyCols];
}

function parseMap(input) {
  let map = {};
  let galaxies = [];
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      let value = input[row][col];
      setValue(map, row, col, value);
      if (value == galaxyChar) {
        galaxies.push({ row, col });
      }
    }
  }

  return [map, galaxies];
}

function findPath(map, from, to) {
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

function findPathWithSpace(map, from, to, emptyRows, emptyCols, space) {
  let base = Math.abs(from.row - to.row) + Math.abs(from.col - to.col);

  let [min, max] = [Math.min(from.row, to.row), Math.max(from.row, to.row)];
  let emptyRowsIncluded = emptyRows.filter((x) => x > min && x < max);
  let extraRows = emptyRowsIncluded.length * (space - 1);

  [min, max] = [Math.min(from.col, to.col), Math.max(from.col, to.col)];
  let emptyColsIncluded = emptyCols.filter((x) => x > min && x < max);
  let extraCols = emptyColsIncluded.length * (space - 1);

  return base + extraCols + extraRows;
}

function solve(input) {
  let enlarge = applyGravityEffect(input);
  let [map, galaxies] = parseMap(enlarge);

  let sum = 0;
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let distance = findPath(map, galaxies[i], galaxies[j]);
      sum += distance;
    }
  }

  return [sum];
}

function solve2(input) {
  let [map, galaxies] = parseMap(input);
  let [emptyRows, emptyCols] = findEmpty(input);

  let sum = 0;
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let distance = findPathWithSpace(
        map,
        galaxies[i],
        galaxies[j],
        emptyRows,
        emptyCols,
        1000000
      );
      sum += distance;
    }
  }

  return [sum];
}

console.log("example:", solve(exampleInput), solve2(exampleInput));
console.log(" puzzle:", solve(puzzleInput), solve2(puzzleInput));
