import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  const secrets = input.map((x) => BigInt(x));
  const module = 16777216n;

  const mix = (a, b) => a ^ b;
  const prune = (a) => a % module;
  const produceSecret = (s) => {
    const t1 = prune(mix(s << 6n, s));
    const t2 = prune(mix(t1 >> 5n, t1));
    const t3 = prune(mix(t2 << 11n, t2));
    return t3;
  };

  // Part 1
  const n = 2000;
  const generateNth = (s, nth) => {
    let result = s;
    for (let i = 0; i < nth; i++) {
      result = produceSecret(result);
    }
    return result;
  };
  const p1 = secrets.map((s) => generateNth(s, n)).reduce((prev, curr) => prev + curr, 0n);

  // Part 2
  const generateN = (s, nth) => {
    let result = [s];
    let cur = s;
    for (let i = 0; i < nth; i++) {
      cur = produceSecret(cur);
      result.push(cur);
    }
    return result;
  };
  const calculateDiffs = (nn) => {
    let prices = [];
    let pp = nn.map((x) => Number(x % 10n));
    for (let i = 0; i < nn.length - 1; i++) {
      prices.push({ p: pp[i + 1], diff: pp[i + 1] - pp[i] });
    }
    return prices;
  };
  const buyers = secrets.map((s) => generateN(s, n)).map((nn) => calculateDiffs(nn));
  const tally = {};
  for (let ib = 0; ib < buyers.length; ib++) {
    const buyer = buyers[ib];
    for (let i = 0; i < buyer.length - 3; i++) {
      const seq = buyer.slice(i, i + 4);
      const key = seq.map((x) => x.diff).join(",");
      tally[key] ??= {};
      if (tally[key][ib] !== undefined) {
        continue;
      }
      tally[key][ib] = buyer[i + 3].p;
    }
  }
  let best = {};
  for (let key in tally) {
    const sold = Object.values(tally[key]).sum();
    if (sold > Object.values(best).sum()) {
      best = tally[key];
    }
  }
  const p2 = Object.values(best).sum();

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
