import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  const machinesRaw = input.splitBy("");

  const machines = [];
  for (let machineRaw of machinesRaw) {
    //Button A: X+94, Y+34
    const [ax, ay] = machineRaw[0]
      .split(": ")[1]
      .split(", ")
      .map((s) => +s.split("+")[1]);

    // Button B: X+22, Y+67
    const [bx, by] = machineRaw[1]
      .split(": ")[1]
      .split(", ")
      .map((s) => +s.split("+")[1]);

    // Prize: X=8400, Y=5400
    const [px, py] = machineRaw[2]
      .split(": ")[1]
      .split(", ")
      .map((s) => +s.split("=")[1]);

    machines.push({
      a: { x: ax, y: ay },
      b: { x: bx, y: by },
      prize: { x: px, y: py },
    });
  }

  const gcd = (a, b) => {
    if (b === 0) {
      return a;
    } else {
      return gcd(b, a % b);
    }
  };

  const lcd = (a, b) => (a * b) / gcd(a, b);

  // Part 1
  const solve = (machine) => {
    const lcdA = lcd(machine.a.x, machine.a.y);
    const [m1, m2] = [lcdA / machine.a.x, lcdA / machine.a.y];
    const [bx, by] = [machine.b.x * m1, machine.b.y * m2];
    const [px, py] = [machine.prize.x * m1, machine.prize.y * m2];
    const [db, dp] = [bx - by, px - py];
    if (dp % db === 0) {
      const b = dp / db;
      const a = (machine.prize.x - b * machine.b.x) / machine.a.x;
      return [a, b];
    }

    return undefined;
  };
  const p1 = machines
    .map((m) => solve(m))
    .filter((s) => s !== undefined)
    .map(([a, b]) => 3 * a + b)
    .sum();

  // Part 2
  for (let m of machines) {
    m.prize.x += 10000000000000;
    m.prize.y += 10000000000000;
  }

  const p2 = machines
    .map((m) => solve(m))
    .filter((s) => s !== undefined)
    .map(([a, b]) => 3 * a + b)
    .sum();
  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
