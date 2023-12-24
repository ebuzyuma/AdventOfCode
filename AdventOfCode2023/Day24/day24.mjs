import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function intersection(h1, h2) {
  if (h2.velocity[0] === h1.velocity[0] && h2.velocity[1] === h1.velocity[1]) {
    return undefined;
  }
  let divider = h1.velocity[0] * h2.velocity[1] - h1.velocity[1] * h2.velocity[0];
  if (divider === 0) {
    // parallel;
    return undefined;
  }
  let t =
    ((h2.position[0] - h1.position[0]) * h2.velocity[1] -
      (h2.position[1] - h1.position[1]) * h2.velocity[0]) /
    divider;
  if (t <= 0) {
    return undefined;
  }

  let pos = [0, 1, 2].map((n) => h1.position[n] + h1.velocity[n] * t);

  let u = (pos[0] - h2.position[0]) / h2.velocity[0];
  if (u <= 0) {
    return undefined;
  }

  return pos;
}

function isParallel([x1, y1, z1], [x2, y2, z2]) {
  return x1 * y2 === y1 * x2 && y1 * z2 === z1 * y2;
}

function solve(input, [from, to]) {
  let hailstones = input
    .map((line) => line.split("@"))
    .map(([p, v]) => ({
      position: p.trim().split(", ").map(Number),
      velocity: v.trim().split(", ").map(Number),
    }));

  // Part 1
  let p1 = 0;
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      let cross = intersection(hailstones[i], hailstones[j]);
      if (cross && cross[0] >= from && cross[0] <= to && cross[1] >= from && cross[1] <= to) {
        p1++;
      }
    }
  }

  // Part 2
  let p2 = 0;
  let grid = {};
  let same = undefined;
  let parallel = undefined;
  for (let i = 0; i < hailstones.length; i++) {
    let key = hailstones[i].position[0];
    grid[key] ??= [];
    grid[key].push(hailstones[i]);
    if (grid[key].length > 1) {
      same = grid[key];
      console.log("same start", grid[key]);
    }
    for (let j = i + 1; j < hailstones.length; j++) {
      let ih = hailstones[i];
      let jh = hailstones[j];

      if (isParallel(ih.velocity, jh.velocity)) {
        parallel = [ih, jh];
        console.log("parallel", parallel);
      }
    }
  }
  if (!parallel) {
    console.log("no parallel");
  }
  if (same && same[0].velocity[0] === same[1].velocity[0]) {
    // turned out there is two stones with the same starting coordinate and the same speed!
    let x = same[0].position[0];
    let vx = same[0].velocity[0];
    let h1 = hailstones[0];
    let h2 = hailstones[1];
    let t1 = (x - h1.position[0]) / (h1.velocity[0] - vx);
    let t2 = (x - h2.position[0]) / (h2.velocity[0] - vx);
    let pos1 = [0, 1, 2].map((n) => h1.position[n] + h1.velocity[n] * t1);
    let pos2 = [0, 1, 2].map((n) => h2.position[n] + h2.velocity[n] * t2);
    let velocity = [0, 1, 2].map((n) => (pos1[n] - pos2[n]) / (t1 - t2));
    let position = [0, 1, 2].map((n) => pos1[n] - velocity[n] * t1);
    p2 = position.sum();
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput, [7, 27]));
console.log(" puzzle:", solve(puzzleInput, [200000000000000, 400000000000000]));
