import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

let dirs = [
  { dr: -1, dc: 0 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: 1 },
  { dr: 0, dc: -1 },
];

function step(grid, positions) {
  let nextPosition = [];
  for (let pos of positions) {
    let next = dirs.map((d) => ({
      row: pos.row + d.dr,
      col: pos.col + d.dc,
    }));
    let possible = next.filter(
      (p) =>
        p.row >= 0 &&
        p.row < grid.length &&
        p.col >= 0 &&
        p.col < grid[0].length &&
        grid[p.row][p.col] !== "#"
    );
    nextPosition.push(...possible);
  }

  nextPosition = nextPosition.uniqueBy((p) => `${p.row}x${p.col}`);
  return nextPosition;
}

function getKey({ row, col }) {
  return `${row}x${col}`;
}

function getValue(grid, pos) {
  return grid[getKey(pos)];
}

function setValue(grid, pos, value) {
  let key = getKey(pos);
  grid[key] = value;
}

function print(grid, rows, cols, positions, positions2) {
  for (let r = -rows; r < 2 * rows; r++) {
    let rowStr = `${r}\t`;
    for (let c = -cols; c < 2 * cols; c++) {
      let key = getKey({ row: (r + rows) % rows, col: (cols + c) % cols });
      if (positions.some(({ row, col }) => row === r && col === c)) {
        rowStr += "O";
      } else if (positions2.some(({ row, col }) => row === r && col === c)) {
        if (grid[key] === "#") throw new Error("Positions2 has item on rock");
        rowStr += "V";
      } else {
        rowStr += grid[key] ?? ".";
      }
    }
    console.log(rowStr);
  }
  console.log("");
  console.log("");
}

function printStepsAndCounts(grid, rows, cols, initPosition) {
  let positions65;
  let middlePositions = [];
  let positions = initPosition;
  for (let step = 1; step < 340; step++) {
    positions = stepNoBorders(grid, rows, cols, positions);
    if (step === 65)
      positions65 = [
        ...positions.map((p) => ({ row: p.row, col: p.col + 131 })),
        ...positions.map((p) => ({ row: p.row, col: p.col - 131 })),
        ...positions.map((p) => ({ row: p.row + 131, col: p.col })),
        ...positions.map((p) => ({ row: p.row - 131, col: p.col })),
      ];
    if (step === 196) {
      middlePositions = positions.filter((p) => Math.abs(p.row) + Math.abs(p.col) <= 65);
      middlePositions = [
        ...middlePositions,
        ...middlePositions.map((p) => ({ row: p.row, col: p.col + 131 })),
        ...middlePositions.map((p) => ({ row: p.row + 131, col: p.col })),
        ...middlePositions.map((p) => ({ row: p.row + 131, col: p.col + 131 })),
      ];
    }
    if ((step - 65) % 131 === 0 || [1, 65, 66].includes(step)) {
      console.log(step, positions.length);
      // print(grid, rows, cols, positions, positions65);
      // print(grid, rows, cols, positions, middlePositions);
    }
  }
}

function stepNoBorders(grid, rows, cols, positions) {
  let nextPosition = [];
  for (let pos of positions) {
    let next = dirs.map((d) => ({
      row: pos.row + d.dr,
      col: pos.col + d.dc,
    }));
    let possible = next.filter((p) => {
      let row = p.row % rows;
      if (row < 0) row += rows;
      let col = p.col % cols;
      if (col < 0) col += cols;
      return getValue(grid, { row, col }) !== "#";
    });
    nextPosition.push(...possible);
  }

  nextPosition = nextPosition.uniqueBy((p) => `${p.row}x${p.col}`);

  return nextPosition;
}

function getCoveredCount(grid, rows, cols, init, steps) {
  let positions = init;
  for (let i = 0; i < steps; i++) {
    positions = stepNoBorders(grid, rows, cols, positions);
  }

  let endingsWithinInitialGrid = positions.filter(
    ({ row, col }) => row >= 0 && row < rows && col >= 0 && col < cols
  );

  return endingsWithinInitialGrid.length;
}

