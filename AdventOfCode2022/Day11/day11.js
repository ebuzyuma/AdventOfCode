const utils = require("../utils");
const reminders = [11, 7, 13, 5, 3, 17, 2, 19];

const toReminders = (x) => {
  let map = {};
  reminders.forEach((r) => (map[r] = x % r));
  return map;
};

const monkeys = [
  {
    items: [57],
    op: (x) => x * 13,
    next: (x) => (x % 11 === 0 ? 3 : 2),
    inspected: 0,
  },
  {
    items: [58, 93, 88, 81, 72, 73, 65],
    op: (x) => x + 2,
    next: (x) => (x % 7 === 0 ? 6 : 7),
    inspected: 0,
  },
  {
    items: [65, 95],
    op: (x) => x + 6,
    next: (x) => (x % 13 === 0 ? 3 : 5),
    inspected: 0,
  },
  {
    items: [58, 80, 81, 83],
    op: (x) => x * x,
    next: (x) => (x % 5 === 0 ? 4 : 5),
    inspected: 0,
  },
  {
    items: [58, 89, 90, 96, 55],
    op: (x) => x + 3,
    next: (x) => (x % 3 === 0 ? 1 : 7),
    inspected: 0,
  },
  {
    items: [66, 73, 87, 58, 62, 67],
    op: (x) => x * 7,
    next: (x) => (x % 17 === 0 ? 4 : 1),
    inspected: 0,
  },
  {
    items: [85, 55, 89],
    op: (x) => x + 4,
    next: (x) => (x % 2 === 0 ? 2 : 0),
    inspected: 0,
  },
  {
    items: [73, 80, 54, 94, 90, 52, 69, 58],
    op: (x) => x + 7,
    next: (x) => (x % 19 === 0 ? 6 : 0),
    inspected: 0,
  },
];

const monkeys2 = [
  {
    items: [57].map(toReminders),
    op: (x) => x * 13,
    next: (x) => (x[11] === 0 ? 3 : 2),
    inspected: 0,
  },
  {
    items: [58, 93, 88, 81, 72, 73, 65].map(toReminders),
    op: (x) => x + 2,
    next: (x) => (x[7] === 0 ? 6 : 7),
    inspected: 0,
  },
  {
    items: [65, 95].map(toReminders),
    op: (x) => x + 6,
    next: (x) => (x[13] === 0 ? 3 : 5),
    inspected: 0,
  },
  {
    items: [58, 80, 81, 83].map(toReminders),
    op: (x) => x * x,
    next: (x) => (x[5] === 0 ? 4 : 5),
    inspected: 0,
  },
  {
    items: [58, 89, 90, 96, 55].map(toReminders),
    op: (x) => x + 3,
    next: (x) => (x[3] === 0 ? 1 : 7),
    inspected: 0,
  },
  {
    items: [66, 73, 87, 58, 62, 67].map(toReminders),
    op: (x) => x * 7,
    next: (x) => (x[17] === 0 ? 4 : 1),
    inspected: 0,
  },
  {
    items: [85, 55, 89].map(toReminders),
    op: (x) => x + 4,
    next: (x) => (x[2] === 0 ? 2 : 0),
    inspected: 0,
  },
  {
    items: [73, 80, 54, 94, 90, 52, 69, 58].map(toReminders),
    op: (x) => x + 7,
    next: (x) => (x[19] === 0 ? 6 : 0),
    inspected: 0,
  },
];

const doMonkey = (mm, i) => {
  const m = mm[i];
  m.items.forEach((x) => {
    for (const [key, value] of Object.entries(x)) {
      x[key] = m.op(value) % key;
    }

    m.inspected++;
    //x = Math.floor(x / 3);
    let n = m.next(x);
    mm[n].items.push(x);
  });
  m.items = [];
};

for (let i = 0; i < 10000; i++) {
  for (let mi = 0; mi < monkeys.length; mi++) {
    doMonkey(monkeys2, mi);
  }
}
const b = monkeys2.map((x) => x.inspected);
const c = b.sort((a, b) => a - b);
console.log(c);
console.log(c[7] * c[6]);
