const utils = require("../utils");
const lines = utils.readInput(__dirname);

let cycles = [];
let x = 1;
let crt = [];
const draw = (crt, spritePosition) => {
  if (crt.length % 40 >= spritePosition - 1 && crt.length % 40 <= spritePosition + 1) {
    crt.push("#");
  } else {
    crt.push(".");
  }
};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].split(" ");
  if (line[0] === "addx") {
    cycles.push(x);
    draw(crt, x);
    cycles.push(x);
    draw(crt, x);
    x += +line[1];
  } else {
    cycles.push(x);
    draw(crt, x);
  }
}

const p = [20, 60, 100, 140, 180, 220];
let result = p.reduce((r, v) => r + v * cycles[v - 1], 0);
console.log(result);

for (let i = 0; i < crt.length; i += 40) {
  console.log(crt.slice(i, i + 40).join(""));
}
