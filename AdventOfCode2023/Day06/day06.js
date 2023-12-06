const utils = require("../utils");
const lines = utils.readInput(__dirname, "input.txt");

let times = lines[0]
  .split(":")[1].trim()
  .split(/\s+/)
  .map((x) => +x);
let distances = lines[1]
  .split(":")[1].trim()
  .split(/\s+/)
  .map((x) => +x);

times = [49877895]
distances = [356137815021882]
// Part 1
let result = 1;
for (let i = 0; i < times.length; i++) {
  const t = times[i];
  const rd = distances[i];
  // d = (t - wt) * wt > rd
  // wt*wt - t * wt + rd < 0
  let disc = t * t - 4 * 1 * rd;
  let wt1 = (t - Math.sqrt(disc)) / 2;
  let wt2 = (t + Math.sqrt(disc)) / 2;
  let from = Math.ceil(wt1);
  let to = Math.ceil(wt2);
  if (from === wt1) from++;
  console.log(wt1, wt2, from, to, to - from);
  result *= (to - from)
}

console.log(result)
// Part 2
