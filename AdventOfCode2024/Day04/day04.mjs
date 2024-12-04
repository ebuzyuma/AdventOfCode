import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function getWord(input, i, j, [di, dj]) {
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

  let directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let dir of directions) {
    let word = getWord(input, i, j, dir);
    if (word == "XMAS" || word == "SAMX") {
      cellCount++;
    }
  }

  return cellCount;
}

function countXmas2(input, i, j) {
  let word =
    input[i - 1][j - 1] +
    input[i - 1][j + 1] +
    input[i][j] +
    input[i + 1][j - 1] +
    input[i + 1][j + 1];

  if (word == "MMASS" || word == "SSAMM" || word == "MSAMS" || word == "SMASM") {
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
