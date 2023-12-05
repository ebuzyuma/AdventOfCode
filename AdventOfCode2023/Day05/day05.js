const utils = require("../utils");
const lines = utils.readInput(__dirname);

// Part 1
const seeds = lines[0]
  .split(": ")[1]
  .split(" ")
  .map((x) => +x);

const groups = lines.splitBy("");
const maps = {};
for (let group of groups) {
  const [source, , target] = group[0].split(" ")[0].split("-");
  maps[source] = {
    target: target,
  };
  const map = group.slice(1).map((x) => x.split(" ").map((n) => +n));
  maps[source].map = map;
}

function mapToLocation(seed) {
  const result = {};
  let source = "seed";
  result[source] = seed;
  let sourceValue = seed;
  do {
    let targetValue;
    const map = maps[source];
    for (let [destinationStart, sourceStart, rangeLength] of map.map) {
      const diff = sourceValue - sourceStart;
      if (diff >= 0 && diff < rangeLength) {
        targetValue = destinationStart + diff;
        break;
      }
    }
    if (targetValue === undefined) {
      targetValue = sourceValue;
    }

    result[map.target] = targetValue;

    source = map.target;
    sourceValue = targetValue;
  } while (source !== "location");

  return result;
}

const locations = seeds.map((s) => mapToLocation(s));
const p1 = Math.min(...locations.map((x) => x.location));
console.log(p1);

// Part 2
function mapRange(source, valueFrom, valueTo) {
  const map = maps[source];
  const result = [];
  const mapsToUse = map.map
    .filter(
      ([destinationStart, sourceStart, rangeLength]) =>
        (valueFrom >= sourceStart && valueFrom < sourceStart + rangeLength) ||
        (sourceStart >= valueFrom && sourceStart + rangeLength < valueTo) ||
        (valueTo >= sourceStart && valueTo < sourceStart + rangeLength)
    )
    .orderBy((x) => x[1]); // order by source
  let from = valueFrom;
  let to = valueTo;
  for (let [destinationStart, sourceStart, rangeLength] of mapsToUse) {
    if (from < sourceStart) {
      result.push([from, sourceStart - 1]);
      from = sourceStart;
    }
    let startShift = from - sourceStart;
    if (to < sourceStart + rangeLength) {
      const length = to - from;
      result.push([destinationStart + startShift, destinationStart + startShift + length]);
      from = to;
    } else {
      result.push([destinationStart + startShift, destinationStart + rangeLength - 1]);
      from = sourceStart + rangeLength;
    }
  }
  if (from !== to) {
    result.push([from, to]);
  }
  return result;
}

function mapToLocation2(from, length) {
  let source = "seed";
  let ranges = [[from, from + length - 1]];
  do {
    const map = maps[source];
    let newRanges = [];
    for (let range of ranges) {
      let result = mapRange(source, range[0], range[1]);
      newRanges = [...newRanges, ...result];
    }

    ranges = newRanges;
    source = map.target;
  } while (source !== "location");

  return ranges;
}

let min = Number.MAX_SAFE_INTEGER;
for (let i = 0; i < seeds.length; i += 2) {
  const ranges = mapToLocation2(seeds[i], seeds[i + 1]);
  min = Math.min(min, ...ranges.flat());
}
console.log(min);
