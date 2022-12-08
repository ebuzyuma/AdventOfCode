const utils = require("../utils");
const lines = utils.readInput(__dirname);

const isEdge = (row, column) =>
  row === 0 || row === lines.length - 1 || column === 0 || column === lines[0].length - 1;

const trees = lines.map((x, row) =>
  x.split("").map((y, column) => ({ h: +y, visible: isEdge(row, column) }))
);

const rowSize = trees[0].length;

for (let row = 1; row < trees.length - 1; row++) {
  let visibleH = trees[row][0].h + 1;
  for (let column = 1; column < rowSize - 1; column++) {
    if (trees[row][column].h >= visibleH) {
      trees[row][column].visible = true;
      visibleH = trees[row][column].h + 1;
    }
  }

  visibleH = trees[row][rowSize - 1].h + 1;
  for (let column = rowSize - 2; column > 0; column--) {
    if (trees[row][column].h >= visibleH) {
      trees[row][column].visible = true;
      visibleH = trees[row][column].h + 1;
    }
  }
}

for (let column = 1; column < rowSize - 1; column++) {
  let visibleH = trees[0][column].h + 1;
  for (let row = 1; row < trees.length - 1; row++) {
    if (trees[row][column].h >= visibleH) {
      trees[row][column].visible = true;
      visibleH = trees[row][column].h + 1;
    }
  }

  visibleH = trees[trees.length - 1][column].h + 1;
  for (let row = trees.length - 2; row > 0; row--) {
    if (trees[row][column].h >= visibleH) {
      trees[row][column].visible = true;
      visibleH = trees[row][column].h + 1;
    }
  }
}

const count = trees.reduce((s, row) => s + row.reduce((s1, v) => s1 + (v.visible ? 1 : 0), 0), 0);
console.log(count);

let maxScore = 0;
for (let row = 1; row < trees.length - 1; row++) {
  for (let column = 1; column < rowSize - 1; column++) {
    let i = 1;
    let visibleUp = 0;
    let visibleH = 0;
    while (row - i >= 0 && visibleH < trees[row][column].h) {
      if (row - i >= 0) {
        visibleUp++;
        visibleH = trees[row - i][column].h;
      }
      i++;
    }

    i = 1;
    let visibleDown = 0;
    visibleH = 0;
    while (row + i < trees.length && visibleH < trees[row][column].h) {
      if (row + i < trees.length) {
        visibleDown++;
        visibleH = trees[row + i][column].h;
      }
      i++;
    }

    i = 1;
    let visibleLeft = 0;
    visibleH = 0;
    while (column - i >= 0 && visibleH < trees[row][column].h) {
      if (column - i >= 0) {
        visibleLeft++;
        visibleH = trees[row][column - i].h;
      }
      i++;
    }

    i = 1;
    let visibleRight = 0;
    visibleH = 0;
    while (column + i < rowSize && visibleH < trees[row][column].h) {
      if (column + i < rowSize) {
        visibleRight++;
        visibleH = trees[row][column + i].h;
      }
      i++;
    }

    const score = visibleUp * visibleDown * visibleLeft * visibleRight;
    maxScore = Math.max(maxScore, score);
  }
}

console.log(maxScore);

const visibleStr = trees.reduce(
  (s, row) => s + "\n" + row.reduce((s1, v) => s1 + (v.visible ? "1" : "0"), ""),
  ""
);
//console.log(visibleStr);
