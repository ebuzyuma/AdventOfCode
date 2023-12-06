const utils = require("../utils");
const lines = utils.readInput(__dirname, "input.txt");

let times1 = lines[0]
  .split(":")[1]
  .trim()
  .split(/\s+/)
  .map((x) => +x);
let distances1 = lines[1]
  .split(":")[1]
  .trim()
  .split(/\s+/)
  .map((x) => +x);

// Part 1
function findOptions(times, distances) {
  let result = [];
  for (let i = 0; i < times.length; i++) {
    // v = wt
    // d = (t - wt) * v > rd
    // wt * wt - t * wt + rd < 0
    let t = times[i];
    let rd = distances[i];
    let disc = t * t - 4 * 1 * rd;
    let wt1 = (t - Math.sqrt(disc)) / 2;
    let wt2 = (t + Math.sqrt(disc)) / 2;
    let from = Math.ceil(wt1);
    let to = Math.ceil(wt2);
    // in case you could have the exact same distance add
    if (from === wt1) from++;
    let options = to - from;
    result.push(options);
  }
  return result;
}
const part1 = findOptions(times1, distances1).product();
console.log(part1);

// Part 2
let times2 = lines[0].split(":")[1].replaceAll(/\s+/g, "");
let distances2 = lines[1].split(":")[1].replaceAll(/\s+/g, "");
const part2 = findOptions([+times2], [+distances2]).product();
console.log(part2);
