import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  let stones = input[0].split(" ").map((n) => +n);

  const blink = (stone) => {
    if (stone === 0) {
      return [1];
    }

    const stoneStr = JSON.stringify(stone);
    if (stoneStr.length % 2 === 0) {
      return [
        +stoneStr.substring(0, stoneStr.length / 2),
        +stoneStr.substring(stoneStr.length / 2, stoneStr.length),
      ];
    }

    return [stone * 2024];
  };

  // Part 1
  const nBlinkDirect = (stones, n) => {
    let curr = stones;
    for (let gen = 0; gen < n; gen++) {
      let next = [];
      for (let stone of curr) {
        let afterBlink = blink(stone);
        next.push(...afterBlink);
      }

      curr = next;
    }

    return curr;
  };

  const p1 = nBlinkDirect(stones, 25).length;

  // Part 2
  const nBlinkSmart = (stones, n) => {
    let curr = {};
    for (const stone of stones) {
      curr[stone] = 1;
    }
    for (let gen = 0; gen < n; gen++) {
      let next = {};
      for (let stone of Object.keys(curr)) {
        const afterBlink = blink(+stone);
        for (let nextStone of afterBlink) {
          next[nextStone] = next[nextStone] ?? 0;
          next[nextStone] += curr[stone];
        }
      }

      curr = next;
    }

    const result = Object.values(curr).sum();
    return result;
  };

  const p2 = nBlinkSmart(stones, 75);
  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
