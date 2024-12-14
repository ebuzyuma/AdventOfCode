import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input, xMax, yMax) {
  // p=0,4 v=3,-3
  const robots = input
    .map((s) => s.split(" ").map((pv) => pv.split("=")[1].split(",")))
    .map(([[px, py], [vx, vy]]) => ({ p: { x: +px, y: +py }, v: { x: +vx, y: +vy } }));

  const move = (robot, n) => {
    let nx = (robot.p.x + n * robot.v.x) % xMax;
    if (nx < 0) nx += xMax;
    let ny = (robot.p.y + n * robot.v.y) % yMax;
    if (ny < 0) ny += yMax;
    return [nx, ny];
  };

  const draw = (rr) => {
    const key = (r) => `${r.p.x}x${r.p.y}`;
    let set = rr.reduce((prev, cur) => {
      prev[key(cur)] ??= 0;
      prev[key(cur)]++;
      return prev;
    }, {});
    for (let y = 0; y < yMax; y++) {
      let str = "" + y + ": ";
      for (let x = 0; x < xMax; x++) {
        const t = set[`${x}x${y}`];
        str += t ?? ".";
      }
      console.log(str);
    }
  };

  // Part 1
  const positions = robots.map((r) => move(r, 100));

  const count = (pp, xFrom, xTo, yFrom, yTo) => {
    const match = pp.filter(([x, y]) => x >= xFrom && x < xTo && y >= yFrom && y < yTo);
    return match.length;
  };

  const xMid = (xMax - 1) / 2;
  const yMid = (yMax - 1) / 2;
  const p1 =
    count(positions, 0, xMid, 0, yMid) *
    count(positions, xMid + 1, xMax, 0, yMid) *
    count(positions, 0, xMid, yMid + 1, yMax) *
    count(positions, xMid + 1, xMax, yMid + 1, yMax);

  // Part 2
  let p2 = 0;
  let diagSize = 10;
  const isTreeChance = (pp) => {
    // check if there is diagSize robots on a diagonal
    let set = new Set(pp.map(([x, y]) => `${x}x${y}`));
    for (let p of pp) {
      let diag = [...Array(diagSize)].map((_, i) => `${p[0] + i}x${p[1] - i}`);
      if (diag.every((d) => set.has(d))) {
        return true;
      }
    }
  };
  while (p2 < 1000000) {
    p2++;
    const positions = robots.map((r) => move(r, p2));
    if (isTreeChance(positions)) {
      draw(positions.map((p) => ({ p: { x: p[0], y: p[1] } })));
      break;
    }
  }
  return [p1, p2];
}

// console.log("example:", solve(exampleInput, 11, 7));
console.log(" puzzle:", solve(puzzleInput, 101, 103));
