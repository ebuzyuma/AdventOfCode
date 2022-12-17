const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

const parseInput = (lines) => {
  let valves = {};
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(
      /Valve (?<v>[A-Z]+) has flow rate=(?<r>\d+); tunnels? leads? to valves? (?<n>[A-Z, ]+)/
    );
    let valve = {
      name: m.groups.v,
      next: m.groups.n.split(", "),
      rate: +m.groups.r,
      closed: true,
    };
    valves[valve.name] = valve;
  }

  return valves;
};

const pressurePerTick = (valves) =>
  Object.values(valves).reduce((r, v) => r + (v.closed ? 0 : v.rate), 0);

const findPressures = (valves, dist, path = ["AA"], minute = 0, pressure = 0) => {
  const maxMinutes = 30;
  if (minute > maxMinutes) {
    return pressure;
  }
  let current = path.last();
  let toOpen = Object.values(valves).filter(
    (v) => v.closed && v.rate > 0 && minute + getValue(dist, current, v.name) + 1 < maxMinutes
  );
  if (toOpen.length == 0) {
    let timeLeft = maxMinutes - minute;
    let add = timeLeft * pressurePerTick(valves);
    return pressure + add;
  }
  let pps = [];
  for (let next of toOpen) {
    let v = JSON.parse(JSON.stringify(valves));
    let m = minute;
    let p = pressure;
    // move
    let d = getValue(dist, current, next.name);
    m += d;
    p += d * pressurePerTick(v);

    // open
    m++;
    p += pressurePerTick(v);
    v[next.name].closed = false;
    let np = findPressures(v, dist, [...path, next.name], m, p);
    pps.push(np);
  }
  let max = Math.max(...pps);
  return max;
};

const setValue = (grid, x, y, value) => (grid[`${x},${y}`] = value);
const getValue = (grid, x, y, fallback = undefined) => grid[`${x},${y}`] || fallback;

const floydWarshallAlgorithm = (valvesArray) => {
  var dist = {};
  for (let v1 of valvesArray) {
    for (let v2 of valvesArray) {
      let value = Infinity;
      if (v1.name === v2.name) {
        value = 0;
        setValue(dist, v1.name, v2.name, 0);
      } else if (v1.next.includes(v2.name)) {
        value = 1;
      }
      setValue(dist, v1.name, v2.name, value);
    }
  }

  for (let k of valvesArray) {
    for (let i of valvesArray) {
      for (let j of valvesArray) {
        let alt = getValue(dist, i.name, k.name) + getValue(dist, k.name, j.name);
        if (getValue(dist, i.name, j.name) > alt) {
          setValue(dist, i.name, j.name, alt);
        }
      }
    }
  }

  return dist;
};

