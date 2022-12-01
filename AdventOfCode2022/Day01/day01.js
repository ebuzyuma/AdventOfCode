const fs = require("fs");

const data = fs.readFileSync("Day01/input.txt", "utf8");

const sums = [];
const lines = data.split("\n");
let max = 0;
let sum = 0;
for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();
  if (!line) {
    if (sum > max) {
      max = sum;
    }
    sums.push(sum);
    sum = 0;
  } else {
    sum += +line;
  }
}

// Part 1
console.log(max);

// Part 2
sums.sort();
sums.reverse();
console.log(sums[0] + sums[1] + sums[2]);
