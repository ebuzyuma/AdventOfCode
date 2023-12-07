const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");
const input = puzzleInput;

let hands = input
  .map((x) => x.split(" "))
  .map((s) => ({ cards: s[0], bid: +s[1], kind: findKind(s[0]), kind2: findKind2(s[0]) }));

// Part 1
function findKind(card) {
  let counts = {};
  for (let i = 0; i < card.length; i++) {
    let char = card[i];
    counts[char] ??= 0;
    counts[char]++;
  }

  let values = Object.values(counts).numSort().reverse();
  if (values.includes(5)) return 6;
  if (values.includes(4)) return 5;
  if (values[0] === 3 && values[1] === 2) return 4;
  if (values.includes(3)) return 3;
  if (values[0] === 2 && values[1] === 2) return 2;
  if (values[0] === 2) return 1;
  return 0;
}

let cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

function cardRank(card) {
  return cards.indexOf(card);
}

function compareHands(a, b) {
  if (a.kind !== b.kind) {
    return a.kind - b.kind;
  }

  let i = 0;
  while (a.cards[i] === b.cards[i]) i++;

  return cardRank(b.cards[i]) - cardRank(a.cards[i]);
}

let sorted = hands.sort(compareHands);
for (let hand of hands) {
  hand.rank = sorted.indexOf(hand) + 1;
}

let p1 = sorted.map((x) => x.bid * x.rank).sum();
console.log(p1);

// Part 2
function countsToRank(values) {
  if (values.includes(5)) return 6;
  if (values.includes(4)) return 5;
  if (values[0] === 3 && values[1] === 2) return 4;
  if (values.includes(3)) return 3;
  if (values[0] === 2 && values[1] === 2) return 2;
  if (values[0] === 2) return 1;
  return 0;
}
function findKind2(card) {
  let counts = {};
  let jokers = 0;
  for (let i = 0; i < card.length; i++) {
    let char = card[i];
    if (char === "J") {
      jokers++;
      continue;
    }
    counts[char] ??= 0;
    counts[char]++;
  }

  let values = Object.values(counts).numSort().reverse();
  if (jokers === 5) {
    values = [5];
  } else {
    values[0] += jokers;
  }
  let rank = countsToRank(values);
  return rank;
}

let cards2 = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];

function cardRank2(card) {
  return cards2.indexOf(card);
}

function compareHands2(a, b) {
  if (a.kind2 !== b.kind2) {
    return a.kind2 - b.kind2;
  }

  let i = 0;
  while (a.cards[i] === b.cards[i]) i++;

  return cardRank2(b.cards[i]) - cardRank2(a.cards[i]);
}

let sorted2 = hands.sort(compareHands2);
for (let hand of hands) {
  hand.rank2 = sorted2.indexOf(hand) + 1;
}
console.log(sorted2);
let p2 = sorted2.map((x) => x.bid * x.rank2).sum();
console.log(p2);
