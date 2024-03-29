import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function getKey({ col, row }) {
  return `${row}x${col}`;
}

function setValue(grid, pos, value) {
  grid[getKey(pos)] = value;
}
function getValue(grid, pos, def) {
  return grid[getKey(pos)] ?? def;
}

const dirs = [
  { dr: -1, dc: 0 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: 1 },
  { dr: 0, dc: -1 },
];

const strDirs = ["^", "v", ">", "<"];

function move(grid, start, end, skipSlopes) {
  let paths = [{ path: [start] }];
  let visited = {};
  let printed = {};
  let endLength = [];
  let visit = grid.map((line) => line.filter((x) => x !== "#").length).sum();
  while (paths.length > 0) {
    let p = Math.round((100 * Object.keys(visited).length) / visit);
    if ((p % 10 === 0 || p >= 90) && !printed[p]) {
      printed[p] = true;
      console.log("completed:", p);
    }
    let { path } = paths.shift();
    let pos = path.last();
    if (getKey(pos) === getKey(end) && !endLength.includes(path.length)) {
      endLength.push(path.length - 1);
      console.log(endLength);
    }
    let anotherPathToThisPos = getValue(visited, pos, []);
    if (path.length <= anotherPathToThisPos.length) {
      continue;
    }

    setValue(visited, pos, path.map(getKey));

    let possibleNext = [];
    let value = grid[pos.row][pos.col];
    if (!skipSlopes && strDirs.includes(value)) {
      let dir = dirs[strDirs.indexOf(value)];
      possibleNext = [{ row: pos.row + dir.dr, col: pos.col + dir.dc }];
    } else {
      possibleNext = dirs
        .map((d) => ({ row: pos.row + d.dr, col: pos.col + d.dc }))
        .filter((p) => p.row >= 0 && p.row < grid.length);
    }

    possibleNext = possibleNext
      .filter((p) => grid[p.row][p.col] !== "#")
      .filter((p) => !path.find((x) => x.row === p.row && x.col === p.col));

    let extraOptions = possibleNext.map((p) => ({ path: [...path, p] }));
    paths.push(...extraOptions);
    paths = paths.orderBy((x) => x.path.length);
  }

  return getValue(visited, end).length - 1;
}

function findAdjacentNodes(grid, sPos) {
  let adjacent = [];
  let visited = {};
  setValue(visited, sPos, 0);
  let possibleNext = dirs
    .map((d) => ({ row: sPos.row + d.dr, col: sPos.col + d.dc }))
    .filter((p) => p.row >= 0 && p.row < grid.length)
    .filter((p) => grid[p.row][p.col] !== "#");
  let length = 1;
  do {
    let nextState = [];
    for (let pos of possibleNext) {
      setValue(visited, pos, length);
      let nextForNext = dirs
        .map((d) => ({ row: pos.row + d.dr, col: pos.col + d.dc }))
        .filter((p) => grid[p.row][p.col] !== "#")
        .filter((p) => getValue(visited, p) === undefined);

      if (nextForNext.length === 0) {
        // does not lead to any node
        continue;
      }

      // start end node
      if (nextForNext[0].row === 0 || nextForNext[0].row === grid.length - 1) {
        adjacent.push({ pos: nextForNext[0], length: length + 1 });
        continue;
      }

      if (nextForNext.length > 1) {
        adjacent.push({ pos: pos, length });
        continue;
      }

      nextState.push(nextForNext[0]);
    }
    possibleNext = nextState;
    length++;
  } while (possibleNext.length > 0);

  return adjacent;
}

function buildGraph(grid, start) {
  let nodes = {};
  let queue = [start];
  while (queue.length > 0) {
    let nodePos = queue.shift();

    let edges = findAdjacentNodes(grid, nodePos);

    setValue(nodes, nodePos, edges);
    for (let edge of edges) {
      if (!getValue(nodes, edge.pos)) {
        // node is not searched yet
        queue.push(edge.pos);
      }
    }
  }

  return nodes;
}

function getEdges(nodes) {
  let edges = {};
  for (let [node1Key, adjacent] of Object.entries(nodes)) {
    for (let node2 of adjacent) {
      let node2Key = getKey(node2.pos);
      let isAlreadyAdded = edges[`${node1Key}-${node2Key}`] || edges[`${node2Key}-${node1Key}`];
      if (!isAlreadyAdded) {
        edges[`${node1Key}-${getKey(node2.pos)}`] = {
          length: node2.length,
          node1: node1Key,
          node2: node2Key,
        };
      }
    }
  }

  return Object.values(edges);
}

function findMaxPath(edges, start, end) {
  let adjacentEdges = edges.filter((e) => e.node1 === start || e.node2 === start);
  let adjacentNodes = adjacentEdges.map((e) => (e.node1 === start ? e.node2 : e.node1));

  let paths = [{ edges: adjacentEdges, last: adjacentNodes[0] }];
  let longestPath = 0;
  while (paths.length > 0) {
    let path = paths.pop();
    adjacentEdges = edges.filter((e) => e.node1 === path.last || e.node2 === path.last);
    for (let adjacentEdge of adjacentEdges) {
      let adjacentNode = adjacentEdge.node1 === path.last ? adjacentEdge.node2 : adjacentEdge.node1;
      let hasAlready = path.edges.find(e => e.node1 === adjacentNode || e.node2 === adjacentNode);
      if (hasAlready) {
        continue;
      }
      if (adjacentNode === end) {
        let length = path.edges.map((e) => e.length).sum() + adjacentEdge.length;
        if (length > longestPath) {
          longestPath = length;
        }
        break;
      } else {
        paths.push({ edges: [...path.edges, adjacentEdge], last: adjacentNode });
      }
    }
  }

  return longestPath;
}

function solve(input) {
  let grid = input.map((line) => line.split(""));
  let sPos = { row: 0, col: 1 };
  let ePos = { row: grid.length - 1, col: grid[0].length - 2 };

  // Part 1
  let p1 = move(grid, sPos, ePos, false);

  // Part 2
  console.log("part 2");
  // let p2 = move(grid, sPos, ePos, true);
  let graph = buildGraph(grid, sPos);
  let tree = getEdges(graph);
  console.log(tree);
  let path = findMaxPath(tree, getKey(sPos), getKey(ePos));

  return [p1, path];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
