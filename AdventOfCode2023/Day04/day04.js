const utils = require("../utils");
const lines = utils.readInput(__dirname);

// Part 1
let cards = {};
const lineRegex = /^Card +(?<cardNumber>\d+): +(?<winStr>[\d ]+) \| (?<ownStr>[\d ]+)$/;
for (let line of lines) {
  const match = lineRegex.exec(line);
  const { cardNumber, winStr, ownStr } = match.groups;
  const winNumbers = winStr.split(/ +/).map((c) => +c);
  const ownNumbers = ownStr.split(/ +/).map((c) => +c);
  const intersect = ownNumbers.filter((n) => winNumbers.includes(n));
  cards[cardNumber] = {
    matches: intersect.length,
    count: 1,
  };
}
const totalScore = Object.values(cards)
  .filter((x) => x.matches > 0)
  .map((x) => Math.pow(2, x.matches - 1))
  .sum();
console.log(totalScore);

// Part 2
for (const [card, value] of Object.entries(cards)) {
  for (let i = 1; i <= value.matches; i++) {
    const next = +card + i;
    cards[next].count += value.count;
  }
}
let totalCards = Object.values(cards)
  .map((x) => x.count)
  .sum();

console.log(totalCards);
