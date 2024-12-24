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

  let r2 = swapRules([
    ["frn", "z05"],
    ["wnf", "vtj"],
    ["gmq", "z21"],
    ["wtt", "z39"],
  ]);

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

  // let t = "z21";
  // for (let key in rules) {
  //   if (key === t) {
  //     continue;
  //   }
  //   const v2 = { ...values };
  //   const r2 = { ...rules };
  //   // r2["jcf"] = rules["srp"];
  //   // r2["srp"] = rules["jcf"];
  //   // r2[t] = rules[key];
  //   // r2[key] = rules[t];
  //   const num2 = zz
  //     .toSorted()
  //     .reverse()
  //     .map((z) => calculate(z, v2, r2));
  //   if (num2.some((a) => a === undefined)) {
  //     console.log(t, key, "cycle");
  //     continue;
  //   }
  //   const misMatch = [];
  //   const mm = {};
  //   for (let [z, value] of zValues) {
  //     if (value !== v2[z]) {
  //       misMatch.push(z);
  //       mm[z] = new Set(dependencies(z, r2).toSorted());
  //       // console.log(z, mm[z]);
  //     }
  //   }

  //   for (let i = 0; i < misMatch.length - 1; i++) {
  //     for (let j = i + 1; j < misMatch.length; j++) {
  //       const intersect = [...mm[misMatch[i]]].filter((v) => !mm[misMatch[j]].has(v));
  //       // console.log(misMatch[i], misMatch[j], intersect);
  //     }
  //   }

  //   const all = new Set(
  //     Object.values(mm)
  //       .map((x) => [...x])
  //       .flat()
  //   );

  //   console.log(t, key, misMatch.length);
  // }
  let p2 = {};
  const calculateMismatch = (swaps, zValues) => {
    const v2 = { ...values };
    const r2 = swapRules(swaps);
    const num2 = zz.map((z) => calculate(z, v2, r2));
    if (num2.some((a) => a === undefined)) {
      return undefined;
    }
    const misMatch = zValues.filter(([z, value]) => value !== v2[z]);
    return misMatch;
  };

  const test1 = calculateMismatch(
    [],
    zz.map((z) => [z, 0])
  );

  const swapsKey = (sw) =>
    sw
      .map((x) => x.toSorted().join("-"))
      .toSorted()
      .join(",");

  const init = "z21"; // should be switch based on input
  const getZValues = (values) => {
    const xBits = Object.keys(values)
      .filter((k) => k.startsWith("x"))
      .toSorted()
      .reverse()
      .map((x) => values[x])
      .join("");
    const xNum = parseInt(xBits, 2);
    const yBits = Object.keys(values)
      .filter((k) => k.startsWith("y"))
      .toSorted()
      .reverse()
      .map((y) => values[y])
      .join("");
    const yNum = parseInt(yBits, 2);
    const expectedZNum = xNum + yNum;
    const expectedZBits = expectedZNum.toString(2);
    console.assert(expectedZBits.length === zz.length);
    const zValues = expectedZBits
      .split("")
      .reverse()
      .map((z, i) => ["z" + i.toString().padStart(2, "0"), +z]);

    return zValues;
  };
  const isValid = (swaps) => {
    for (let key in values) {
      values[key] = values[key] === 0 ? 1 : 0;
      const zValues = getZValues(values);
      const mm = calculateMismatch(swaps, zValues);
      if (mm?.length !== 0) {
        return false;
      }
      values[key] = values[key] === 0 ? 1 : 0;
    }

    return true;
  };

  const outputs = [
    "z21-jhv,kbj-srp,wnf-vtj,pjp-rjq",
    "jhv-z21,kbj-srp,rjq-rwf,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-sqg,vtj-wnf",
    "crj-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-vmw,vtj-wnf",
    "jhv-z21,kbj-srp,mpv-rjq,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-rks,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-vfb,vtj-wnf",
    "ftb-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,pkh-rjq,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-skj,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-tfs,vtj-wnf",
    "bmp-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,pvh-rjq,vtj-wnf",
    "jhv-z21,kbj-srp,ptq-rjq,vtj-wnf",
    "jhv-z21,kbj-srp,kcf-rjq,vtj-wnf",
    "jhv-z21,jpk-rjq,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,qqs-rjq,vtj-wnf",
    "bqr-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-sst,vtj-wnf",
    "htp-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-wtd,vtj-wnf",
    "frh-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,rcf-rjq,vtj-wnf",
    "jhv-z21,kbj-srp,qbq-rjq,vtj-wnf",
    "cdk-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "gmq-rjq,jhv-z21,kbj-srp,vtj-wnf",
    "jhv-z21,jwb-rjq,kbj-srp,vtj-wnf",
    "jhv-z21,kbj-srp,rjq-vbp,vtj-wnf",
  ];
  const test = outputs.map((s) => s.split(",").map((t) => t.split("-"))).map((sw) => isValid(sw));
  console.log(test);

  let visited = {};
  for (let key in values) {
    // if (key !== "x39") continue;
    console.log(key);
    values[key] = values[key] === 0 ? 1 : 0;

    let localSwaps = [];
    let q = Object.keys(rules)
      .filter((r) => r !== init)
      .map((r) => [[init, r]])
      .map((swaps) => ({
        swaps,
        mm: calculateMismatch(swaps, zValues)?.length ?? Number.MAX_SAFE_INTEGER,
      }))
      .orderBy((x) => x.mm);
    let i = 0;
    while (true) {
      if (i++ % 100 === 0) {
        console.log(new Date().toJSON(), i, q.length, Object.keys(visited).length);
      }
      const { swaps } = q.shift();
      visited[swapsKey(swaps)] = true;
      const misMatch = calculateMismatch(swaps, zValues);
      if (misMatch.length === 0) {
        console.log(swapsKey(swaps));
        if (isValid(swaps)) {
          localSwaps = swaps;
          break;
        } else {
          continue;
        }
      }

      const rules = swapRules(swaps);
      const deps = misMatch
        .map((m) => dependencies(m[0], rules))
        .flat()
        .filter((m) => !m.startsWith("x") && !m.startsWith("y"))
        .reduce((prev, cur) => {
          prev[cur] = (prev[cur] ?? 0) + 1;
          return prev;
        }, {});

      const sorted = Object.entries(deps).orderBy((x) => -x[1]);
      // const best = sorted[0][1];
      let next = [];
      let pick = Math.floor(Math.random() * sorted.length);
      for (let [v, s] of sorted.slice(pick, pick + 1)) {
        // if (s !== best) {
        //   continue;
        // }
        if (swaps.flat().includes(v)) {
          continue;
        }
        const pairs = Object.keys(deps)
          .filter((r) => r !== v)
          .filter((r) => !swaps.flat().includes(r))
          .map((r) => [...swaps, [v, r]]);
        next.push(...pairs);
      }

      next = next.filter((sw) => visited[swapsKey(sw)] === undefined);
      next = next.uniqueBy((sw) => swapsKey(sw));
      next = next.map((sw) => ({
        swaps: sw,
        mm: calculateMismatch(sw, zValues)?.length ?? Number.MAX_SAFE_INTEGER,
      }));
      next = next.filter((n) => n.swaps.length < 4 || n.mm === 0);

      q.push(...next);
      q = q.orderBy((x) => x.mm);
    }

    console.log(localSwaps.map((s) => s.join("-")));
    if (localSwaps.length === 4) {
      while (q.length >= 0) {
        let x = q.shift();
        if (x.mm > 0) {
          break;
        }

        console.log(swapsKey(x.swaps));
      }
      const k = localSwaps.flat().toSorted().join(",");
      p2[k] = (p2[k] ?? 0) + 1;
      console.log(p2);
      // break;
    }

    values[key] = values[key] === 0 ? 1 : 0;
  }

  return [p1, p2];
}
//bkq,kbj,mjj,mjj,rjq,tfs,wtt,z21'
// console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
