const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

function parseInput(lines) {
  let numbers = [];
  for (let i = 0; i < lines.length; i++) {
    numbers.push(+lines[i]);
  }

  return numbers;
}

function solve(initialNumbers, iteration = 1) {
  let positions = [...Array(initialNumbers.length)].map((_, i) => i);
  const numbers = initialNumbers.map((x) => x);
  for (let mix = 1; mix <= iteration; mix++) {
    for (let i = 0; i < positions.length; i++) {
      let position = positions[i];
      let value = numbers[i];
      if (value === 0) continue;
      let newPosition = position + value;
      if (newPosition >= numbers.length) {
        newPosition = newPosition % (numbers.length - 1);
      }
      if (newPosition <= 0) {
        let whole = Math.ceil(Math.abs(newPosition) / (numbers.length - 1));
        newPosition += (numbers.length - 1) * whole;
        if (newPosition === 0) newPosition += numbers.length - 1;
      }

      let [left, right] = [position, newPosition];
      let di = -1;
      if (newPosition < position) {
        di = 1;
        [left, right] = [newPosition, position];
      }
      for (let j = 0; j < numbers.length; j++) {
        if (positions[j] >= left && positions[j] <= right) {
          positions[j] += di;
        }
      }
      positions[i] = newPosition;

      // if (newPosition - position)
      // console.log(`${value}: ${position} => ${newPosition}: ${newPosition - position}`);
      // let result = positions.reduce((r, v, i) => { r[v] = numbers[i]; return r; }, []);
      // console.log(result);
    }

    let result = positions.reduce((r, v, i) => {
      r[v] = initialNumbers[i];
      return r;
    }, []);
    console.log(result);
  }
  let sum = 0;
  let groveCoordinates = [1000, 2000, 3000];
  let zeroIndex = initialNumbers.findIndex((v) => v === 0);
  let zeroPosition = positions[zeroIndex];
  for (let g of groveCoordinates) {
    let index = positions.findIndex((v) => v === (zeroPosition + g) % positions.length);
    sum += initialNumbers[index];
  }
  return sum;
}

console.log(solve(parseInput(example)));
console.log(solve(parseInput(lines)));

const ex2 = parseInput(example).map((x) => x * 811589153);
console.log(solve(ex2, 10));

const in2 = parseInput(lines).map((x) => x * 811589153);
console.log(solve(in2, 10));
