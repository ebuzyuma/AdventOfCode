const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function getKey({ row, col }) {
  return `${row}x${col}`;
}

function getValue(grid, pos) {
  return grid[getKey(pos)];
}

function addValue(grid, pos, dirValue) {
  let key = getKey(pos);
  grid[key] = grid[key] || [];
  grid[key].push(dirToStr(dirValue));
}

function hasValue(grid, pos, value) {
  let arr = grid[getKey(pos)] || [];
  return arr.includes(dirToStr(value));
}

function move(pos, dir) {
  return { row: pos.row + dir.row, col: pos.col + dir.col };
}

function print(grid, visited) {
  for (let row = 0; row < grid.length; row++) {
    let rowStr = "";
    for (let col = 0; col < grid[row].length; col++) {
      let element = grid[row][col];
      let curVisited = getValue(visited, { row, col });
      if (element === "." && curVisited) {
        let str = curVisited.length === 1 ? curVisited[0] : curVisited.length;
        rowStr += str;
      } else {
        rowStr += element;
      }
    }
    console.log(rowStr);
  }
  console.log("");
  console.log("");
}

function dirToStr({ row, col }) {
  if (row === 0 && col === -1) return "<";
  if (row === 0 && col === 1) return ">";
  if (row === -1 && col === 0) return "^";
  if (row === 1 && col === 0) return "v";
}

function runBeam(grid, start, dir) {
  let rows = grid.length;
  let cols = grid[0].length;
  let visitedPositions = {};
  let toVisit = [{ pos: start, dir }];
  while (toVisit.length > 0) {
    // print(grid, visitedPositions);
    let curr = toVisit.pop();
    addValue(visitedPositions, curr.pos, curr.dir);
    let currValue = grid[curr.pos.row][curr.pos.col];
    let nextDirs = [];
    if (currValue === ".") {
      nextDirs.push(curr.dir);
    } else if (currValue === "/") {
      let nextDir = { row: -curr.dir.col, col: -curr.dir.row };
      nextDirs.push(nextDir);
    } else if (currValue === "\\") {
      let nextDir = { row: curr.dir.col, col: curr.dir.row };
      nextDirs.push(nextDir);
    } else if (currValue === "-") {
      if (curr.dir.row === 0) {
        // pass through
        nextDirs.push(curr.dir);
      } else {
        // split
        let splitDirs = [
          { row: 0, col: -1 },
          { row: 0, col: 1 },
        ];
        nextDirs.push(...splitDirs);
      }
    } else if (currValue === "|") {
      if (curr.dir.col === 0) {
        // pass through
        nextDirs.push(curr.dir);
      } else {
        // split
        let splitDirs = [
          { row: -1, col: 0 },
          { row: 1, col: 0 },
        ];
        nextDirs.push(...splitDirs);
      }
    }

    let next = nextDirs.map((dir) => ({ pos: move(curr.pos, dir), dir }));
    let available = next.filter(
      ({ pos }) => pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols
    );
    let notVisited = available.filter((x) => !hasValue(visitedPositions, x.pos, x.dir));
    toVisit.push(...notVisited);
  }

  return visitedPositions;
}

function countEnergized(visited) {
  return Object.keys(visited).length;
}

function solve(input) {
  let grid = input.map((r) => r.split(""));

  // Part 1
  let visited = runBeam(grid, { row: 0, col: 0 }, { row: 0, col: 1 });
  let p1 = countEnergized(visited);

  // Part 2
  let rows = grid.length;
  let cols = grid[0].length;
  let max = 0;
  for (let row = 0; row < rows; row++) {
    let leftToRight = runBeam(grid, { row, col: 0 }, { row: 0, col: 1 });

    let rightToLeft = runBeam(grid, { row, col: cols - 1 }, { row: 0, col: -1 });
    max = Math.max(max, countEnergized(leftToRight), countEnergized(rightToLeft));
  }

  for (let col = 0; col < cols; col++) {
    let topToBottom = runBeam(grid, { row: 0, col }, { row: 1, col: 0 });

    let bottomToTop = runBeam(grid, { row: rows - 1, col }, { row: -1, col: 0 });
    max = Math.max(max, countEnergized(topToBottom), countEnergized(bottomToTop));
  }

  return [p1, max];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