const findPressures2 = (
  valves,
  dist,
  path = ["AA"],
  toTarget = -1,
  ePath = ["AA"],
  eToTarget = -1,
  minute = -1,
  pressure = 0
) => {
  const maxMinutes = 26;
  if (minute > maxMinutes) {
    return pressure;
  }
  let current = path.last();
  let eCurrent = ePath.last();

  minute++;
  pressure += pressurePerTick(valves);

  if (toTarget > 0 && eToTarget > 0) {
    // move
    return findPressures2(valves, dist, path, toTarget - 1, ePath, eToTarget - 1, minute, pressure);
  }
  // open
  if (toTarget === 0) {
    valves[current].closed = false;
  }
  if (eToTarget === 0) {
    valves[eCurrent].closed = false;
  }

  // search new open target
  if (toTarget === 0 && eToTarget === 0) {
    let toOpen = Object.values(valves).filter(
      (v) => v.closed && v.rate > 0 && minute + getValue(dist, current, v.name) + 1 < maxMinutes
    );
    let eToOpen = Object.values(valves).filter(
      (v) => v.closed && v.rate > 0 && minute + getValue(dist, eCurrent, v.name) + 1 < maxMinutes
    );

    let pps = [];
    if (toOpen.length == 0 && eToOpen.length == 0) {
      let timeLeft = maxMinutes - minute;
      let add = timeLeft * pressurePerTick(valves);
      return pressure + add;
    } else if (eToOpen.length == 0) {
      for (let next of toOpen) {
        let v = JSON.parse(JSON.stringify(valves));
        let d = getValue(dist, current, next.name);
        let np = findPressures2(v, dist, [...path, next.name], d, ePath, -1, minute, pressure);
        pps.push(np);
      }
    } else if (toOpen.length == 0) {
      for (let next of eToOpen) {
        let v = JSON.parse(JSON.stringify(valves));
        let d = getValue(dist, eCurrent, next.name);
        let np = findPressures2(v, dist, path, -1, [...ePath, next.name], d, minute, pressure);
        pps.push(np);
      }
    } else {
      for (let next of toOpen) {
        for (let eNext of eToOpen) {
          if (next.name == eNext.name) {
            continue;
          }
          let v = JSON.parse(JSON.stringify(valves));
          let d = getValue(dist, current, next.name);
          let ed = getValue(dist, eCurrent, eNext.name);
          let np = findPressures2(
            v,
            dist,
            [...path, next.name],
            d,
            [...ePath, eNext.name],
            ed,
            minute,
            pressure
          );
          pps.push(np);
        }
      }
    }

    let max = Math.max(...pps);
    return max;
  } else if (toTarget === 0) {
    let toOpen = Object.values(valves).filter(
      (v) => v.closed && v.rate > 0 && minute + getValue(dist, current, v.name) + 1 < maxMinutes
    );
    if (toOpen.length == 0) {
      let timeLeft = maxMinutes - minute;
      let add = timeLeft * pressurePerTick(valves);
      return pressure + add;
    }
    let pps = []
    for (let next of toOpen) {
      let v = JSON.parse(JSON.stringify(valves));
      let d = getValue(dist, current, next.name);
      let np = findPressures2(
        v,
        dist,
        [...path, next.name],
        d,
        ePath,
        eToTarget - 1,
        minute,
        pressure
      );
      pps.push(np);
    }

    let max = Math.max(...pps);
    return max;
  } else if (eToTarget === 0) {
    let toOpen = Object.values(valves).filter(
      (v) => v.closed && v.rate > 0 && minute + getValue(dist, eCurrent, v.name) + 1 < maxMinutes
    );
    if (toOpen.length == 0) {
      let timeLeft = maxMinutes - minute;
      let add = timeLeft * pressurePerTick(valves);
      return pressure + add;
    }

    let pps = []

    for (let next of toOpen) {
      let v = JSON.parse(JSON.stringify(valves));
      let d = getValue(dist, eCurrent, next.name);
      let np = findPressures2(
        v,
        dist,
        path,
        toTarget - 1,
        [...ePath, next.name],
        d,
        minute,
        pressure
      );
      pps.push(np);
    }

    let max = Math.max(...pps);
    return max;
  } else {
    let toOpen = Object.values(valves).filter(
      (v) => v.closed && v.rate > 0 && minute + getValue(dist, current, v.name) + 1 < maxMinutes
    );
    let eToOpen = Object.values(valves).filter(
      (v) => v.closed && v.rate > 0 && minute + getValue(dist, eCurrent, v.name) + 1 < maxMinutes
    );

    let pps = [];
    for (let next of toOpen) {
      for (let eNext of eToOpen) {
        if (next.name == eNext.name) {
          continue;
        }
        let v = JSON.parse(JSON.stringify(valves));
        let d = getValue(dist, current, next.name);
        let ed = getValue(dist, eCurrent, eNext.name);
        let np = findPressures2(
          v,
          dist,
          [...path, next.name],
          d,
          [...ePath, eNext.name],
          ed,
          minute,
          pressure
        );
        pps.push(np);
      }
    }
    let max = Math.max(...pps);
    return max;
  }
};

let valves = parseInput(example);
console.log(findPressures2(valves, floydWarshallAlgorithm(Object.values(valves))));

valves = parseInput(lines);
console.log(findPressures2(valves, floydWarshallAlgorithm(Object.values(valves))));
