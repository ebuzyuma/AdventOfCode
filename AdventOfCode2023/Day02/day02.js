const utils = require("../utils");
const lines = utils.readInput(__dirname);

const red = 12;
const green = 13;
const blue = 14;
let sum = 0;
lines.forEach((line) => {
  const [left, right] = line.split(":");
  const gameId = +left.split(" ")[1];
  const games = right.split(";");
  let isValid = true;
  for (let game of games) {
    const colors = game.split(",");
    for (let colorX of colors) {
      const [count, color] = colorX.trim().split(" ");
      if (
        (color == "red" && +count > red) ||
        (color == "green" && +count > green) ||
        (color == "blue" && +count > blue)
      ) {
        isValid = false;
        break;
      }
    }
    if (!isValid) break;
  }
  if (isValid) sum += gameId;
});

console.log(sum);

let sum2 = 0;
lines.forEach((line) => {
  const [_, right] = line.split(":");
  const games = right.split(";");
  let red = 0,
    blue = 0,
    green = 0;
  for (let game of games) {
    const colors = game.split(",");
    for (let colorX of colors) {
      const [count, color] = colorX.trim().split(" ");
      if (color == "red") {
        red = Math.max(red, +count);
      } else if (color == "green") {
        green = Math.max(green, +count);
      } else if (color == "blue") {
        blue = Math.max(blue, +count);
      }
    }
  }
  sum2 += red * green * blue;
});
console.log(sum2);
