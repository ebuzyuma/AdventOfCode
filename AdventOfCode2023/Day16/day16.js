const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function getKey(row, col) {
  return `${row}x${col}`;
}

function setValue(grid, row, col, value) {
  grid[getKey(row, col)] = value;
}

function getValue(grid, row, col) {
  return grid[getKey(row, col)];
}

function addValue(grid, row, col, value) {
  grid[getKey(row, col)] = grid[getKey(row, col)] || [];
  grid[getKey(row, col)].push(value);
}

function move(pos, dir) {
  return { row: pos.row + dir.row, col: pos.col + dir.col };
}

function print(grid, visited) {
  for (let row = 0; row < grid.length; row++) {
    let rowStr = "";
    for (let col = 0; col < grid[row].length; col++) {
      let element = grid[row][col];
      let curVisited = getValue(visited, row, col);
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
  console.log("            ");
}

function dirToStr({ row, col }) {
  if (row === 0 && col === -1) return "<";
  if (row === 0 && col === 1) return ">";
  if (row === -1 && col === 0) return "^";
  if (row === 1 && col === 0) return "v";
}

function startBeam(grid, rows, cols, start, dir, visited) {
  // BFS
  let visitedPositions = {};
  let toVisit = [{ pos: start, dir }];
  while (toVisit.length > 0) {
    // print(grid, visitedPositions);
    let curr = toVisit.pop();
    visited.push(JSON.stringify(curr));
    addValue(visitedPositions, curr.pos.row, curr.pos.col, dirToStr(curr.dir));
    let currValue = grid[curr.pos.row][curr.pos.col];
    let next = [];
    if (currValue === ".") {
      let nextPos = move(curr.pos, curr.dir);
      next.push({ pos: nextPos, dir: curr.dir });
    } else if (currValue === "/") {
      let nextDir = { row: -curr.dir.col, col: -curr.dir.row };
      let nextMirrorPos = move(curr.pos, nextDir);
      next.push({ pos: nextMirrorPos, dir: nextDir });
    } else if (currValue === "\\") {
      let nextDir = { row: curr.dir.col, col: curr.dir.row };
      let nextMirrorPos = move(curr.pos, nextDir);
      next.push({ pos: nextMirrorPos, dir: nextDir });
    } else if (currValue === "-") {
      if (curr.dir.row === 0) {
        // pass through
        let nextSplitPos = move(curr.pos, curr.dir);
        next.push({ pos: nextSplitPos, dir: curr.dir });
      } else {
        // split
        let nextSplit = [
          { row: 0, col: -1 },
          { row: 0, col: 1 },
        ].map((d) => ({ pos: move(curr.pos, d), dir: d }));
        next.push(...nextSplit);
      }
    } else if (currValue === "|") {
      if (curr.dir.col === 0) {
        // pass through
        let nextSplitPos = move(curr.pos, curr.dir);
        next.push({ pos: nextSplitPos, dir: curr.dir });
      } else {
        // split
        let nextSplit = [
          { row: -1, col: 0 },
          { row: 1, col: 0 },
        ].map((d) => ({ pos: move(curr.pos, d), dir: d }));
        next.push(...nextSplit);
      }
    }

    let available = next.filter(
      ({ pos }) => pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols
    );
    let visitAdd = available.filter((x) => !visited.includes(JSON.stringify(x)));
    toVisit.push(...visitAdd);
  }

  return visitedPositions;
}

function solve(input) {
  let grid = input.map((r) => r.split(""));

  // Part 1
  let visited = [];
  let position = startBeam(
    grid,
    input.length,
    input[0].length,
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    visited
  );

  let max = 0;
  for (let row = 0; row < grid.length; row++) {
    console.log(row);
    let x1 = startBeam(
      grid,
      input.length,
      input[0].length,
      { row, col: 0 },
      { row: 0, col: 1 },
      []
    );

    let x2 = startBeam(
      grid,
      input.length,
      input[0].length,
      { row, col: input[0].length - 1 },
      { row: 0, col: -1 },
      []
    );
    max = Math.max(max, Object.keys(x1).length, Object.keys(x2).length);
  }

  for (let col = 0; col < grid[0].length; col++) {
    console.log(col);
    let x1 = startBeam(
      grid,
      input.length,
      input[0].length,
      { row: 0, col },
      { row: 1, col: 0 },
      []
    );

    let x2 = startBeam(
      grid,
      input.length,
      input[0].length,
      { row: input.length - 1, col: input[0].length - 1 },
      { row: -1, col: 0 },
      []
    );
    max = Math.max(max, Object.keys(x1).length, Object.keys(x2).length);
  }

  let p1 = visited.length;

  // Part 2
  let p2 = Object.keys(position).length;

  return [p1, p2, max];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
