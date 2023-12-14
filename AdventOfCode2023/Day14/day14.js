const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function tiltNorth(grid) {
  for (let col = 0; col < grid[0].length; col++) {
    let stopPosition = undefined;
    for (let row = 0; row < grid.length; row++) {
      let value = grid[row][col];
      if (value == "O" && stopPosition) {
        grid[stopPosition[0]][stopPosition[1]] = value;
        grid[row][col] = ".";
        stopPosition = [stopPosition[0] + 1, stopPosition[1]];
      } else if (value == "." && !stopPosition) {
        stopPosition = [row, col];
      } else if (value == "#") {
        stopPosition = undefined;
      }
    }
  }
}

function tiltWest(grid) {
  for (let row = 0; row < grid.length; row++) {
    let stopPosition = undefined;
    for (let col = 0; col < grid[0].length; col++) {
      let value = grid[row][col];
      if (value == "O" && stopPosition) {
        grid[stopPosition[0]][stopPosition[1]] = value;
        grid[row][col] = ".";
        stopPosition = [stopPosition[0], stopPosition[1] + 1];
      } else if (value == "." && !stopPosition) {
        stopPosition = [row, col];
      } else if (value == "#") {
        stopPosition = undefined;
      }
    }
  }
}

function tiltSouth(grid) {
  for (let col = 0; col < grid[0].length; col++) {
    let stopPosition = undefined;
    for (let row = grid.length - 1; row >= 0; row--) {
      let value = grid[row][col];
      if (value == "O" && stopPosition) {
        grid[stopPosition[0]][stopPosition[1]] = value;
        grid[row][col] = ".";
        stopPosition = [stopPosition[0] - 1, stopPosition[1]];
      } else if (value == "." && !stopPosition) {
        stopPosition = [row, col];
      } else if (value == "#") {
        stopPosition = undefined;
      }
    }
  }
}

function tiltEast(grid) {
  for (let row = 0; row < grid.length; row++) {
    let stopPosition = undefined;
    for (let col = grid[0].length - 1; col >= 0; col--) {
      let value = grid[row][col];
      if (value == "O" && stopPosition) {
        grid[stopPosition[0]][stopPosition[1]] = value;
        grid[row][col] = ".";
        stopPosition = [stopPosition[0], stopPosition[1] - 1];
      } else if (value == "." && !stopPosition) {
        stopPosition = [row, col];
      } else if (value == "#") {
        stopPosition = undefined;
      }
    }
  }
}

function cycle(grid) {
  tiltNorth(grid);
  tiltWest(grid);
  tiltSouth(grid);
  tiltEast(grid);
}

function score(grid) {
  let score = 0;
  let maxRow = grid.length;
  for (let row = 0; row < grid.length; row++) {
    let distToSouth = maxRow - row;
    for (let col = 0; col < grid[0].length; col++) {
      let value = grid[row][col];
      if (value == "O") {
        score += distToSouth;
      }
    }
  }

  return score;
}

function findRocks(grid) {
  let roundedRocks = [];
  let cubeRocks = {};
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let value = grid[row][col];

      if (value == "O") {
        roundedRocks.push({ row, col });
      } else if (value == "#") {
        cubeRocks[`row_${row}`] ??= [];
        cubeRocks[`row_${row}`].push(col);
        cubeRocks[`row_${row}`] = cubeRocks[`row_${row}`].numSort();

        cubeRocks[`col_${col}`] ??= [];
        cubeRocks[`col_${col}`].push(row);
        cubeRocks[`col_${col}`] = cubeRocks[`col_${col}`].numSort();
      }
    }
  }

  return [roundedRocks, cubeRocks];
}

function tilt(roundedRocks, cubeRocks, direction, maxRow, maxCol) {
  let newPosition = [];
  let placed = new Set();
  for (let { row, col } of roundedRocks) {
    if (direction === "N") {
      let colStopRocks = cubeRocks[`col_${col}`];
      let stopRocks = colStopRocks?.filter((x) => x < row);
      let newRow = stopRocks?.last() + 1 || 0;
      while (placed.has(`${newRow}x${col}`)) {
        newRow++;
      }
      newPosition.push({ row: newRow, col });
      placed.add(`${newRow}x${col}`);
    } else if (direction === "W") {
      let rowStopRocks = cubeRocks[`row_${row}`];
      let stopRocks = rowStopRocks?.filter((x) => x < col);
      let newCol = stopRocks?.last() + 1 || 0;
      while (placed.has(`${row}x${newCol}`)) {
        newCol++;
      }
      newPosition.push({ row, col: newCol });
      placed.add(`${row}x${newCol}`);
    } else if (direction === "S") {
      let colStopRocks = cubeRocks[`col_${col}`];
      let stopRocks = colStopRocks?.filter((x) => x > row);
      let newRow = stopRocks && stopRocks?.length > 0 ? stopRocks[0] - 1 : maxRow - 1;
      while (placed.has(`${newRow}x${col}`)) {
        newRow--;
      }
      newPosition.push({ row: newRow, col });
      placed.add(`${newRow}x${col}`);
    } else if (direction === "E") {
      let rowStopRocks = cubeRocks[`row_${row}`];
      let stopRocks = rowStopRocks?.filter((x) => x > col);
      let newCol = stopRocks && stopRocks.length > 0 ? stopRocks[0] - 1 : maxCol - 1;
      while (placed.has(`${row}x${newCol}`)) {
        newCol--;
      }
      newPosition.push({ row, col: newCol });
      placed.add(`${row}x${newCol}`);
    }
  }

  return newPosition;
}

