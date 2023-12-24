import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function intersection(h1, h2, ignoreZ = true) {
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

  if (!ignoreZ) {
    let z1 = pos[2];
    let z2 = h2.position[2] + u * h2.velocity[2];
    if (z1 !== z2) {
      return undefined;
    }
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
    console.log(t1, t2, velocity, position, position.sum());
  }

  console.log();
  let p2 = 0;
  let sorted = hailstones.orderBy((h) => h.position[2]);
  let deltaZ = sorted[1].position[2] - sorted[0].position[2];
  let deltaV = sorted[1].velocity[2] - sorted[0].velocity[2];
  let maxT = deltaZ / deltaV;
  let first = sorted.pop();
  for (let firstHit = 1; firstHit < 10000; firstHit++) {
    let hitPos = [0, 1, 2].map((n) => first.position[n] + firstHit * first.velocity[n]);

    for (let vz = 1; vz < 1000; vz++) {
      let t = sorted.map(
        (h) => (hitPos[2] - h.position[2] - h.velocity[2] * firstHit) / (vz - h.velocity[2])
      );
      let allPerfect = t.every(Number.isInteger);
      if (allPerfect) {
        // console.log(firstHit, vz);
      }
    }
  }
  // console.log(sorted);
  let options = {};
  // 1st second hit i
  // 2nd second hit j

  for (let i = 0; i < hailstones.length; i++) {
    for (let j = 0; j < hailstones.length; j++) {
      if (i == j) continue;
      let ih = hailstones[i];
      let jh = hailstones[j];
      let found = 0;
      for (let firstHit = 1; firstHit < 100; firstHit++) {
        for (let secondHit = firstHit + 1; secondHit < 100; secondHit++) {
          let iHitPos = [0, 1, 2].map((n) => ih.position[n] + firstHit * ih.velocity[n]);
          let jHitPos = [0, 1, 2].map((n) => jh.position[n] + secondHit * jh.velocity[n]);
          let velocity = [0, 1, 2].map((n) => (jHitPos[n] - iHitPos[n]) / (secondHit - firstHit));
          let position = [0, 1, 2].map((n) => iHitPos[n] - firstHit * velocity[n]);
          if (velocity.every(Number.isInteger) && position.every(Number.isInteger)) {
            options[`${position.join(", ")} @ ${velocity.join(", ")}`] = { velocity, position };
            found++;
          }
        }

        if (found) {
          // console.log(i, j, found);
          break;
        }
      }
    }
  }

  console.log("options", Object.values(options).length);

  for (let option of Object.values(options)) {
    let valid = true;
    for (let hailstone of hailstones) {
      let cross = intersection(option, hailstone, false);
      if (!cross) {
        valid = false;
        break;
      }
      let perfect = [0, 1, 2].every((n) => Number.isInteger(cross[n]));
      if (!perfect) {
        valid = false;
        break;
      }
    }

    if (valid) {
      console.log(option);
    }
  }

  return [p1, p2];
}

console.log("example:", solve(exampleInput, [7, 27]));
console.log(" puzzle:", solve(puzzleInput, [200000000000000, 400000000000000]));
