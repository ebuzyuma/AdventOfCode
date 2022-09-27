var input = require("./input.js");

const directionToVectorMap = {
  L: [-1, 0],
  R: [1, 0],
  U: [0, 1],
  D: [0, -1],
};

const grid = {
  values: {}, // x,y => {pathName: delay}
  intersections: [],
  draw: function (name, path) {
    let [x, y] = [0, 0];
    let delay = 1;
    path.forEach(([direction, amount]) => {
      const [dx, dy] = directionToVectorMap[direction];
      for (let i = 1; i <= amount; i++, delay++) {
        [x, y] = [x + dx, y + dy];
        const key = `${x},${y}`;
        const currentCell = (this.values[key] = this.values[key] || {});
        if (currentCell[name]) {
          continue;
        }

        if (Object.keys(currentCell).length > 0) {
          this.intersections.push([x, y]);
        }

        currentCell[name] = delay;
      }
    });
  },
  closestIntersection: function (distanceFunc) {
    const distances = grid.intersections.map(distanceFunc);
    const min = Math.min.apply(null, distances);
    return min;
  },
};

grid.draw(0, input.wire1);
grid.draw(1, input.wire2);

const manhattanDistance = ([x, y]) => Math.abs(x) + Math.abs(y);
const part1 = grid.closestIntersection(manhattanDistance);
console.log(part1);

const getTiming = (pos) => {
  const cell = grid.values[pos.toString()];
  return cell[0] + cell[1];
};
const part2 = grid.closestIntersection(getTiming);
console.log(part2);