function tilt2(roundedRocks, cubeRocks, direction, maxRow, maxCol) {
  let newPosition = [];
  let placed = new Set();
  for (let { row, col } of roundedRocks) {
    if (direction === "N") {
      let colStopRocks = cubeRocks[`col_${col}`];
      let stopRocks = colStopRocks?.filter((x) => x < row);
      let newRow = stopRocks?.last() + 1 || 0;
      while (placed.has(`${newRow}x${col}`)) {
        newRow++;
      }
      newPosition.push({ row: newRow, col });
      placed.add(`${newRow}x${col}`);
    } else if (direction === "W") {
      let rowStopRocks = cubeRocks[`row_${row}`];
      let stopRocks = rowStopRocks?.filter((x) => x < col);
      let newCol = stopRocks?.last() + 1 || 0;
      while (placed.has(`${row}x${newCol}`)) {
        newCol++;
      }
      newPosition.push({ row, col: newCol });
      placed.add(`${row}x${newCol}`);
    } else if (direction === "S") {
      let colStopRocks = cubeRocks[`col_${col}`];
      let stopRocks = colStopRocks?.filter((x) => x > row);
      let newRow = stopRocks && stopRocks?.length > 0 ? stopRocks[0] - 1 : maxRow - 1;
      while (placed.has(`${newRow}x${col}`)) {
        newRow--;
      }
      newPosition.push({ row: newRow, col });
      placed.add(`${newRow}x${col}`);
    } else if (direction === "E") {
      let rowStopRocks = cubeRocks[`row_${row}`];
      let stopRocks = rowStopRocks?.filter((x) => x > col);
      let newCol = stopRocks && stopRocks.length > 0 ? stopRocks[0] - 1 : maxCol - 1;
      while (placed.has(`${row}x${newCol}`)) {
        newCol--;
      }
      newPosition.push({ row, col: newCol });
      placed.add(`${row}x${newCol}`);
    }
  }

  return newPosition;
}

function printGrid(roundedRocks, cubeRocks, maxRow, maxCol) {
  for (let row = 0; row < maxRow; row++) {
    let rowStr = "";
    let rowCubeRocks = cubeRocks[`row_${row}`];
    for (let col = 0; col < maxCol; col++) {
      if (roundedRocks.some((x) => x.row === row && x.col === col)) {
        rowStr += "O";
      } else if (rowCubeRocks?.includes(col)) {
        rowStr += "#";
      } else {
        rowStr += ".";
      }
    }
    console.log(rowStr);
  }
  console.log();
}

function score2(roundedRocks, maxRow) {
  let score = 0;
  for (let rock of roundedRocks) {
    let distToSouth = maxRow - rock.row;
    score += distToSouth;
  }

  return score;
}

function solve(input) {
  let grid = input.map((row) => row.split(""));
  let [roundedRocks, cubeRocks] = findRocks(grid);

  // Part 1
  tiltNorth(grid);
  let p1 = score(grid);

  // Part 2
  let cycles = 1000000000;
  let memo = {};
  for (let i = 0; i < cycles; i++) {
    let key = roundedRocks.map((x) => `${x.row}x${x.col}`).join("|");
    if (i % 1000000 == 0) {
      console.log(i, score2(roundedRocks, grid.length));
    }
    roundedRocks = tilt(roundedRocks, cubeRocks, "N", grid.length, grid[0].length);
    if (i == 0) {
      console.log(i, score2(roundedRocks, grid.length));
    }

    roundedRocks = tilt(roundedRocks, cubeRocks, "W", grid.length, grid[0].length);
    roundedRocks = tilt(roundedRocks, cubeRocks, "S", grid.length, grid[0].length);
    roundedRocks = tilt(roundedRocks, cubeRocks, "E", grid.length, grid[0].length);

    key = roundedRocks
      .sort((a, b) => (a.row === b.row ? a.col - b.col : a.row - b.row))
      .map((x) => `${x.row}x${x.col}`)
      .join("|");
    if (memo[key]) {
      console.log(i, memo[key]);
      let cycleLength = i - memo[key].i;
      let left = (cycles - i) % cycleLength;
      i = cycles - left;
    }
    memo[key] = { i, score: score2(roundedRocks, grid.length) };
    // printGrid(roundedRocks, cubeRocks, grid.length, grid[0].length);
  }
  let p2 = score2(roundedRocks, grid.length);

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
