import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

const key = (r, c) => `${r}x${c}`;
const setValue = (map, r, c, value) => (map[key(r, c)] = value);
const getValue = (map, r, c) => map[key(r, c)];

const dirs = {
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
  "^": [-1, 0],
};

const print = (map, rMax, cMax) => {
  for (let r = 0; r < rMax; r++) {
    let str = "" + r + ": ";
    for (let c = 0; c < cMax; c++) {
      str += getValue(map, r, c);
    }
    console.log(str);
  }
  console.log();
};

function solve(input, xMax, yMax) {
  // Parsing
  let map = {};
  let robot = [];
  const [mapRaw, moveLines] = input.splitBy("");
  for (let r = 0; r < mapRaw.length; r++) {
    for (let c = 0; c < mapRaw[0].length; c++) {
      const value = mapRaw[r][c];
      if (value === "@") {
        robot = [r, c];
        setValue(map, r, c, ".");
      } else {
        setValue(map, r, c, value);
      }
    }
  }

  // Part 1
  const makeMove = (map, [r, c], move) => {
    const [dr, dc] = dirs[move];
    const [nr, nc] = [r + dr, c + dc];
    const nValue = getValue(map, nr, nc);
    if (nValue === ".") {
      return [nr, nc];
    }

    if (nValue === "#") {
      return [r, c];
    }

    if (nValue === "O") {
      let [fr, fc] = [nr, nc];
      // find the next free spot
      do {
        [fr, fc] = [fr + dr, fc + dc];
        let fValue = getValue(map, fr, fc);
        if (fValue === "#") {
          // cannot move
          return [r, c];
        } else if (fValue === ".") {
          // can move
          setValue(map, nr, nc, ".");
          setValue(map, fr, fc, "O");
          return [nr, nc];
        }
      } while (true);
    }

    throw Error("unexpected map object");
  };

  const gpsCoordinate = ([r, c]) => {
    return 100 * r + c;
  };

  const p1Map = { ...map };
  const moves = moveLines.map((x) => x.trim()).join("");
  for (let move of moves) {
    robot = makeMove(map, robot, move);
  }
  let p1 = Object.keys(p1Map)
    .filter((k) => p1Map[k] === "O")
    .map((k) => gpsCoordinate(k.split("x").map((n) => +n)))
    .sum();

  // Part 2
  const p2Map = {};
  let p2Robot = [];
  for (let r = 0; r < mapRaw.length; r++) {
    for (let c = 0; c < mapRaw[0].length; c++) {
      const value = mapRaw[r][c];
      if (value === "#" || value === ".") {
        setValue(p2Map, r, 2 * c, value);
        setValue(p2Map, r, 2 * c + 1, value);
      } else if (value === "O") {
        setValue(p2Map, r, 2 * c, "[");
        setValue(p2Map, r, 2 * c + 1, "]");
      } else if (value === "@") {
        p2Robot = [r, 2 * c];
        setValue(p2Map, r, 2 * c, ".");
        setValue(p2Map, r, 2 * c + 1, ".");
      }
    }
  }

  const canMove = (map, r, c, dr, dc) => {
    const [nr, nc] = [r + dr, c + dc];
    const nValue = getValue(map, nr, nc);
    if (nValue === "#") {
      return false;
    }
    if (nValue === ".") {
      return true;
    }

    // else the box
    // horizontal move
    if (dr === 0) {
      // check next part of the box
      return canMove(map, nr, nc, dr, dc);
    }
    // vertical move
    if (dc === 0) {
      const secondPart = nValue === "[" ? nc + 1 : nc - 1;
      return canMove(map, nr, nc, dr, dc) && canMove(map, nr, secondPart, dr, dc);
    }

    throw Error("wtf");
  };

  const shift = (map, r, c, dr, dc) => {
    const value = getValue(map, r, c);
    if (value === ".") {
      return;
    }

    // simple horizontal  case
    if (dr === 0) {
      // move next first
      const nc = c + 2 * dc;
      const nValue = getValue(map, r, nc);
      if (nValue === "[" || nValue === "]") {
        shift(map, r, nc, dr, dc);
      }

      const v1 = getValue(map, r, c);
      const v2 = getValue(map, r, c + dc);
      setValue(map, r, c, ".");
      setValue(map, r, c + dc, ".");
      setValue(map, r, c + dc, v1);
      setValue(map, r, c + 2 * dc, v2);
      return;
    }

    // vertical move
    const dp2 = value === "[" ? 1 : -1;
    // free next spots
    shift(map, r + dr, c, dr, dc);
    shift(map, r + dr, c + dp2, dr, dc);
    // move current
    const v1 = getValue(map, r, c);
    const v2 = getValue(map, r, c + dp2);
    setValue(map, r, c, ".");
    setValue(map, r, c + dp2, ".");
    setValue(map, r + dr, c, v1);
    setValue(map, r + dr, c + dp2, v2);
  };

  const makeMove2 = (map, [r, c], move) => {
    const [dr, dc] = dirs[move];

    if (canMove(map, r, c, dr, dc)) {
      const [nr, nc] = [r + dr, c + dc];
      shift(map, nr, nc, dr, dc);
      return [nr, nc];
    }
    return [r, c];
  };

  // print(p2Map, mapRaw.length, mapRaw[0].length * 2);

  for (let move of moves) {
    setValue(p2Map, ...p2Robot, ".");
    p2Robot = makeMove2(p2Map, p2Robot, move);
    setValue(p2Map, ...p2Robot, "@");
    // print(p2Map, mapRaw.length, mapRaw[0].length * 2);
  }

  let p2 = Object.keys(p2Map)
    .filter((k) => p2Map[k] === "[")
    .map((k) => gpsCoordinate(k.split("x").map((n) => +n)))
    .sum();

  return [p1, p2];
}

console.log("example:", solve(exampleInput, 11, 7));
console.log(" puzzle:", solve(puzzleInput, 101, 103));
