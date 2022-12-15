const utils = require("../utils");
const lines = utils.readInput(__dirname);

let sensors = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(
    /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/
  );
  let s = {
    sx: +m.groups.sx,
    sy: +m.groups.sy,
    bx: +m.groups.bx,
    by: +m.groups.by,
  };
  s.mDistance = Math.abs(s.sx - s.bx) + Math.abs(s.sy - s.by);
  sensors.push(s);
}

const isClose = (x, y, s) => {
  const mDistance = Math.abs(s.sx - x) + Math.abs(s.sy - y);
  return mDistance <= s.mDistance;
};

const countClose = (y, sensors) => {
  let count = 0;
  let minX = Math.min(...sensors.map((s) => s.sx - s.mDistance));
  let maxX = Math.max(...sensors.map((s) => s.sx + s.mDistance));
  for (let x = minX; x <= maxX; x++) {
    let isBacon = sensors.some((s) => s.by == y && s.bx == x);
    let close = sensors.some((s) => isClose(x, y, s));
    if (!isBacon && close) {
      count++;
    }
  }

  return count;
};

const part1 = countClose(2000000, sensors);
console.log(part1);

// Part 2
const getTakenArea = (y, s) => {
  let d = s.mDistance - Math.abs(y - s.sy);
  return d < 0 ? undefined : [s.sx - d, s.sx + d];
};

const findDistress = (sensors) => {
  let max = 4000000;

  for (let y = 0; y <= max; y++) {
    let areas = sensors
      .map((s) => getTakenArea(y, s))
      .filter((x) => !!x)
      .sort((a, b) => a[0] - b[0]);
    let area = areas.reduce(
      ([xr1, xr2], [x1, x2]) => (x1 <= xr2 ? [xr1, Math.max(xr2, x2)] : [xr1, xr2]),
      areas[0]
    );
    if (area && area[1] < max) {
      return (area[1] + 1) * 4000000 + y;
    }
  }
};

const part2 = findDistress(sensors);
console.log(part2);
