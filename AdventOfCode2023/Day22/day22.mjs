import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function getKey([x, y, z]) {
  return `${x}x${y}x${z}`;
}

function setValue(grid, pos, value) {
  grid[getKey(pos)] = value;
}
function getValue(grid, pos) {
  return grid[getKey(pos)];
}

function putBrick(grid, brick) {
  let diff = brick.from.map((f, i) => f - brick.to[i]);
  let size = diff.find((d) => d !== 0);
  diff = diff.map((d) => Math.sign(d));
  for (let i = 0; i <= size; i++) {
    let cube = block.from.map((f, j) => f + i * diff[j]);
    setValue(grid, cube, brick.id);
  }
}

function getCubes(brick) {
  let diff = brick.from.map((f, i) => brick.to[i] - f);
  let size = Math.abs(diff.find((d) => d !== 0)) || 1;
  diff = diff.map((d) => Math.sign(d));
  let cubes = [];
  for (let i = 0; i <= size; i++) {
    let cube = brick.from.map((f, j) => f + i * diff[j]);
    cubes.push(cube);
  }
  return cubes;
}

const zIndex = 2;

function fall(bricks) {
  let grid = {};
  for (let brick of bricks.filter((b) => b.stable)) {
    putBrick(grid, brick);
  }

  let notStableBricks = bricks.filter((b) => !b.stable);
  while (notStableBricks.length > 0) {
    for (let brick of notStableBricks) {
      let brickMinZ = Math.min(...brick.cubes.map((p) => p[zIndex]));
      if (brickMinZ === 1) {
        // console.log(brick.id, "ground");
        brick.stable = true;
        continue;
      }

      let below = brick.cubes.map(([x, y, z]) => [x, y, z - 1]);
      let set = new Set(below.map(getKey));
      let bricksBelow = bricks.filter(
        (b) => b.id !== brick.id && b.cubes.some((p) => set.has(getKey(p)))
      );
      if (bricksBelow.length === 0) {
        // console.log(brick.id, "falling below");
        brick.from[zIndex]--;
        brick.to[zIndex]--;
        brick.cubes = below;
        continue;
      }

      let stableBelow = bricksBelow.filter((b) => b.stable);
      if (stableBelow.length > 0) {
        brick.stable = true;
        brick.supportedBy = stableBelow.map((b) => b.id);
        // console.log(brick.id, "has stable below", brick.supportedBy);
        continue;
      }

      // console.log(
      //   brick.id,
      //   "unstable below",
      //   bricksBelow.map((b) => b.id)
      // );
    }

    notStableBricks = notStableBricks.filter((b) => !b.stable);
  }
}

function solve(input) {
  let bricks = input
    .map((line) => line.split("~"))
    .map(([from, to], i) => ({
      id: i,
      from: from.split(",").map((x) => +x),
      to: to.split(",").map((x) => +x),
      supportedBy: [],
      stable: false,
    }));

  bricks.forEach((b) => (b.stable = b.from[2] === 1 || b.to[2] === 1));
  bricks.forEach((b) => (b.cubes = getCubes(b)));

  bricks = bricks.orderBy((b) => b.from[zIndex]);

  fall(bricks);

  // Part 1
  let p1 = 0;
  for (let brick of bricks) {
    let supportBricks = bricks.filter((b) => b.supportedBy.includes(brick.id));
    let canBeRemoved = supportBricks.every((b) => b.supportedBy.length > 1);
    if (canBeRemoved) {
      p1++;
    }
  }

  // Part 2
  let p2 = 0;
  bricks = bricks.orderBy((b) => b.from[zIndex]);
  for (let i = 0; i < bricks.length; i++) {
    let fallen = new Set([bricks[i].id]);
    for (let j = i + 1; j < bricks.length; j++) {
      let brick = bricks[j];
      let allSupportFallen =
        brick.supportedBy.length > 0 && brick.supportedBy.every((s) => fallen.has(s));
      if (allSupportFallen) {
        fallen.add(brick.id);
      }
    }
    bricks[i].chainFall = fallen.size - 1;
    p2 += fallen.size - 1;
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
