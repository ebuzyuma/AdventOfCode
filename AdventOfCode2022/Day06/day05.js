const utils = require("../utils");
const lines = utils.readInput(__dirname);
const input = lines[0];
let i = 0;
for (; i < input.length - 14; i++) {
  let x = input.slice(i, i + 14);
  let s = new Set(x.split(""));
  if (s.size == x.length) {
    break;
  }
}

console.log(i + 14);
