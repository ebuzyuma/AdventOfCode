const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

const setValue = (grid, x, y, value) => (grid[`${x},${y}`] = value);
const getValue = (grid, x, y, fallback = undefined) => grid[`${x},${y}`] || fallback;
const print = (grid, unit) => {
  let yMax = Math.max(...unit.map((p) => p.y));
  let str = "";
  for (let y = yMax; y >= 0; y--) {
    str += "|";
    for (let x = 0; x < 7; x++) {
      let p = unit.find((v) => v.x === x && v.y === y);
      let g = getValue(grid, x, y, " ");
      if (p) {
        str += "@";
        if (g === "#") {
          console.log("Overlap with unit.");
        }
      } else {
        str += g;
      }
    }
    str += "|\n";
  }
  str += "+-------+\n";
  console.log(str);
};

const gridToString = (grid, yMax) => {
  let str = [];
  for (let y = 0; y <= yMax; y++) {
    let line = "|";
    for (let x = 0; x < wide; x++) {
      line += getValue(grid, x, y, " ");
    }
    line += "|";
    str.push(line);
  }

  return str;
};

const units = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
];

const wide = 7;
const leftInit = 2;
const bottomInit = 3;

const move = (grid, unit, yFloor, dx, dy) => {
  let reachFloor = false;
  for (let p of unit) {
    p.x += dx;
    p.y += dy;
    reachFloor = reachFloor || p.y === yFloor;
  }

  if (reachFloor || isIntersect(grid, unit)) {
    for (let p of unit) {
      p.x -= dx;
      p.y -= dy;
    }

    return false;
  }

  return true;
};

const maxY = (grid) => {
  let ys = Object.keys(grid).map((s) => +s.split(",")[1]);
  let max = Math.max(...ys);
  return max;
};

const toKey = (p) => `${p.x},${p.y}`;

const isIntersect = (grid, unit) => {
  return unit.some((p) => grid.has(toKey(p)));
};

const push = (grid, unit, dx) => {
  let left = Math.min(...unit.map((u) => u.x));
  let right = Math.max(...unit.map((u) => u.x));
  if ((left === 0 && dx === -1) || (right === wide - 1 && dx === +1)) {
    return;
  }

  move(grid, unit, yFloor, dx, 0);
};

const isBlocked = (maxPerX, unit) => {
  return unit.some((p) => maxPerX.includes(p.y));
};

const fall = (grid, jets, n, template) => {
  let yFloor = -1;
  let reducedGrid = new Set();
  let maxHeight = 0;
  let iUnit = 0;
  let iJet = 0;
  let jetsDx = jets.split("").map((x) => (x === ">" ? 1 : -1));
  for (let i = 1; i <= n; i++) {
    if (i % 1000000 === 0) {
      console.log(new Date(), i, maxHeight, yFloor, reducedGrid.size);
    }
    let unitBottomInit = maxHeight + bottomInit;
    let unit = units[iUnit].map((p) => ({ x: p.x + leftInit, y: p.y + unitBottomInit }));
    let left = leftInit;
    let right = unit.last().x; // unit is sorted by x
    // print(grid, unit);

    let comeToRest = false;
    // print(grid, unit);
    while (!comeToRest) {
      // left right
      let dx = jetsDx[iJet];
      let newUnit = unit.map((p) => ({ x: p.x + dx, y: p.y }));
      if (
        !(left === 0 && dx === -1) &&
        !(right === wide - 1 && dx === +1) &&
        !isIntersect(reducedGrid, newUnit)
      ) {
        unit = newUnit;
        left += dx;
        right += dx;
      }
      iJet = (iJet + 1) % jets.length;
      // print(grid, unit);

      // down
      let reachFloor = unit.some((p) => p.y - 1 === yFloor);
      newUnit = unit.map((p) => ({ x: p.x, y: p.y - 1 }));
      if (reachFloor || isIntersect(reducedGrid, newUnit)) {
        comeToRest = true;
      } else {
        unit = newUnit;
      }

      // print(grid, unit);
    }

    unit.forEach((p) => setValue(grid, p.x, p.y, "#"));
    
    // set items for template
    if (
      template &&
      unit.some((p) => p.y >= template.start && p.y <= template.start + template.height)
    ) {
      template.items++;
      template.beforeStart = template.beforeStart || i;
    }

    iUnit = (iUnit + 1) % units.length;
    maxHeight = Math.max(maxHeight, ...unit.map((p) => p.y + 1));

    unit.forEach((p) => reducedGrid.add(toKey(p)));
    for (let p of unit) {
      if ([...Array(wide)].every((v, i) => reducedGrid.has(`${i},${p.y}`))) {
        yFloor = p.y;
        let newG = [...reducedGrid.values()].filter((k) => +k.split(",")[1] > yFloor);
        reducedGrid = new Set(newG);
        break;
      }
    }
  }

  return maxHeight;
};

const findTemplate = (grid, maxHeight) => {
  let templateStart = 0;
  let templateHeight = 0;
  let str = gridToString(grid, maxHeight);
  for (let y1 = templateStart; y1 < maxHeight; y1++) {
    for (let y2 = y1 + 10; y2 < maxHeight; y2++) {
      templateHeight = 0;
      while (y1 + templateHeight != y2 && str[y1 + templateHeight] === str[y2 + templateHeight]) {
        templateHeight++;
      }
      if (y2 - y1 == templateHeight) {
        for (let i = 0; i < templateHeight; i++) {
          if (str[y1 + i] != str[y2 + templateHeight + i]) {
            console.log("tt");
          }
        }
        return [y1, templateHeight, str.slice(templateStart, templateStart + templateHeight - 1)];
      }
    }
  }
};

const fallWithTemplate = (jets, n) => {
  let grid = {};
  let maxHeight = fall(grid, jets, 10000);
  let template = { items: 0 };
  [template.start, template.height, template.grid] = findTemplate(grid, maxHeight);

  fall({}, jets, 2022, template);
  template.items = template.items - (template.items % units.length);
  let cycles = Math.ceil((n - template.beforeStart - template.items) / template.items);
  let smallN = n - cycles * template.items;
  maxHeight = fall({}, jets, smallN);

  return maxHeight + cycles * template.height;
};

console.log(fall({}, example[0], 2022));
console.log(fall({}, lines[0], 2022));

console.log(fallWithTemplate(example[0], 2022));
console.log(fallWithTemplate(lines[0], 2022));

console.log(fallWithTemplate(example[0], 1000000000000));
console.log(fallWithTemplate(lines[0], 1000000000000));
