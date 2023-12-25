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

function hasValue(grid, pos, value) {
  let arr = grid[getKey(pos)] || [];
  return arr.includes(dirToStr(value));
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

function shouldTurn(path) {
  if (path.length < 3) return false;

  let s = path.length - 1;
  return (
    (path[s].row === path[s - 1].row && path[s - 1].row === path[s - 2].row) ||
    (path[s].col === path[s - 1].col && path[s - 1].col === path[s - 2].col)
  );
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
  let printed = {};
  let toBeVisited = [{ pos: start, path: "", score: 0 }];
  while (toBeVisited.length > 0) {
    // print(grid, heatLossMap);
    let curr = toBeVisited.shift();
    if (curr.pos.row === end.row && curr.pos.col === end.col) {
      continue;
    }
    let visitLength = Object.keys(heatLossMap).length;
    if (visitLength % 1000 === 0 && !printed[visitLength]) {
      console.log(visitLength, cols * rows);
      printed[visitLength] = true;
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

function getPossibleMoves(curr, pathStr, rows, cols) {
  let options = [];
  const sameDirectionLimit = 3;
  let lastMove = pathStr.substring(pathStr.length - 1);
  let lastMoves = pathStr.substring(pathStr.length - sameDirectionLimit);

  // move right >
  if (lastMove !== "<" && lastMoves !== ">>>" && curr.col < cols - 1) {
    let nextPos = move(curr, { row: 0, col: 1 });
    options.push({
      nextPos,
      moveStr: ">",
    });
  }
  // move down v
  if (lastMove !== "^" && lastMoves !== "vvv" && curr.row < rows - 1) {
    let nextPos = move(curr, { row: 1, col: 0 });
    options.push({
      nextPos,
      moveStr: "v",
    });
  }
  // move up ^
  if (lastMove !== "v" && lastMoves !== "^^^" && curr.row > 0) {
    let nextPos = move(curr, { row: -1, col: 0 });
    options.push({
      nextPos,
      moveStr: "^",
    });
  }
  // move left <
  if (lastMove !== ">" && lastMoves !== "<<<" && curr.col > 0) {
    let nextPos = move(curr, { row: 0, col: -1 });
    options.push({
      nextPos,
      moveStr: "<",
    });
  }

  return options;
}

function getPossibleMoves2(curr, pathStr, rows, cols) {
  let options = [];
  const sameDirectionMin = 4;
  const sameDirectionLimit = 10;
  let lastMove = pathStr.substring(pathStr.length - 1);
  let repeatCount = repeatedTailCount(pathStr);
  if (!!pathStr && repeatCount < sameDirectionMin) {
    let dir = strToDir(lastMove);
    let nextPos = move(curr, dir);
    let required = sameDirectionMin - repeatCount - 1;
    let checkPos = nextPos;
    while (required-- > 0) {
      checkPos = move(checkPos, dir);
    }
    if (checkPos.row >= 0 && checkPos.row < rows && checkPos.col >= 0 && checkPos.col < cols) {
      options.push({
        nextPos,
        moveStr: lastMove,
      });
    }
    return options;
  }

  // move right >
  if (
    lastMove !== "<" &&
    ((lastMove !== ">" && curr.col + sameDirectionMin < cols) ||
      (lastMove === ">" && repeatCount < sameDirectionLimit)) &&
    curr.col < cols - 1
  ) {
    let nextPos = move(curr, { row: 0, col: 1 });
    options.push({
      nextPos,
      moveStr: ">",
    });
  }
  // move down v
  if (
    lastMove !== "^" &&
    ((lastMove !== "v" && curr.row + sameDirectionMin < rows) ||
      (lastMove === "v" && repeatCount < sameDirectionLimit)) &&
    curr.row < rows - 1
  ) {
    let nextPos = move(curr, { row: 1, col: 0 });
    options.push({
      nextPos,
      moveStr: "v",
    });
  }
  // move up ^
  if (
    lastMove !== "v" &&
    ((lastMove !== "^" && curr.row - sameDirectionMin >= 0) ||
      (lastMove === "^" && repeatCount < sameDirectionLimit)) &&
    curr.row > 0
  ) {
    let nextPos = move(curr, { row: -1, col: 0 });
    options.push({
      nextPos,
      moveStr: "^",
    });
  }
  // move left <
  if (
    lastMove !== ">" &&
    ((lastMove !== "<" && curr.col - sameDirectionMin >= 0) ||
      (lastMove === ">" && repeatCount < sameDirectionLimit)) &&
    curr.col > 0
  ) {
    let nextPos = move(curr, { row: 0, col: -1 });
    options.push({
      nextPos,
      moveStr: "<",
    });
  }

  return options;
}

function getRepeatedTail(pathStr) {
  return pathStr.substring(pathStr.length - repeatedTailCount(pathStr));
}

function findPaths(grid, start, end, localMin) {
  let cols = grid[0].length;
  let rows = grid.length;
  let heatLossMap = {};
  setValue(heatLossMap, start, []);
  let state = {};
  setValue(state, start, [
    { endPos: start, pathStr: "", pathPos: [getKey(start)], score: 0, options: 1 },
  ]);
  let keepSearching = true;
  let minScore = Number.MAX_SAFE_INTEGER;
  let printed = {};
  const deltaWithMinToConsider = +process.argv[2] || 10;
  let endingMin = Number.MAX_SAFE_INTEGER;
  while (keepSearching) {
    let nextState = {};

    for (let [posKey, pathsToPos] of Object.entries(state)) {
      // do not continue for end
      if (posKey === getKey(end)) {
        continue;
      }
      // Expand only ends with low score
      // if (pathsToPos.every((p) => p.score - deltaWithMinToConsider > minScore)) {
      //   nextState[posKey] = pathsToPos;
      //   continue;
      // }
      for (let path of pathsToPos) {
        // Expand only ends with low score
        if (path.score - deltaWithMinToConsider > minScore) {
          nextState[posKey] ||= [];
          nextState[posKey].push(path);
          continue;
        }

        let possibleMoves = getPossibleMoves(path.endPos, path.pathStr, rows, cols);
        for (let { nextPos, moveStr } of possibleMoves) {
          let nextPosKey = getKey(nextPos);

          // exclude option stepping on the same path
          if (path.pathPos.includes(nextPosKey)) {
            continue;
          }

          nextState[nextPosKey] ||= [];
          let nextPath = path.pathStr + moveStr;
          let nextScore = path.score + grid[nextPos.row][nextPos.col];
          let ending = getRepeatedTail(nextPath);

          // check if there is already a similar option
          let existingSimilarEnding = nextState[nextPosKey].find(
            (x) => getRepeatedTail(x.pathStr) === ending
          );
          if (existingSimilarEnding) {
            if (nextScore > existingSimilarEnding.score) {
              // similar better option
              continue;
            } else if (nextScore < existingSimilarEnding.score) {
              // current option is better
              existingSimilarEnding.pathStr = nextPath;
              existingSimilarEnding.pathPos = [...path.pathPos, nextPos];
              existingSimilarEnding.score = nextScore;
              existingSimilarEnding.options = path.options;
            } else {
              // same score, count extra option
              existingSimilarEnding.options += path.options;
              continue;
            }
          }

          // Another path possibility
          nextState[nextPosKey].push({
            endPos: nextPos,
            pathStr: nextPath,
            pathPos: [...path.pathPos, nextPos],
            score: nextScore,
            options: path.options,
          });
        }
      }
    }

    // filter
    const takeTop = process.argv[3] || 3;
    let endHeating = nextState[getKey(end)];
    let currentEndMin = Math.min(...(endHeating || []).map((x) => x.score));
    keepSearching = !endHeating || currentEndMin > localMin;

    minScore = Number.MAX_SAFE_INTEGER;

    for (let key of Object.keys(nextState)) {
      nextState[key] = nextState[key].sort((a, b) => a.score - b.score);
      minScore = Math.min(minScore, nextState[key][0]?.score || Number.MAX_SAFE_INTEGER);
      // nextState[key] = nextState[key].filter((x) => x.score - deltaWithMinToConsider < minScore);
      nextState[key] = nextState[key].slice(0, key != getKey(end) ? takeTop : 100);
    }

    let covered = Math.round((100 * Object.keys(nextState).length) / rows / cols);
    if (((covered % 2 === 0 || covered > 80) && !printed[covered]) || endingMin !== currentEndMin) {
      console.log(
        covered,
        minScore,
        endHeating?.map((x) => x.options),
        endHeating?.map((x) => x.score)
      );
      printed[covered] = true;
      endingMin = currentEndMin;
    }

    state = nextState;
  }

  let endResult = getValue(state, end);
  console.log(
    "options",
    endResult.map((x) => x.options)
  );
  return endResult.map((x) => x.score);
}

function strToDir(str) {
  switch (str) {
    case "^":
      return { row: -1, col: 0 };
    case "v":
      return { row: 1, col: 0 };
    case ">":
      return { row: 0, col: 1 };
    case "<":
      return { row: 0, col: -1 };
  }
}

function findPaths2(grid, start, end, localMin) {
  let cols = grid[0].length;
  let rows = grid.length;
  let state = {};
  setValue(state, start, [{ endPos: start, pathStr: "", pathPos: [getKey(start)], score: 0 }]);
  let printed = {};
  const deltaWithMinToConsider = +process.argv[2] || 0;
  let minPathScore = Number.MAX_SAFE_INTEGER - 1;
  let endingMinScore = Number.MAX_SAFE_INTEGER;
  while (minPathScore < endingMinScore) {
    let nextState = {};

    for (let [posKey, pathsToPos] of Object.entries(state)) {
      // do not continue for end
      if (posKey === getKey(end)) {
        nextState[posKey] ||= [];
        nextState[posKey].push(...pathsToPos);
        continue;
      }

      for (let path of pathsToPos) {
        // Expand only ends with low score
        if (path.score - deltaWithMinToConsider > minPathScore) {
          nextState[posKey] ||= [];
          nextState[posKey].push(path);
          continue;
        }

        let possibleMoves = getPossibleMoves2(path.endPos, path.pathStr, rows, cols);
        for (let { nextPos, moveStr } of possibleMoves) {
          let nextPosKey = getKey(nextPos);

          // exclude option stepping on the same path
          if (path.pathPos.includes(nextPosKey)) {
            continue;
          }

          nextState[nextPosKey] ||= [];
          let nextPath = path.pathStr + moveStr;
          let nextScore = path.score + grid[nextPos.row][nextPos.col];
          let ending = getRepeatedTail(nextPath);

          // check if there is already a similar option
          let existingSimilarEnding = nextState[nextPosKey].find((x) => {
            let posRepeatedEnding = getRepeatedTail(x.pathStr);
            return (
              ending == posRepeatedEnding
              // || (ending.length >= 4 && ending.endsWith(posRepeatedEnding))
            );
          });
          if (existingSimilarEnding) {
            if (nextScore > existingSimilarEnding.score) {
              // similar has a better option
              continue;
            } else if (nextScore < existingSimilarEnding.score) {
              // current option is better
              existingSimilarEnding.pathStr = nextPath;
              existingSimilarEnding.pathPos = [...path.pathPos, nextPos];
              existingSimilarEnding.score = nextScore;
            } else {
              // same score, count extra option
              continue;
            }
          }

          // Another path possibility
          nextState[nextPosKey].push({
            endPos: nextPos,
            pathStr: nextPath,
            pathPos: [...path.pathPos, nextPos],
            score: nextScore,
          });
        }
      }
    }

    // filter
    const takeTop = process.argv[3] || 6;
    let endHeating = nextState[getKey(end)] || [];
    let currentEndMin = Math.min(...endHeating.map((x) => x.score), endingMinScore);
    // keepSearching = !endHeating || currentEndMin >= localMin;

    minPathScore = Number.MAX_SAFE_INTEGER;

    for (let key of Object.keys(nextState)) {
      nextState[key] = nextState[key].sort((a, b) => a.score - b.score);
      minPathScore = Math.min(minPathScore, nextState[key][0]?.score || Number.MAX_SAFE_INTEGER);
      // nextState[key] = nextState[key].filter((x) => x.score - takeTop < minPathScore);
      nextState[key] = nextState[key].slice(0, key != getKey(end) ? takeTop : 100);
    }

    let covered = Math.round((100 * Object.keys(nextState).length) / rows / cols);
    if (
      ((covered % 2 === 0 || covered > 80) && !printed[covered]) ||
      endingMinScore !== currentEndMin
    ) {
      console.log(
        covered,
        minPathScore,
        endingMinScore,
        endHeating.map((x) => x.score),
        endHeating[0]?.pathStr
      );
      printed[covered] = true;
      endingMinScore = currentEndMin;
    }

    state = nextState;
  }

  let endResult = getValue(state, end);
  return endResult.map((x) => x.score);
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
  let prev = {};
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

function solve(input, min) {
  let grid = input.map((r) => r.split("").map((x) => +x));

  // Part 1
  // let p1 = runCrucible(grid, { row: 0, col: 0 }, { row: grid.length - 1, col: grid[0].length - 1 });
  // let dirs = p1.path.split("").map(strToDir);
  // let pos = { row: 0, col: 0 };
  // let numbers = [grid[0][0]];
  // let pathPoints = [pos];
  // for (let dir of dirs) {
  //   pos = move(pos, dir);
  //   pathPoints.push(pos);
  //   numbers.push(grid[pos.row][pos.col]);
  // }
  // printPath(grid, pathPoints, p1.path);

  // let p1 = findPaths2(
  //   grid,
  //   { row: 0, col: 0 },
  //   { row: grid.length - 1, col: grid[0].length - 1 },
  //   min
  // );

  let p1 = dijkstra(grid, { row: 0, col: 0 }, { row: grid.length - 1, col: grid[0].length - 1 });

  // Part 2

  return [p1];
}

console.log("example:", solve(exampleInput, 102));
console.log(" puzzle:", solve(puzzleInput, 1162));
