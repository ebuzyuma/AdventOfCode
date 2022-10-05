var input = require("./input.js");

const orbitsToDictionary = (orbits) => {
  const out = {};
  orbits.forEach((orbit) => {
    const [left, right] = orbit;
    out[left] = out[left] || [];
    out[left].push(right);
  });

  return out;
};

const buildPaths = (orbitsDict, x, path = [], out = {}) => {
  out[x] = out[x] || [];
  out[x] = path;

  const directOrbits = orbitsDict[x];
  if (directOrbits) {
    directOrbits.forEach((orbit) => {
      buildPaths(orbitsDict, orbit, [...path, x], out);
    });
  }

  return out;
};

// Part 1
const dict = orbitsToDictionary(input.orbits);
const paths = buildPaths(dict, "COM");
const part1 = Object.keys(paths).reduce((total, curr) => total + paths[curr].length, 0);
console.log(part1);

// Part 2
const youPath = paths["YOU"];
const santaPath = paths["SAN"];
let commonNodesCount = 0;
while (youPath[commonNodesCount] == santaPath[commonNodesCount]) {
  commonNodesCount++;
}

const youToSantaLength = youPath.length - commonNodesCount + santaPath.length - commonNodesCount;
console.log(youToSantaLength);
