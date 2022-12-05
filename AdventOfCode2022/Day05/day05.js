const fs = require("fs");
const data = fs.readFileSync("Day05/input.txt", "utf8");
const lines = data.split("\n").map((x) => x.trim());

let stacks = [
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
  const move = +split[1];
  const from = +split[3];
  const to = +split[5];
  moves.push({ move, from, to });
}

for (let i = 0; i < moves.length; i++) {
  const move = moves[i];
  const crack = stacks[move.from].splice(stacks[move.from].length - move.move);
  stacks[move.to] = [...stacks[move.to], ...crack];
  //for (let k = 0; k < move.move; k++) {
  //const crack = stacks[move.from].pop();
  //stacks[move.to].push(crack);
  //}
}

const result = stacks.map((x) => x[x.length - 1]).join("");

console.log(result);
