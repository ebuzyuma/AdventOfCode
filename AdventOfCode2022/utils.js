require("./array");
const fs = require("fs");

const readInput = (inputFolder) => {
  const data = fs.readFileSync(`${inputFolder}/input.txt`, "utf8");

  const lines = data.split("\n").map((x) => x.trim());

  return lines;
};

module.exports = { readInput };
