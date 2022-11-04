// <x=14, y=2, z=8>
// <x=7, y=4, z=10>
// <x=1, y=17, z=16>
// <x=-4, y=-1, z=1>
const planetsCords = [
  [14, 2, 8],
  [7, 4, 10],
  [1, 17, 16],
  [-4, -1, 1],
];

const planets = planetsCords.map((p) => ({ cords: p, velocity: [0, 0, 0] }));

const applyGravityAxis = (x1, x2) => (x1 > x2 ? -1 : x1 < x2 ? +1 : 0);

const applyGravity = (target, planets) => {
  const dv = planets.map((p) => target.cords.map((x, i) => applyGravityAxis(x, p.cords[i])));
  const newV = dv.reduce((sum, curr) => sum.map((s, i) => s + curr[i]), target.velocity);
  return {
    cords: target.cords,
    velocity: newV,
  };
};

const applyVelocity = (p) => ({
  cords: p.cords.map((x, i) => x + p.velocity[i]),
  velocity: p.velocity,
});

const step = (planets) => {
  return planets.map((p) => applyGravity(p, planets)).map((p) => applyVelocity(p));
};

const steps = (n, planets) => {
  for (i = 0; i < n; i++) {
    planets = step(planets);
  }
  return planets;
};

const energy = (planet) => {
  const pot = planet.cords.reduce((v, x) => v + Math.abs(x), 0);
  const kin = planet.velocity.reduce((v, x) => v + Math.abs(x), 0);
  return pot * kin;
};

const systemEnergy = (planets) => planets.reduce((v, p) => v + energy(p), 0);

const s1000 = steps(1000, planets);
const part1 = systemEnergy(s1000);
console.log(part1);

const isEqual = (s1, s2, axis) => {
  return s1.every((p, ip) => p.cords[axis] === s2[ip].cords[axis] && p.velocity[axis] === s1[ip].velocity[axis])
};

const stepsToSame = (planets, axis, cache) => {
  let i = 1;
  let sp = planets;
  do {
    if (i < cache.length) {
      sp = cache[i];
    } else {
      sp = step(sp);
      cache.push(sp);
    }
    i++;
  } while (!isEqual(planets, sp, axis));

  return i;
};

const gcd = (a, b) => {
  return !b ? a : gcd(b, a % b);
}

const lcm = (a, b) => {
  return (a * b) / gcd(a, b);
}

const fullCircle = (planets) => {
  const cache = [planets];
  const x = stepsToSame(planets, 0, cache);
  const y = stepsToSame(planets, 1, cache);
  const z = stepsToSame(planets, 2, cache);
  return lcm(x, lcm(y, z));
}

console.log(fullCircle(planets));
