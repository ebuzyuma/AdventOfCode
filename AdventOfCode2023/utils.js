require("./array");
const fs = require("fs");

const readInput = (inputFolder, doNotTrim) => {
  const data = fs.readFileSync(`${inputFolder}/input.txt`, "utf8");

  const lines = data.split("\n").map((x) => doNotTrim ? x : x.trim());

  return lines;
};

const readExampleInput = (inputFolder, doNotTrim) => {
  const data = fs.readFileSync(`${inputFolder}/example.txt`, "utf8");

  const lines = data.split("\n").map((x) => doNotTrim ? x : x.trim());

  return lines;
};

const multilineRegex = (...parts) =>
  new RegExp(parts.map((x) => (x instanceof RegExp ? x.source : x)).join(""));

module.exports = { readInput, readExampleInput, multilineRegex };


