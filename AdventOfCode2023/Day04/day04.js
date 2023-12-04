const utils = require("../utils");
const lines = utils.readInput(__dirname);

// Part 1
let p1 = 0;
let cards = {};
for (let line of lines) {
  const [lineCardStr, numbers] = line.split(": ");
  const lineCard = +lineCardStr.split(" ").last();
  const [winStr, ownStr] = numbers.split(" | ");
  const winNumbers = winStr
    .split(" ")
    .filter((c) => !!c)
    .map((c) => +c);
  const ownNumbers = ownStr
    .split(" ")
    .filter((c) => !!c)
    .map((c) => +c.trim());
  const intersect = ownNumbers.filter((n) => winNumbers.includes(n));
  cards[lineCard] = {
    score: 0,
    matches: 0,
    count: 1,
  };
  if (intersect.length > 0) {
    cards[lineCard].matches = intersect.length;
  }
}
p1 = Object.values(cards)
  .filter((x) => x.matches > 0)
  .map((x) => Math.pow(2, x.matches - 1))
  .sum();
console.log(p1);

// Part 2
let p2 = 2;
for (const [card, value] of Object.entries(cards)) {
  for (let i = 1; i <= value.matches; i++) {
    const next = +card + i;
    if (cards[next]) cards[next].count += value.count;
  }
}
p2 = Object.values(cards)
  .map((x) => x.count)
  .sum();

console.log(p2);
