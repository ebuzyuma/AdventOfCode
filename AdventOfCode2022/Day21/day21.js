const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

function parseInput(lines) {
  let monkeys = {};
  for (let i = 0; i < lines.length; i++) {
    let [k, v] = lines[i].split(": ");
    if (v.match(/\d+/)) {
      monkeys[k] = { value: +v };
    } else {
      let [left, operation, right] = v.split(" ");
      monkeys[k] = { left, operation, right };
    }
  }

  return monkeys;
}

function calculate(monkeys, name) {
  if (monkeys[name].value) {
    return monkeys[name].value;
  }

  let left = calculate(monkeys, monkeys[name].left);
  let right = calculate(monkeys, monkeys[name].right);
  switch (monkeys[name].operation) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "=":
      return [left, right];
  }
}

const ex = parseInput(example);
const input = parseInput(lines);
console.log(calculate(input, "root"));

input["root"].operation = "=";
function search(monkeys, left, right) {
  let x = Math.ceil(left + (right - left) / 2);
  monkeys["humn"].value = x;
  r = calculate(monkeys, "root");
  // console.log(r[0] - r[1], r[0] > r[1]);
  if (r[0] == [r[1]]) {
    return x;
  }
  if (r[0] > r[1]) {
    return search(monkeys, x, right);
  } else {
    return search(monkeys, left, x);
  }
}
console.log(search(input, 0, 11197517593724));
