const fs = require("fs");
const data = fs.readFileSync("Day04/input.txt", "utf8");

const lines = data.split("\n").map((x) => x.trim());

const overlap = [];

const overlap2 = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const [elf1str, elf2str] = line.split(",");
  const [elf1left, elf1right] = elf1str.split("-").map((x) => +x);
  const [elf2left, elf2right] = elf2str.split("-").map((x) => +x);

  if (
    (elf1left <= elf2left && elf1right >= elf2right) ||
    (elf2left <= elf1left && elf2right >= elf1right)
  ) {
    overlap.push(line);
  }

  if (
    (elf1right >= elf2left && elf1left <= elf2right) ||
    (elf2right >= elf1left && elf2left <= elf1right)
  ) {
    overlap2.push(line);
  }
}

console.log(overlap.length);

console.log(overlap2.length);