function solve(input) {
  let matrix = input.map((line) => line.split(""));
  let rows = matrix.length;
  let cols = matrix[0].length;
  let grid = {};
  let toBeCovered = [];
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === "#") {
        setValue(grid, { row, col }, "#");
      } else {
        toBeCovered.push(getKey({ row, col }));
      }
    }
  }

  let sRow = input.findIndex((line) => line.includes("S"));
  let sCol = matrix[sRow].findIndex((c) => c === "S");

  // Part 1
  const p1StepsCount = 64;
  const initPosition = [{ row: sRow, col: sCol }];
  let p1Positions = initPosition;
  for (let i = 0; i < p1StepsCount; i++) {
    p1Positions = step(matrix, p1Positions);
  }

  // Part 2
  let sRowHasNoRocks = matrix[sRow].every((c) => c !== "#");
  let sColHasNoRocks = matrix.every((r) => r[sCol] !== "#");
  if (
    !sRowHasNoRocks ||
    (!sColHasNoRocks && sCol != sRow) ||
    sCol * 2 + 1 != cols ||
    sRow * 2 + 1 != rows
  ) {
    console.log("Algorithm below will not work!");
    return;
  }

  // # Analysis

  // S is placed exactly in the middle of input
  // and has straight path to every edge
  // moreover the step are propagated equally, so that every corner is reached on 130 step exactly
  let stepsToCoverFull = 0;
  let possibleEndings = initPosition;
  let prev = 0;
  let edges = {};
  while (toBeCovered.length > 0 && prev != toBeCovered.length) {
    possibleEndings = stepNoBorders(grid, rows, cols, possibleEndings);
    stepsToCoverFull++;
    let set = new Set(possibleEndings.map((p) => getKey(p)));
    prev = toBeCovered.length;
    toBeCovered = toBeCovered.filter((t) => !set.has(t));
    for (let edge of ["0x0", "0x130", "130x0", "130x130"])
      if (set.has(edge)) edges[edge] ??= { steps: stepsToCoverFull };
  }

  console.log(`After ${stepsToCoverFull} steps all map is covered.`);
  console.log(edges);

  // printStepsAndCounts(grid2, rows, cols, initPosition);
  // 65 3776
  // 66 3906
  // 196 33652
  // 327 93270
  // 458 182630
  // 589 301732
  // 720 450576

  // It growth like a rhomb
  // first main rhomb is formed after 65 steps, every other full one is added every 131(=rows count) steps
  // there are 4 types of rhombs: 2 types of main (1,2) and two types of sub main (3,4)
  // with every 131 step it growth like
  // s65: 1
  // s196: 1
  //      3 4
  //     1 2 1
  //      4 3
  //       1
  // after 131 step every rhomb is flipped to another type and extra round of rhombs is added

  // # Rhombs calculations
  let mainRhomb1Size = 0;
  let mainRhomb2Size = 0;
  let twoSubRhombsSize = 0;
  let positions = initPosition;
  for (let step = 1; step <= 196; step++) {
    positions = stepNoBorders(grid, rows, cols, positions);
    if (step === 65) {
      mainRhomb1Size = positions.length;
    }
    if (step === 66) {
      mainRhomb2Size = positions.filter(
        (p) => Math.abs(p.row - sRow) + Math.abs(p.col - sCol) <= 65
      ).length;
    }

    if (step === 196) {
      twoSubRhombsSize = (positions.length - 4 * mainRhomb1Size - mainRhomb2Size) / 2;
    }
  }
  console.log(mainRhomb1Size, mainRhomb2Size, twoSubRhombsSize);

  // main rhombs:
  // 1
  // 1 3 1
  // 1 3 5 3 1
  // 1 3 5 7 5 3 1
  // 1 3 5 7 9 7 5 3 1
  // => 1, 5, 13, 25, 41

  // sub rhombs
  // 0
  // 2 2
  // 2 4 4 2
  // 2 4 6 6 4 2
  // 2 4 6 8 8 6 4 2
  // => 0 4 12 24 40
  let levelsFromCenter = 1;
  let mainRhomb1Count = 1;
  let mainRhomb2Count = 0;
  let subRhombsCount = 0;
  let steps;
  let estimate;
  let p2StepsCount = 26501365;
  for (steps = 65; steps < p2StepsCount; steps += 131) {
    [mainRhomb1Count, mainRhomb2Count] = [mainRhomb2Count, mainRhomb1Count];
    mainRhomb1Count += 4 * levelsFromCenter;
    subRhombsCount += 4 * levelsFromCenter;
    levelsFromCenter++;
    estimate =
      mainRhomb1Size * mainRhomb1Count +
      mainRhomb2Size * mainRhomb2Count +
      (twoSubRhombsSize * subRhombsCount) / 2;
    if (steps > p2StepsCount - 131 * 3 || steps < 500) console.log("estimate:", steps, estimate);
  }

  return [p1Positions.length, estimate];
}

console.log("example:", solve(exampleInput));
console.log("");
console.log(" puzzle:", solve(puzzleInput));
