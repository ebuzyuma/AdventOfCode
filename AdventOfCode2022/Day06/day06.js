const utils = require("../utils");
const lines = utils.readInput(__dirname);
const input = lines[0];

const firstStartMarker = (input, d) => {
  let i = -1;
  let chars, unique;
  do {
    i++;
    chars = input.slice(i, i + d).split("");
    unique = new Set(chars);
  } while (unique.size != chars.length);

  return i + d;
};

const part1 = firstStartMarker(input, 4);
console.log(part1);

const part2 = firstStartMarker(input, 14);
console.log(part2);
