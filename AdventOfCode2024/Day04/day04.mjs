import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function getWord(input, i, j, di, dj) {
  let word = "";
  for (let t = 0; t < 4; t++) {
    let row = input[i + t * di];
    if (!row) {
      return "";
    }
    let letter = input[i + t * di][j + t * dj];
    if (!letter) {
      return "";
    }

    word += letter;
  }

  return word;
}

function countXmas(input, i, j) {
  let cellCount = 0;
  let row = getWord(input, i, j, 0, 1);
  if (row == "XMAS" || row == "SAMX") cellCount++;

  let column = getWord(input, i, j, 1, 0);
  if (column == "XMAS" || column == "SAMX") cellCount++;

  let diag = getWord(input, i, j, 1, 1);
  if (diag == "XMAS" || diag == "SAMX") cellCount++;

  let diag2 = getWord(input, i, j, 1, -1);
  if (diag2 == "XMAS" || diag2 == "SAMX") cellCount++;

  // console.log(i, j, cellCount);

  return cellCount;
}

function countXmas2(input, i, j) {
  if (
    input[i][j] == "A" &&
    ((input[i - 1][j - 1] == "M" &&
      input[i + 1][j - 1] == "M" &&
      input[i - 1][j + 1] == "S" &&
      input[i + 1][j + 1] == "S") ||
      (input[i - 1][j - 1] == "S" &&
        input[i + 1][j - 1] == "S" &&
        input[i - 1][j + 1] == "M" &&
        input[i + 1][j + 1] == "M") ||
      (input[i - 1][j - 1] == "M" &&
        input[i + 1][j - 1] == "S" &&
        input[i - 1][j + 1] == "M" &&
        input[i + 1][j + 1] == "S") ||
      (input[i - 1][j - 1] == "S" &&
        input[i + 1][j - 1] == "M" &&
        input[i - 1][j + 1] == "S" &&
        input[i + 1][j + 1] == "M"))
  ) {
    return 1;
  }
  return 0;
}

function solve(input) {
  // Part 1
  let p1 = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      p1 += countXmas(input, i, j);
    }
  }

  // Part 2
  let p2 = 0;
  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[0].length - 1; j++) {
      p2 += countXmas2(input, i, j);
    }
  }

  return [p1, p2];
}

//27842056
console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
