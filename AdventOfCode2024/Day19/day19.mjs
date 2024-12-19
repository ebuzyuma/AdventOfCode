import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  let [patternsRaw, designs] = input.splitBy("");

  let patterns = patternsRaw[0].split(", ");

  const cache = {};
  const impossible = new Set();
  const countPossibleConstructions = (design, patterns) => {
    if (cache[design]) {
      return cache[design];
    }

    if (impossible.has(design)) {
      return 0;
    }

    const possiblePatterns = patterns.filter((p) => design.startsWith(p));
    if (possiblePatterns.length === 0) {
      impossible.add(design);
      return 0;
    }

    let combinations = 0;
    for (let p of possiblePatterns) {
      let sub = design.substring(p.length);
      if (sub === "") {
        combinations++;
        continue;
      }
      let subResult = countPossibleConstructions(sub, patterns);
      combinations += subResult;
    }

    if (combinations === 0) {
      impossible.add(design);
      return 0;
    }

    cache[design] = combinations;
    return combinations;
  };

  // Part 1
  patterns = patterns.sort();
  let possible = [];
  for (let d of designs) {
    const c = countPossibleConstructions(d, patterns);
    if (c > 0) {
      possible.push(c);
    }
  }
  const p1 = possible.length;

  // Part 2
  const p2 = possible.sum();

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
