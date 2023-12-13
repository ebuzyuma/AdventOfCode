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

function getVerticalReflectionColumn(map) {
  let maxCol = map[0].length;

  let col = 1;
  while (!isColReflected(map, col) && col < maxCol) {
    col++;
  }
  return col == maxCol ? null : col;
}

function getVerticalReflectionColumns(map) {
  let maxCol = map[0].length;

  let result = [];
  let col = 1;
  while (col < maxCol) {
    if (isColReflected(map, col)) {
      result.push(col);
    }
    col++;
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

function getHorizontalReflection(map) {
  let maxRow = map.length;

  let row = 1;
  while (!isRowReflected(map, row) && row < maxRow) {
    row++;
  }
  return row == maxRow ? null : row;
}

function getHorizontalReflectionColumns(map) {
  let maxRow = map.length;

  let result = [];
  let row = 1;
  while (row < maxRow) {
    if (isRowReflected(map, row)) {
      result.push(row);
    }
    row++;
  }
  return result;
}

function findSmudge(map) {
  let colR = getVerticalReflectionColumn(map);
  let rowR = getHorizontalReflection(map);

  let grid = map.map((row) => row.split(""));
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      let oldRow = map[row];
      let newValue = map[row][col] === "." ? "#" : ".";
      let newRow = map[row].substring(0, col) + newValue + map[row].substring(col + 1);
      map[row] = newRow;

      let colReflection = getVerticalReflectionColumns(map);
      let x = colReflection.filter((r) => r !== colR);
      if (x.length > 0) {
        return [x[0], null];
      }
      let rowReflection = getHorizontalReflectionColumns(map);
      let y = rowReflection.filter(r => r !== rowR);
      if (y.length > 0) {
        return [null, y[0]];
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
    let verticalReflection = getVerticalReflectionColumn(map);
    if (verticalReflection) {
      p1 += verticalReflection;
    } else {
      let rowReflection = getHorizontalReflection(map);
      p1 += 100 * rowReflection;
    }
  }

  // Part 2
  let p2 = 0;
  for (let map of maps) {
    let [v, h] = findSmudge(map);
    if (v) {
      p2 += v;
    } else {
      p2 += 100 * h;
    }
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
