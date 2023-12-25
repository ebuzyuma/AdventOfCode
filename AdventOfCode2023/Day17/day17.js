const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function getKey({ row, col }) {
  return `${row}x${col}`;
}

function getValue(grid, pos) {
  return grid[getKey(pos)];
}

function setValue(grid, pos, value) {
  let key = getKey(pos);
  grid[key] = value;
}

function move(pos, dir) {
  return { row: pos.row + dir.row, col: pos.col + dir.col };
}

function print(grid, map) {
  for (let row = 0; row < grid.length; row++) {
    let rowStr = "";
    for (let col = 0; col < grid[row].length; col++) {
      let element = getValue(map, { row, col });
      rowStr += `\t${element?.score || ""}`;
    }
    console.log(rowStr);
  }
  console.log("");
  console.log("");
}

function printPath(grid, pathPoints, pathStr) {
  for (let row = 0; row < grid.length; row++) {
    let rowStr = "";
    for (let col = 0; col < grid[row].length; col++) {
      let pathIndex = pathPoints.findIndex((p) => p.row === row && p.col === col);
      if (pathIndex > 0) {
        let elem = pathStr[pathIndex - 1];
        rowStr += elem;
      } else {
        rowStr += grid[row][col];
      }
    }
    console.log(rowStr);
  }
  console.log("");
  console.log("");
}

function repeatedTailCount(path) {
  let last = path[path.length - 1];
  if (!last) return 0;
  let count = 1;
  while (path[path.length - 1 - count] === last) count++;
  return count;
}

function runCrucible(grid, start, end) {
  let cols = grid[0].length;
  let rows = grid.length;
  let heatLossMap = {};
  let toBeVisited = [{ pos: start, path: "", score: 0 }];
  while (toBeVisited.length > 0) {
    // print(grid, heatLossMap);
    let curr = toBeVisited.shift();
    if (curr.pos.row === end.row && curr.pos.col === end.col) {
      continue;
    }
    // console.log("step: ", curr.pos, curr.score, curr.path);
    let lastMove = curr.path.substring(curr.path.length - 1);
    let lastMoves = curr.path.substring(curr.path.length - 3);
    let options = [];
    // move right >
    if (lastMove !== "<" && lastMoves !== ">>>" && curr.pos.col < cols - 1) {
      let nextPos = move(curr.pos, { row: 0, col: 1 });
      options.push({
        pos: nextPos,
        path: curr.path + ">",
        score: curr.score + grid[nextPos.row][nextPos.col],
      });
    }
    // move down v
    if (lastMove !== "^" && lastMoves !== "vvv" && curr.pos.row < rows - 1) {
      let nextPos = move(curr.pos, { row: 1, col: 0 });
      options.push({
        pos: nextPos,
        path: curr.path + "v",
        score: curr.score + grid[nextPos.row][nextPos.col],
      });
    }
    // move up ^
    if (lastMove !== "v" && lastMoves !== "^^^" && curr.pos.row > 0) {
      let nextPos = move(curr.pos, { row: -1, col: 0 });
      options.push({
        pos: nextPos,
        path: curr.path + "^",
        score: curr.score + grid[nextPos.row][nextPos.col],
      });
    }
    // move left <
    if (lastMove !== ">" && lastMoves !== "<<<" && curr.pos.col > 0) {
      let nextPos = move(curr.pos, { row: 0, col: -1 });
      options.push({
        pos: nextPos,
        path: curr.path + "<",
        score: curr.score + grid[nextPos.row][nextPos.col],
      });
    }

    let diff = 5;
    for (let option of options) {
      let minState = getValue(heatLossMap, option.pos);
      if (!minState) {
        setValue(heatLossMap, option.pos, option);
        toBeVisited.push(option);
        continue;
      }

      let rMin = repeatedTailCount(minState.path);
      let rCurr = repeatedTailCount(option.path);
      if (minState.score > option.score - diff && rMin >= rCurr) {
        if (minState.score > option.score) {
          setValue(heatLossMap, option.pos, option);
        }
        toBeVisited.push(option);
      }
    }

    toBeVisited.sort((a, b) => a.score - b.score);
  }

  return getValue(heatLossMap, end);
}

let maxValue = 1e10;

function dijkstra(grid, start, end) {
  let cols = grid[0].length;
  let rows = grid.length;

  const edgeWeight = (pos) =>
    pos.row < 0 || pos.row >= rows || pos.col < 0 || pos.col >= cols
      ? maxValue
      : grid[pos.row][pos.col];

  let queue = [];
  queue.push({ dist: 0, pos: { row: 0, col: 0 }, nextDir: 0 }); // 0 - row
  queue.push({ dist: 0, pos: { row: 0, col: 0 }, nextDir: 1 }); // 1 - col
  let seen = {};

  let dist = {};
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      setValue(dist, { row, col }, maxValue);
    }
  }

  setValue(dist, start, 0);

  while (queue.length > 0) {
    let { dist, pos, nextDir } = queue.shift();

    if (pos.row < 0 || pos.row >= rows || pos.col < 0 || pos.col >= cols) {
      continue;
    }

    if (seen[`${getKey(pos)}_${nextDir}`]) {
      continue;
    }

    seen[`${getKey(pos)}_${nextDir}`] = dist;

    if (pos.row == end.row && pos.col == end.col) {
      return dist;
    }

    let currDist;
    if (nextDir === 0) {
      currDist = dist;
      for (let i = 1; i <= 10; i++) {
        let nextPos = { row: pos.row, col: pos.col + i };
        currDist += edgeWeight(nextPos);
        if (currDist > maxValue) break;
        if (i < 4) continue;
        queue.push({ dist: currDist, pos: nextPos, nextDir: 1 });
      }
      currDist = dist;
      for (let i = 1; i <= 10; i++) {
        let nextPos = { row: pos.row, col: pos.col - i };
        currDist += edgeWeight(nextPos);
        if (currDist > maxValue) break;
        if (i < 4) continue;
        queue.push({ dist: currDist, pos: nextPos, nextDir: 1 });
      }
    } else if (nextDir == 1) {
      currDist = dist;
      for (let i = 1; i <= 10; i++) {
        let nextPos = { row: pos.row + i, col: pos.col };
        currDist += edgeWeight(nextPos);
        if (currDist > maxValue) break;
        if (i < 4) continue;
        queue.push({ dist: currDist, pos: nextPos, nextDir: 0 });
      }
      currDist = dist;
      for (let i = 1; i <= 10; i++) {
        let nextPos = { row: pos.row - i, col: pos.col };
        currDist += edgeWeight(nextPos);
        if (currDist > maxValue) break;
        if (i < 4) continue;
        queue.push({ dist: currDist, pos: nextPos, nextDir: 0 });
      }
    }

    queue.sort((a, b) => a.dist - b.dist);
  }

  return getValue(dist, end);
}

function solve(input) {
  let grid = input.map((r) => r.split("").map((x) => +x));

  // Part 1
  let p1 = runCrucible(grid, { row: 0, col: 0 }, { row: grid.length - 1, col: grid[0].length - 1 });
  
  // Part 2
  let p2 = dijkstra(grid, { row: 0, col: 0 }, { row: grid.length - 1, col: grid[0].length - 1 });

  return [p1.score, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
