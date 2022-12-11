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

const monkeySeeMonkeyDo = (monkeys, i) => {
  const monkey = monkeys[i];
  monkey.items.forEach((x) => {
    x = monkey.op(x);
    monkey.inspected++;
    x = Math.floor(x / 3);
    let next = monkey.next(x);
    monkeys[next].items.push(x);
  });
  monkey.items = [];
};

const monkeyBusiness = (monkeys) => {
  const inspected = monkeys.map((x) => x.inspected);
  const iSorted = inspected.sort((a, b) => a - b);
  return iSorted[iSorted.length - 1] * iSorted[iSorted.length - 2];
};

// Part 1
for (let i = 0; i < 20; i++) {
  for (let mi = 0; mi < monkeys.length; mi++) {
    monkeySeeMonkeyDo(monkeys, mi);
  }
}

console.log(monkeyBusiness(monkeys));

// Part 2
const reminders = [11, 7, 13, 5, 3, 17, 2, 19];

const toReminders = (x) => {
  let map = {};
  reminders.forEach((r) => (map[r] = x % r));
  return map;
};

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

const monkeySeeMonkeyDo2 = (monkeys, i) => {
  const monkey = monkeys[i];
  monkey.items.forEach((x) => {
    for (const [key, value] of Object.entries(x)) {
      x[key] = monkey.op(value) % key;
    }
    monkey.inspected++;
    let n = monkey.next(x);
    monkeys[n].items.push(x);
  });
  monkey.items = [];
};

for (let i = 0; i < 10000; i++) {
  for (let mi = 0; mi < monkeys2.length; mi++) {
    monkeySeeMonkeyDo2(monkeys2, mi);
  }
}

console.log(monkeyBusiness(monkeys2));
