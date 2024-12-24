import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  const [initRaw, rulesRaw] = input.splitBy("");
  const values = {};
  for (let row of initRaw) {
    const [a, b] = row.split(": ");
    values[a] = +b;
  }

  const rules = {};
  let zz = [];
  for (let row of rulesRaw) {
    const [a, b] = row.split(" -> ");
    const [x, op, y] = a.split(" ");
    rules[b] = { op, x, y };
    if (b.startsWith("z")) zz.push(b);
    if (x.startsWith("z")) zz.push(x);
    if (y.startsWith("z")) zz.push(y);
  }

  zz = zz.toSorted().reverse();

  // Part 1
  const calculate = (a, vv, rr, stack = []) => {
    if (vv[a] !== undefined) {
      return vv[a];
    }

    if (stack.includes(a)) {
      return undefined;
    }

    const { x, op, y } = rr[a];
    let result;
    const xv = calculate(x, vv, rr, [...stack, a]);
    const yv = calculate(y, vv, rr, [...stack, a]);
    if (xv === undefined || yv === undefined) {
      return undefined;
    }
    if (op === "AND") {
      result = xv & yv;
    } else if (op === "OR") {
      result = xv | yv;
    } else if (op === "XOR") {
      result = xv ^ yv;
    } else {
      throw Error("not implemented");
    }
    vv[a] = result;
    return result;
  };

  const v1 = { ...values };
  const r1 = { ...rules };
  const num = zz.map((z) => calculate(z, v1, r1)).join("");
  const p1 = parseInt(num, 2);

  // Part 2
  const swapRules = (swaps) => {
    const r2 = { ...rules };
    for (let [a, b] of swaps) {
      r2[a] = rules[b];
      r2[b] = rules[a];
    }
    return r2;
  };

  const findResult = (x, y, op, rules) => {
    const t = [x, y].toSorted().join(",");
    let rule = Object.entries(rules).find(
      ([right, left]) => [left.x, left.y].toSorted().join(",") === t && left.op === op
    );

    return rule[0];
  };

  // Add rules manually to prevent error throw below
  let swaps = [
    ["frn", "z05"],
    ["wnf", "vtj"],
    ["gmq", "z21"],
    ["wtt", "z39"],
  ];
  let r2 = swapRules(swaps);

  // Full adder validation
  let carryOver;
  for (let i = 0; i < 45; i++) {
    const iStr = i.toString().padStart(2, "0");
    const xor = findResult(`x${iStr}`, `y${iStr}`, "XOR", r2);
    let zResult = xor;
    if (carryOver) {
      const xor2 = findResult(xor, carryOver, "XOR", r2);
      zResult = xor2;
    }
    if (zResult !== `z${iStr}`) {
      throw new Error(`Invalid position: ${zResult}, expected: z${iStr}`);
    }

    const and = findResult(`x${iStr}`, `y${iStr}`, "AND", r2);
    if (carryOver) {
      const and2 = findResult(xor, carryOver, "AND", r2);
      carryOver = findResult(and, and2, "OR", r2);
    } else {
      carryOver = and;
    }
  }

  let p2 = swaps.flat().toSorted().join(",");

  return [p1, p2];
}

// console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
