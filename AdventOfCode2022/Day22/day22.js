const utils = require("../utils");
const lines = utils.readInput(__dirname, true);

const example = utils.readExampleInput(__dirname, true);

function parsInput(lines) {
  let map = [];
  for (let i = 0; i < lines.length - 2; i++) {
    map.push(lines[i].replace(/\r/, ""));
  }
  // add last non rotation to match
  let x = lines.last() + "N";
  let line = [...x.matchAll(/(\d+)(R|L|N)/g)];
  let instructions = line.map((x) => [+x[1], x[2]]);
  return { map, instructions };
}

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function solve(input) {
  let row = 0;
  let dir = 0;
  let width = input.map[0].length;
  let height = input.map.length;
  let column = input.map[0].split("").findIndex((x) => x === ".");
  // console.log(-1, row, column, dir);
  for (let i = 0; i < input.instructions.length; i++) {
    const [steps, rotation] = input.instructions[i];
    const [dx, dy] = directions[dir];
    // move
    let [x, y] = [column, row];
    for (let s = 0; s < steps; s++) {
      [x, y] = [x + dx, y + dy];
      x = (x + width) % width;
      y = (y + height) % height;
      let next = input.map[y][x];
      while (!next || next === " ") {
        x = (x + dx + width) % width;
        y = (y + dy + height) % height;
        next = input.map[y][x];
      }
      if (next === ".") {
        [column, row] = [x, y];
        continue;
      }
      if (next === "#") {
        break;
      }
      console.log("what?!");
    }
    // rotate
    if (rotation === "L") {
      dir = (directions.length + dir - 1) % directions.length;
    } else if (rotation === "R") {
      dir = (dir + 1) % directions.length;
    }

    // console.log(i, row, column, dir);
  }

  return 1000 * (row + 1) + 4 * (column + 1) + dir;
}

const input = parsInput(lines);
console.log(solve(input));

const edgeSize = 50;
function findCubeNumber(cubeMap, x, y) {
  for (let [n, d] of Object.entries(cubeMap)) {
    if (
      x >= d.position[0] &&
      y >= d.position[1] &&
      x < d.position[0] + edgeSize &&
      y < d.position[1] + edgeSize
    ) {
      return +n;
    }
  }

  throw new error("failed to find the cube");
}

function stepOverEdge(cubeMap, fromCube, toCube, x, y, dir) {
  let reverseDir = cubeMap[fromCube].edges.findIndex((c) => c === toCube);
  let rotation = cubeMap[fromCube].rotations[reverseDir];
  let result = undefined;
  let nextDir = (directions.length + dir - rotation) % directions.length;
  let [xCube, yCube] = [x - cubeMap[fromCube].position[0], y - cubeMap[fromCube].position[1]];
  let nextCubeBase = cubeMap[toCube].position;
  if (rotation === 0) {
    if (dir === 0) {
      xCube = 0;
    } else if (dir === 1) {
      yCube = 0;
    } else if (dir === 2) {
      xCube = edgeSize - 1;
    } else if (dir === 3) {
      yCube = edgeSize - 1;
    }
    result = [nextCubeBase[0] + xCube, nextCubeBase[1] + yCube, dir];
  } else if (Math.abs(rotation) === 1) {
    [xCube, yCube] = [yCube, xCube];
    result = [nextCubeBase[0] + xCube, nextCubeBase[1] + yCube, nextDir];
  } else {
    // rotation +-2
    yCube = 50 - 1 - yCube;
    result = [nextCubeBase[0] + xCube, nextCubeBase[1] + yCube, nextDir];
  }

  // console.log(`edge move: ${fromCube}: ${x},${y},${dir} => ${toCube}: ${result.toString()}`);
  return result;
}

function findNext(cubeMap, x, y, dir) {
  const cube = findCubeNumber(cubeMap, x, y);

  // left
  let isLeftEdge = dir === 0 && x === cubeMap[cube].position[0] + edgeSize - 1;
  let isBottomEdge = dir === 1 && y === cubeMap[cube].position[1] + edgeSize - 1;
  let isRightEdge = dir === 2 && x === cubeMap[cube].position[0];
  let isTopEdge = dir === 3 && y === cubeMap[cube].position[1];
  if (isLeftEdge || isBottomEdge || isRightEdge || isTopEdge) {
    let nextSide = cubeMap[cube].edges[dir];
    return stepOverEdge(cubeMap, cube, nextSide, x, y, dir);
  }

  // not edge
  const [dx, dy] = directions[dir];
  return [x + dx, y + dy, dir];
}

function solve2(input, cubeMap) {
  let row = 0;
  let dir = 0;
  let column = input.map[0].split("").findIndex((x) => x === ".");
  // console.log(-1, row, column, dir);
  let nextDir = 0;
  for (let i = 0; i < input.instructions.length; i++) {
    const [steps, rotation] = input.instructions[i];
    // move
    let [x, y] = [column, row];
    for (let s = 0; s < steps; s++) {
      [x, y, nextDir] = findNext(cubeMap, x, y, dir);
      next = input.map[y][x];
      if (next === ".") {
        [column, row, dir] = [x, y, nextDir];
        continue;
      }
      if (next === "#") {
        break;
      }
      console.log("what?!");
    }
    // rotate
    if (rotation === "L") {
      dir = (directions.length + dir - 1) % directions.length;
    } else if (rotation === "R") {
      dir = (dir + 1) % directions.length;
    }

    // console.log(i, ":", steps, rotation, "=>", row, column, dir);
  }

  return 1000 * (row + 1) + 4 * (column + 1) + dir;
}

// map:
//  12
//  3
// 45
// 6
const cubeMap = {
  // [column, row], edges in respectively to directions, rotations respectively to directions
  1: { position: [50, 0], edges: [2, 3, 4, 6], rotations: [0, 0, 2, -1] },
  2: { position: [100, 0], edges: [5, 3, 1, 6], rotations: [-2, -1, 0, 0] },
  3: { position: [50, 50], edges: [2, 5, 4, 1], rotations: [1, 0, 1, 0] },
  4: { position: [0, 100], edges: [5, 6, 1, 3], rotations: [0, 0, -2, -1] },
  5: { position: [50, 100], edges: [2, 6, 4, 3], rotations: [2, -1, 0, 0] },
  6: { position: [0, 150], edges: [5, 2, 1, 4], rotations: [1, 0, 1, 0] },
};
console.log(solve2(input, cubeMap));
