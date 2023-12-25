import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function getKey({ x, y }) {
  return `${x}x${y}`;
}

function getValue(grid, pos) {
  return grid[getKey(pos)];
}

function setValue(grid, pos, value) {
  let key = getKey(pos);
  grid[key] = value;
}

function print(grid, minX, maxX, minY, maxY) {
  for (let y = maxY; y >= minY; y--) {
    let rowStr = "" + y + "\t";
    for (let x = minX; x <= maxX; x++) {
      let element = getValue(grid, { x, y });
      rowStr += element || ".";
    }
    console.log(rowStr);
  }
  console.log("");
  console.log("");
}

let dirMap = {
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const dirMap2 = "RDLU";

const lineRegex = /^(?<dir>[UDLR]) (?<meters>\d+) \((?<color>#[a-z0-9]{6})\)$/;

function computeSpace(digPlan) {
  let pos = { x: 0, y: -1 };
  let minX = 0;
  let maxX = 0;
  let maxY = 0;
  let minY = 0;
  let polygon = [];
  polygon.push(pos);
  for (let dig of digPlan) {
    pos = { x: pos.x + dig.dir.x * dig.meters, y: pos.y + dig.dir.y * dig.meters };

    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);

    polygon.push(pos);
  }

  let previousState = [];
  let currRanges = [];
  let count = 0;

  // go column by column and compute taken area
  for (let x = minX; x <= maxX; x++) {
    currRanges = [...previousState];
    let xState = [];
    let nextState = [];

    let xPoints = polygon
      .filter((p) => p.x === x)
      .uniqueBy((p) => getKey(p))
      .orderBy((p) => p.y)
      .reverse();

    let nextRanges = [];
    for (let i = 0; i < xPoints.length - 1; i += 2) {
      nextRanges.push({ top: xPoints[i].y, bottom: xPoints[i + 1].y });
    }

    let currRange = currRanges.shift();
    let nextRange = nextRanges.shift();
    while (currRange || nextRange) {
      // begin of a new range
      if (!currRange) {
        xState.push({ ...nextRange });
        nextState.push({ ...nextRange });
        nextRange = nextRanges.shift();
        continue;
      }

      let newRangeBefore = !currRange || (nextRange && nextRange.bottom > currRange.top);
      if (newRangeBefore) {
        xState.push({ ...nextRange });
        nextState.push({ ...nextRange });
        nextRange = nextRanges.shift();
        continue;
      }

      let currentRangePassed = !nextRange || (currRange && currRange.bottom > nextRange.top);
      if (currentRangePassed) {
        xState.push({ ...currRange });
        nextState.push({ ...currRange });
        currRange = currRanges.shift();
        continue;
      }

      // ending
      let endingEdge = currRange.top === nextRange.top && currRange.bottom === nextRange.bottom;
      if (endingEdge) {
        xState.push({ ...nextRange });
        currRange = currRanges.shift();
        nextRange = nextRanges.shift();
        continue;
      }

      let topGoesDown = currRange.top === nextRange.top;
      // drop top below
      if (topGoesDown) {
        xState.push({ ...nextRange });
        currRange = { top: nextRange.bottom, bottom: currRange.bottom };
        nextRange = nextRanges.shift();
        continue;
      }

      let topGoesUp = currRange.top === nextRange.bottom;
      if (topGoesUp) {
        xState.push({ ...nextRange });
        nextState.push({ ...nextRange });
        nextRange = nextRanges.shift();
        continue;
      }

      let bottomGoesDown = currRange.bottom === nextRange.top;
      // drop bottom below
      if (bottomGoesDown) {
        xState.push({ top: currRange.top, bottom: nextRange.bottom });
        nextState.push({ top: currRange.top, bottom: nextRange.bottom });
        nextRange = nextRanges.shift();
        currRange = currRanges.shift();
        continue;
      }

      let bottomGoesUp = currRange.bottom === nextRange.bottom;
      if (bottomGoesUp) {
        xState.push({ top: currRange.top, bottom: nextRange.bottom });
        nextState.push({ top: currRange.top, bottom: nextRange.top });
        nextRange = nextRanges.shift();
        currRange = currRanges.shift();
        continue;
      }

      // let contains inside existing range
      let insideRange = currRange.top > nextRange.top && currRange.bottom < nextRange.bottom;
      if (insideRange) {
        let restRange = { ...currRange };
        do {
          nextState.push({ top: restRange.top, bottom: nextRange.top });
          restRange.top = nextRange.bottom;
          nextRange = nextRanges.shift();
        } while (nextRange && currRange.top > nextRange.top && currRange.bottom < nextRange.bottom);
        xState.push({ top: currRange.top, bottom: restRange.top });
        currRange = { top: restRange.top, bottom: currRange.bottom };
        continue;
      }

      // new begin
      xState.push({ ...nextRange });
      nextRange = nextRanges.shift();
    }

    xState = xState.orderBy((s) => s.top).reverse();

    // Combine
    for (let i = 0; i < xState.length - 1; i++) {
      if (xState[i].bottom === xState[i + 1].top) {
        xState[i].bottom = xState[i + 1].bottom;
        xState.splice(i + 1, 1);
        i--;
      }
    }

    for (let i = 0; i < nextState.length - 1; i++) {
      if (nextState[i].bottom === nextState[i + 1].top) {
        nextState[i].bottom = nextState[i + 1].bottom;
        nextState.splice(i + 1, 1);
        i--;
      }
    }

    for (let insideRange of xState) {
      count += insideRange.top - insideRange.bottom + 1;
    }

    previousState = nextState;
  }

  return count;
}

function solve(input) {
  let digPlan1 = [];
  let digPlan2 = [];

  for (let line of input) {
    const match = lineRegex.exec(line);
    const { dir, meters, color } = match.groups;
    digPlan1.push({ dir: dirMap[dir], meters: +meters, color: color });

    let hex = color.substring(1, 6);
    let meters2 = Number("0x" + hex);
    let dir2 = dirMap2[+color.substring(6)];
    digPlan2.push({ dir: dirMap[dir2], meters: meters2, color: color });
  }

  // Part 1
  let p1 = computeSpace(digPlan1);

  // Part 2
  let p2 = computeSpace(digPlan2);

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
