const fs = require("fs");
const data = fs.readFileSync("Day05/input.txt", "utf8");
const lines = data.split("\n").map((x) => x.trim());

let stacksInput = [
  "",
  "QWPSZRHD",
  "VBRWQHF",
  "CVSH",
  "HFG",
  "PGJBZ",
  "QTJHWFL",
  "ZTWDLVJN",
  "DTZCJGHF",
  "WPVMBH",
].map((x) => x.split(""));
let i = 0;
while (lines[i]) {
  i++;
}

i++;

let moves = [];
for (; i < lines.length; i++) {
  const split = lines[i].split(" ");
  const quantity = +split[1];
  const from = +split[3];
  const to = +split[5];
  moves.push({ quantity, from, to });
}

// part 1
const moveByOne = (stacks, move) => {
  for (let k = 0; k < move.quantity; k++) {
    const crate = stacks[move.from].pop();
    stacks[move.to].push(crate);
  }
};

const stacks1 = stacksInput.map((x) => [...x]);
for (let i = 0; i < moves.length; i++) {
  moveByOne(stacks1, moves[i]);
}

const part1 = stacks1.map((x) => x[x.length - 1]).join("");
console.log(part1);


// part 2
const moveByAll = (stacks, move) => {
  const crates = stacks[move.from].splice(stacks[move.from].length - move.quantity);
  stacks[move.to] = [...stacks[move.to], ...crates];
};

const stacks2 = stacksInput.map((x) => [...x]);
for (let i = 0; i < moves.length; i++) {
  moveByAll(stacks2, moves[i]);
}

const part2 = stacks2.map((x) => x[x.length - 1]).join("");
console.log(part2);
