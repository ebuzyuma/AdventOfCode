const utils = require("../utils");
const lines = utils.readInput(__dirname);

// Part 1
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
let numbers = [];
let gearNeighbors = {};
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (Number.isInteger(+line[j])) {
      let number = "";
      let hasSymbol = false;
      let gearPosition = "";

      while (Number.isInteger(+line[j])) {
        number += line[j];
        let neighbors = directions.map(([dy, dx]) =>
          lines[i + dy] ? lines[i + dy][j + dx] : undefined
        );
        let symbolPosition = neighbors.findIndex(
          (c) => c !== "." && !Number.isInteger(+c) && c !== undefined
        );
        if (symbolPosition !== -1) {
          hasSymbol = true;
        }
        if (neighbors[symbolPosition] === "*") {
          let [dy, dx] = directions[symbolPosition];
          gearPosition = `${i + dy}x${j + dx}`;
        }
        j++;
      }

      if (hasSymbol) {
        numbers.push(number);
      }
      if (gearPosition) {
        gearNeighbors[gearPosition] ??= [];
        gearNeighbors[gearPosition].push(number);
      }
    }
  }
}
console.log(numbers.sum());

// Part 2
let p2 = Object.values(gearNeighbors)
  .filter((x) => x.length == 2)
  .map(([a, b]) => +a * +b)
  .sum();
console.log(p2);
