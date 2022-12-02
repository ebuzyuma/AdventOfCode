const fs = require("fs");

const data = fs.readFileSync("Day02/input.txt", "utf8");

const rounds = data.split("\n").map((x) => x.trim().split(" "));

const elf = {
  A: 1,
  B: 2,
  C: 3,
};

const me = {
  X: 1,
  Y: 2,
  Z: 3,
};

const score1 = (x, y) => {
  const a = elf[x];
  const b = me[y];
  if (a == b) {
    return b + 3;
  } else if ((a == 3 && b == 1) || b - a == 1) {
    return b + 6;
  }

  return b;
};

const scores1 = rounds.map(([a, b]) => score1(a, b));

const total1 = scores1.reduce((r, v) => r + v, 0);
console.log(total1);

const meToInt = (elf, me) => {
  if (me == "X") return elf == 1 ? 3 : elf - 1;
  if (me == "Y") return elf;
  return elf == 3 ? 1 : elf + 1;
}

const score2 = (x, y) => {
  const a = elf[x];
  let b = meToInt(a, y);
  if (a == b) {
    return b + 3;
  } else if ((a == 3 && b == 1) || b - a == 1) {
    return b + 6;
  }

  return b;
};
const scores2 = rounds.map(([a, b]) => score2(a, b));

const total2 = scores2.reduce((r, v) => r + v, 0);
console.log(total2);
