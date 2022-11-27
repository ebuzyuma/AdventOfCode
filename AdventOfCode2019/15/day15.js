const input = require("./input");

const execCommand = (input, arr, i, output, relativeBase) => {
  let code = arr[i];
  const p1mode = Math.floor(code / 100) % 10;
  const p2mode = Math.floor(code / 1000) % 10;
  const p3mode = Math.floor(code / 10000) % 10;
  code = code % 100;
  const [a1, a2, a3] = [arr[i + 1] || 0, arr[i + 2] || 0, arr[i + 3] || 0];
  const p1 = p1mode == 1 ? a1 : p1mode == 2 ? arr[relativeBase + a1] || 0 : arr[a1] || 0;
  const p2 = p2mode == 1 ? a2 : p2mode == 2 ? arr[relativeBase + a2] || 0 : arr[a2] || 0;
  let outputPosition = p3mode == 2 ? relativeBase + a3 : a3;
  switch (code) {
    case 1:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 + p2;
      return [i + 4, relativeBase];
    case 2:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 * p2;
      return [i + 4, relativeBase];
    case 3:
      // console.log(i, arr[i], arr[i + 1], input.toString());
      outputPosition = p1mode == 2 ? relativeBase + a1 : a1;
      if (input.length == 0) {
        return [i, relativeBase]; // wait for input
      }
      arr[outputPosition] = input[0];
      input.splice(0, 1);
      return [i + 2, relativeBase];
    case 4:
      // console.log(i, arr[i], p1);
      output.push(p1);
      return [i + 2, relativeBase];
    case 5:
      // console.log(i, arr[i], p1, p2);
      return [p1 != 0 ? p2 : i + 3, relativeBase];
    case 6:
      // console.log(i, arr[i], p1, p2);
      return [p1 == 0 ? p2 : i + 3, relativeBase];
    case 7:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 < p2 ? 1 : 0;
      return [i + 4, relativeBase];
    case 8:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 == p2 ? 1 : 0;
      return [i + 4, relativeBase];
    case 9:
      return [i + 2, relativeBase + p1];
    case 99:
      // console.log(i, arr[i]);
      return [-1, 0];
    default:
      throw new Error("Unexpected code " + code);
  }
};

const execProgram = (input, arr, startingPosition = 0, relativeBase = 0) => {
  let output = [];
  let prevPosition;
  let currentPosition = startingPosition;
  const exitIndicator = -1;
  do {
    prevPosition = currentPosition;
    previousBase = relativeBase;
    [currentPosition, relativeBase] = execCommand(input, arr, prevPosition, output, relativeBase);
  } while (currentPosition != exitIndicator && prevPosition != currentPosition);

  return [currentPosition, relativeBase, output];
};

const findRange = (coords, pos) => {
  const arr = coords.map((c) => c[pos]);
  return [Math.min(...arr), Math.max(...arr)];
};
const printMap = (map, [x, y]) => {
  const xy = Object.keys(map)
    .map((k) => k.split("x"))
    .map((s) => [+s[0], +s[1]]);
  const [minX, maxX] = findRange(xy, 0);
  const [minY, maxY] = findRange(xy, 1);
  let str = "";
  for (let row = maxY + 2; row >= minY - 2; row--) {
    for (let col = minX - 2; col <= maxX + 2; col++) {
      str += row == y && col == x ? "D" : map[`${col}x${row}`] || " ";
    }
    str += "\n";
  }

  console.log(str);
};

const toKey = (x, y) => `${x}x${y}`;

const directions = [1, 4, 2, 3]; // north, east, south, west
const dxy = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const wall = "#";
const road = ".";
const oxygenSystem = "@";
const getResult = (x) => {
  switch (x) {
    case 0:
      return wall;
    case 1:
      return road;
    case 2:
      return oxygenSystem;
  }
};

const discover = (program, map) => {
  let discoverPoints = directions.map((d, i) => [d, [...program], [dxy[i][0], dxy[i][1]], 0, 0]);

  const paths = {};
  let oxygenPosition = undefined;
  while (discoverPoints.length > 0) {
    const nextRound = [];
    discoverPoints.forEach(([d, p, [x, y], pos, rBase]) => {
      const key = toKey(x, y);
      [pos, rBase, output] = execProgram([d], p, pos, rBase);

      map[key] = getResult(output[0]);
      if (map[key] != wall) {
        const di = directions.findIndex((t) => t === d);
        const previousPath = paths[toKey(x - dxy[di][0], y - dxy[di][1])] || [];
        paths[key] = [...previousPath, d];
      }

      if (map[key] == oxygenSystem) {
        oxygenPosition = [x, y];
      }

      // console.clear();
      // printMap(map, [x, y]);
      if (map[key] != wall) {
        const n = directions
          .map((d, i) => [d, [...p], [x + dxy[i][0], y + dxy[i][1]], pos, rBase])
          .filter(([_1, _2, [x1, y1], _3, _4]) => !map[toKey(x1, y1)]);
        nextRound.push(...n);
      }
    });
    discoverPoints = nextRound;
  }

  return [oxygenPosition, paths[toKey(...oxygenPosition)].length];
};

const map = { "0x0": "." };
const [oxygenPosition, pathLength] = discover(input.intCode, map);
console.log(pathLength);

const oxygen = "O";
const fillOxygen = (map, [x0, y0]) => {
  map[toKey(x0, y0)] = oxygen;

  let discoverPoints = directions
    .map((d, i) => [x0 + dxy[i][0], y0 + dxy[i][1]])
    .filter(([x, y]) => map[toKey(x, y)] != wall);

  let minutes = 0;
  while (discoverPoints.length > 0) {
    minutes++;

    const nextRound = [];
    discoverPoints.forEach(([x, y]) => {
      const key = toKey(x, y);
      map[key] = oxygen;

      console.clear();
      printMap(map, [x, y]);

      const n = directions
        .map((d, i) => [x + dxy[i][0], y + dxy[i][1]])
        .filter(([x1, y1]) => map[toKey(x1, y1)] == road);
      nextRound.push(...n);
    });
    discoverPoints = nextRound;
  }

  return minutes;
};

const part2 = fillOxygen(map, oxygenPosition);
console.log(part2);
