const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

function sum(input) {
  let powers = []; // 0, 5, 25, 125
  for (let i = 0; i < input.length; i++) {
    let number = input[i].split("").reverse();
    for (let p = 0; p < number.length; p++) {
      if (powers[p] == undefined) powers[p] = 0;
      let digit = number[p];
      if (digit === "=") {
        powers[p] -= 2;
      } else if (digit == "-") {
        powers[p] -= 1;
      } else {
        powers[p] += +digit;
      }
    }
  }

  let sum = 0;
  let m = 1;
  for (let i = 0; i < powers.length; i++) {
    sum += m * powers[i];
    m *= 5;
  }

  // reduce
  for (let i = 0; i < powers.length; i++) {
    if (Math.abs(powers[i]) <= 2) continue;

    let r = powers[i] % 5;
    let w = Math.floor(powers[i] / 5);
    if (Math.abs(r) <= 2) {
      // 0 1 2
      powers[i] = r;
      powers[i + 1] += w;
    } else {
      // 3 4
      powers[i] = r > 0 ? r - 5 : r + 5;
      powers[i + 1] += w + 1;
    }
  }

  // convert back
  let x = "";
  for (let p = 0; p < powers.length; p++) {
    let digit = powers[p];
    if (digit === -2) {
      x += "=";
    } else if (digit == -1) {
      x += "-";
    } else {
      x += digit;
    }
  }

  x = x.split("").reverse().join("");

  return x;
}

console.log(sum(example));

console.log(sum(lines));
