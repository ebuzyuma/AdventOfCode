const input = require("./input.js");

const getAsteroids = (map) => {
  const asteroids = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "#") {
        asteroids.push([x, y]);
      }
    }
  }

  return asteroids;
};

const isParallel = (v1, v2) => v1[0] * v2[1] === v1[1] * v2[0];
const isSameDirection = (v1, v2) =>
  Math.sign(v1[0]) === Math.sign(v2[0]) && Math.sign(v1[1]) === Math.sign(v2[1]);

const diff = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];

const reduceDirectLineOfSight = (pos, asteroid, visible) => {
  const asteroidRelativeVector = diff(asteroid, pos);
  const onTheSameLine = visible.findIndex((v) => {
    const vector = diff(v, pos);
    return (
      isSameDirection(asteroidRelativeVector, vector) && isParallel(asteroidRelativeVector, vector)
    );
  });
  if (onTheSameLine < 0) {
    visible.push(asteroid);
  } else {
    const onLineAsteroid = visible[onTheSameLine];
    const onLineRelativeVector = diff(onLineAsteroid, pos);
    const k =
      asteroidRelativeVector[0] / onLineRelativeVector[0] ||
      asteroidRelativeVector[1] / onLineRelativeVector[1];
    const isCloser = k < 1;
    if (isCloser) {
      visible[onTheSameLine] = asteroid;
    }
  }
};

const visiblePoints = (asteroids, pos) => {
  const visible = [];
  asteroids.forEach((asteroid) => {
    if (asteroid == pos) {
      return;
    }
    reduceDirectLineOfSight(pos, asteroid, visible);
  });

  return visible;
};

// Part 1
const asteroids = getAsteroids(input.map);
const visible = asteroids.map((x) => visiblePoints(asteroids, x));

const max = visible.reduce(
  (p, c, i) => (p[1].length > c.length ? p : [asteroids[i], c]),
  [[0, 0], []]
);
console.log(max[0], max[1].length);

// Part 2
const dotProduct = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];
const vLength = (v1) => Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
const angle = (v1, v2) => Math.acos(dotProduct(v1, v2) / (vLength(v1) * vLength(v2)));
const angleFromUp = (v1) =>
  ((v1[0] >= 0 ? angle([0, -1], v1) : Math.PI + angle([0, 1], v1)) * 180) / Math.PI;

const laserPosition = max[0];
const laserAsteroids = [...max[1]];
laserAsteroids.sort((a, b) =>
  angleFromUp(diff(a, laserPosition)) > angleFromUp(diff(b, laserPosition)) ? 1 : -1
);
const n200 = laserAsteroids[199];
console.log(laserAsteroids.map(x => `(${x[0]},${x[1]})`).join(','));
console.log(n200[0] * 100 + n200[1]);
