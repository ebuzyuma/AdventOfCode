import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  const redTiles = input.map((line) => line.split(",").map(Number));
  let max = 0;
  const size = (p1, p2) => {
    return (Math.abs(p1[0] - p2[0]) + 1) * (Math.abs(p1[1] - p2[1]) + 1);
  };
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const rect = size(redTiles[i], redTiles[j]);
      max = Math.max(rect, max);
    }
  }
  const p1 = max;

  // Part 2
  let p2Max = 0;
  const otherPoints = (p1, p2) => {
    return [
      [p1[0], p2[1]],
      [p2[0], p1[1]],
    ];
  };
  const memo = {};
  const isInside = (poly, pointx, pointy) => {
    const key = `${pointx}x${pointy}`;
    if (memo[key]) return memo[key];
    var i, j;
    var inside = false;
    for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [p1x, p1y] = poly[i];
      const [p2x, p2y] = poly[j];
      if (
        p1x === p2x &&
        p1x === pointx &&
        pointy >= Math.min(p1y, p2y) &&
        pointy <= Math.max(p1y, p2y)
      ) {
        memo[key] = true;
        return true;
      }
      if (
        p1y === p2y &&
        p1y === pointy &&
        pointx >= Math.min(p1x, p2x) &&
        pointx <= Math.max(p1x, p2x)
      ) {
        memo[key] = true;
        return true;
      }
      if (p1y === p2y) continue;
      if (
        poly[i][1] > pointy != poly[j][1] > pointy &&
        pointx <
          ((poly[j][0] - poly[i][0]) * (pointy - poly[i][1])) / (poly[j][1] - poly[i][1]) +
            poly[i][0]
      )
        inside = !inside;
    }
    memo[key] = inside;
    return inside;
  };
  const isLineInside = (p1, p2) => {
    let dx = p2[0] - p1[0];
    if (dx !== 0) {
      dx = dx / Math.abs(dx);
      for (let x = p1[0]; x !== p2[0]; x += dx) {
        if (!isInside(redTiles, x, p1[1])) {
          return false;
        }
      }

      return true;
    }

    let dy = p2[1] - p1[1];
    if (dy === 0) return true;
    dy = dy / Math.abs(dy);

    for (let y = p1[1]; y !== p2[1]; y += dy) {
      if (!isInside(redTiles, p1[0], y)) {
        return false;
      }
    }

    return true;
  };
  for (let i = 78; i < redTiles.length; i++) {
    console.log(i, p2Max);
    for (let j = i + 1; j < redTiles.length; j++) {
      const [p1, p2] = otherPoints(redTiles[i], redTiles[j]);
      if (isInside(redTiles, p1[0], p1[1]) && isInside(redTiles, p2[0], p2[1])) {
        if (
          !isLineInside(p1, redTiles[i]) ||
          !isLineInside(p1, redTiles[j]) ||
          !isLineInside(p2, redTiles[i]) ||
          !isLineInside(p2, redTiles[j])
        ) {
          continue;
        }

        const rect = size(redTiles[i], redTiles[j]);
        p2Max = Math.max(rect, p2Max);
      }
    }
  }

  return { p1, p2: p2Max };
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
