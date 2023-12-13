const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function isColReflected(map, col) {
  let maxCol = map[0].length;
  let leftCol = col - 1;
  let rightCol = col;
  while (leftCol >= 0 && rightCol < maxCol) {
    if (map.some((row) => row[leftCol] !== row[rightCol])) {
      return false;
    }
    leftCol--;
    rightCol++;
  }

  return true;
}

function getReflectionColumn(map) {
  let maxCol = map[0].length;

  let col = 1;
  while (!isColReflected(map, col) && col < maxCol) {
    col++;
  }
  return col == maxCol ? null : col;
}

function getReflectionColumns(map) {
  let maxCol = map[0].length;
  let result = [];
  for (let col = 1; col < maxCol; col++) {
    if (isColReflected(map, col)) {
      result.push(col);
    }
  }
  return result;
}

function isRowReflected(map, row) {
  let maxCol = map.length;
  let upRow = row - 1;
  let downRow = row;
  while (upRow >= 0 && downRow < maxCol) {
    if (map[upRow] !== map[downRow]) {
      return false;
    }
    upRow--;
    downRow++;
  }

  return true;
}

function getReflectionRow(map) {
  let maxRow = map.length;

  let row = 1;
  while (!isRowReflected(map, row) && row < maxRow) {
    row++;
  }
  return row == maxRow ? null : row;
}

function getReflectionRows(map) {
  let maxRow = map.length;

  let result = [];
  for (let row = 1; row < maxRow; row++) {
    if (isRowReflected(map, row)) {
      result.push(row);
    }
  }
  return result;
}

function findSmudge(map) {
  let originalReflectionColumn = getReflectionColumn(map);
  let originalReflectionRow = getReflectionRow(map);

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      let oldRow = map[row];
      let newValue = map[row][col] === "." ? "#" : ".";
      let newRow = map[row].substring(0, col) + newValue + map[row].substring(col + 1);
      map[row] = newRow;

      let reflectionCols = getReflectionColumns(map);
      let cols = reflectionCols.filter((r) => r !== originalReflectionColumn);
      if (cols.length > 0) {
        return [cols[0], null];
      }
      let reflectionRows = getReflectionRows(map);
      let rows = reflectionRows.filter(r => r !== originalReflectionRow);
      if (rows.length > 0) {
        return [null, rows[0]];
      }
      map[row] = oldRow;
    }
  }
  throw Error("Not found");
}

function solve(input) {
  let maps = input.splitBy("");

  // Part 1
  let p1 = 0;
  for (let map of maps) {
    let reflectionCol = getReflectionColumn(map);
    if (reflectionCol) {
      p1 += reflectionCol;
    } else {
      let reflectionRow = getReflectionRow(map);
      p1 += 100 * reflectionRow;
    }
  }

  // Part 2
  let p2 = 0;
  for (let map of maps) {
    let [reflectionCol, reflectionRow] = findSmudge(map);
    if (reflectionCol) {
      p2 += reflectionCol;
    } else {
      p2 += 100 * reflectionRow;
    }
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
