const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");
const input = puzzleInput;

let cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"].reverse();

let hands = input.map((x) => x.split(" ")).map((s) => ({ cards: s[0], bid: +s[1] }));

// Part 1
function countsToRank(values) {
  if (values[0] === 5) return 6;
  if (values[0] === 4) return 5;
  if (values[0] === 3 && values[1] === 2) return 4;
  if (values[0] === 3) return 3;
  if (values[0] === 2 && values[1] === 2) return 2;
  if (values[0] === 2) return 1;
  return 0;
}
function getType(hand) {
  let counts = {};
  for (let card of hand) {
    counts[card] = (counts[card] || 0) + 1;
  }

  let values = Object.values(counts).numSort().reverse();
  let rank = countsToRank(values);
  return rank;
}

function cardRank(card, cards) {
  return cards.indexOf(card);
}

function compareHands(a, b, cards) {
  if (a.type !== b.type) {
    return a.type - b.type;
  }

  let i = 0;
  while (a.cards[i] === b.cards[i]) i++;

  return cardRank(a.cards[i], cards) - cardRank(b.cards[i], cards);
}

function getScore(hands, cards) {
  let sorted = hands.sort((a, b) => compareHands(a, b, cards));
  return sorted.map((x, i) => x.bid * (i + 1)).sum();
}

let p1Hands = hands.map((h) => ({ ...h, type: getType(h.cards) }));
let p1 = getScore(p1Hands, cards);
console.log(p1);

// Part 2
function getType2(hand) {
  let counts = {};
  let jokers = 0;
  for (let card of hand) {
    if (card === "J") {
      jokers++;
      continue;
    }
    counts[card] = (counts[card] || 0) + 1;
  }

  let values = Object.values(counts).numSort().reverse();
  if (jokers === 5) {
    values = [5];
  } else {
    // Add jokers to the maximum
    values[0] += jokers;
  }
  let rank = countsToRank(values);
  return rank;
}

let cards2 = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"].reverse();
let p2Hands = hands.map((h) => ({ ...h, type: getType2(h.cards) }));
let p2 = getScore(p2Hands, cards2);
console.log(p2);
