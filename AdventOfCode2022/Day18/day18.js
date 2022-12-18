const utils = require("../utils");
const lines = utils.readInput(__dirname);

let grid = {};
for (let i = 0; i < lines.length; i++) {
  grid[lines[i]] = true;
}

let directions = [
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
  [1, 0, 0],
  [-1, 0, 0],
];

// Part 1
let count = 0;
let [xMax, yMax, zMax] = [0, 0, 0];
for (let i = 0; i < lines.length; i++) {
  let [x, y, z] = lines[i].split(",").map((t) => +t);
  [xMax, yMax, zMax] = [Math.max(xMax, x), Math.max(yMax, y), Math.max(zMax, z)];
  for (let d = 0; d < directions.length; d++) {
    let [dx, dy, dz] = directions[d];
    if (!grid[`${x + dx},${y + dy},${z + dz}`]) {
      count++;
    }
  }
}

// Part 2
console.log(count);
const canReachOutSide = (grid, p) => {
  let visited = {};
  let queue = [p];
  while (queue.length > 0) {
    let [x, y, z] = queue.pop();
    if (x <= 0 || y <= 0 || z <= 0 || x >= xMax || y >= yMax || z >= zMax) {
      return true;
    }
    visited[`${x},${y},${z}`] = true;
    for (let d = 0; d < directions.length; d++) {
      let [dx, dy, dz] = directions[d];
      let k = `${x + dx},${y + dy},${z + dz}`;
      if (!grid[k] && !visited[k]) {
        queue.push([x + dx, y + dy, z + dz]);
      }
    }
  }

  return false;
};

let count2 = 0;
for (let i = 0; i < lines.length; i++) {
  let [x, y, z] = lines[i].split(",").map((t) => +t);
  for (let d = 0; d < directions.length; d++) {
    let [dx, dy, dz] = directions[d];
    if (
      !grid[`${x + dx},${y + dy},${z + dz}`] &&
      canReachOutSide(grid, [x + dx, y + dy, z + dz])
    ) {
      count2++;
    }
  }
}

console.log(count2);
