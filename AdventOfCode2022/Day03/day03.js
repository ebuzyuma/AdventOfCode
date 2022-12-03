const fs = require("fs");

const data = fs.readFileSync("Day03/input.txt", "utf8");

const split = (x) => {
  return [x.slice(0, x.length / 2), x.slice(x.length / 2)];
};

const findCommon = ([x, y]) => {
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < y.length; j++) {
      if (x[i] == y[j]) return x[i];
    }
  }
};

const findCommon3 = ([x, y, z]) => {
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < y.length; j++) {
      for (let k = 0; k < z.length; k++) {
        if (x[i] == y[j] && y[j] == z[k]) return x[i];
      }
    }
  }
};

const toScore = (x) => {
  if (x.match(/[a-z]/g)) {
    return 1 + x.charCodeAt(0) - "a".charCodeAt(0);
  }

  return 27 + x.charCodeAt(0) - "A".charCodeAt(0);
};

const rucksacks = data.split("\n").map((x) => x.trim());

// Part 1
let score = 0;
for (let i = 0; i < rucksacks.length; i++) {
  const rucksack = split(rucksacks[i]);
  const common = findCommon(rucksack);
  const s = toScore(common);
  score += s;
}
console.log(score);

// Part 2
let elfs = [];
let score3 = 0;
for (let i = 0; i < rucksacks.length; i++) {
  elfs.push(rucksacks[i]);
  if (elfs.length == 3) {
    const common = findCommon3(elfs);
    const s = toScore(common);
    score3 += s;
    elfs = [];
  }
}

console.log(score3);
