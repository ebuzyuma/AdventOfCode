const input = require("./input");

const execCommand = (input, arr, i, output, relativeBase) => {
  let code = arr[i];
  const p1mode = Math.floor(code / 100) % 10;
  const p2mode = Math.floor(code / 1000) % 10;
  const p3mode = Math.floor(code / 10000) % 10;
  code = code % 100;
  const [a1, a2, a3] = [arr[i + 1] || 0, arr[i + 2] || 0, arr[i + 3] || 0];
  const p1 = p1mode == 1 ? a1 : p1mode == 2 ? arr[relativeBase + a1] || 0 : arr[a1] || 0;
  const p2 = p2mode == 1 ? a2 : p2mode == 2 ? arr[relativeBase + a2] || 0 : arr[a2] || 0;
  let outputPosition = p3mode == 2 ? relativeBase + a3 : a3;
  switch (code) {
    case 1:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 + p2;
      return [i + 4, relativeBase];
    case 2:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 * p2;
      return [i + 4, relativeBase];
    case 3:
      // console.log(i, arr[i], arr[i + 1], input.toString());
      outputPosition = p1mode == 2 ? relativeBase + a1 : a1;
      if (input.length == 0) {
        return [i, relativeBase]; // wait for input
      }
      arr[outputPosition] = input[0];
      input.splice(0, 1);
      return [i + 2, relativeBase];
    case 4:
      // console.log(i, arr[i], p1);
      output.push(p1);
      return [i + 2, relativeBase];
    case 5:
      // console.log(i, arr[i], p1, p2);
      return [p1 != 0 ? p2 : i + 3, relativeBase];
    case 6:
      // console.log(i, arr[i], p1, p2);
      return [p1 == 0 ? p2 : i + 3, relativeBase];
    case 7:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 < p2 ? 1 : 0;
      return [i + 4, relativeBase];
    case 8:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 == p2 ? 1 : 0;
      return [i + 4, relativeBase];
    case 9:
      return [i + 2, relativeBase + p1];
    case 99:
      // console.log(i, arr[i]);
      return [-1, 0];
    default:
      throw new Error("Unexpected code " + code);
  }
};

const execProgram = (input, arr, startingPosition = 0, relativeBase = 0) => {
  let output = [];
  let prevPosition;
  let currentPosition = startingPosition;
  const exitIndicator = -1;
  do {
    prevPosition = currentPosition;
    previousBase = relativeBase;
    [currentPosition, relativeBase] = execCommand(input, arr, prevPosition, output, relativeBase);
  } while (currentPosition != exitIndicator && prevPosition != currentPosition);

  return [currentPosition, relativeBase, output];
};

const robot = () => ({
  drawn: {}, // key => black/white
  direction: [0, 1],
  position: [0, 0],
});

const directionChar = { "0,1": "^", "1,0": ">", "0,-1": "v", "-1,0": "<" };

const drawMap = (robot) => {
  const keys = Object.keys(robot.drawn).map((s) => s.split(","));
  const xMin = keys.map((x) => +x[0]).reduce((p, c) => (c < p ? c : p), -10);
  const xMax = keys.map((x) => +x[0]).reduce((p, c) => (c > p ? c : p), 10);
  const yMin = keys.map((x) => +x[1]).reduce((p, c) => (c < p ? c : p), -10);
  const yMax = keys.map((x) => +x[1]).reduce((p, c) => (c > p ? c : p), 10);
  let sign = "";
  for (let y = yMax; y >= yMin; y--) {
    for (let x = xMin; x <= xMax; x++) {
      if (robot.position[0] === x && robot.position[1] === y) {
        sign += directionChar[robot.direction];
      } else {
        sign += robot.drawn[toKey([x, y])] === "white" ? "#" : " ";
      }
    }
    sign += "\r\n";
  }

  console.log(sign);
};

const toKey = ([x, y]) => `${x},${y}`;

const draw = (robot, isWhite) => {
  robot.drawn[toKey(robot.position)] = isWhite ? "white" : "black";
};

// [0, 1] => [1, 0] => [0, -1] => [-1, 0]
const move = (robot, isRight) => {
  [rx, ry] = robot.position;
  [dx, dy] = robot.direction;
  [dx, dy] = isRight ? [dy, -1 * dx] : [-1 * dy, dx];
  robot.direction = [dx, dy];
  robot.position = [rx + dx, ry + dy];
};

const drawOne = (robot, program, pos, relativeBase) => {
  const currentColor = robot.drawn[toKey(robot.position)] === "white" ? 1 : 0;
  [pos, relativeBase,  output] = execProgram([currentColor], program, pos, relativeBase);
  draw(robot, output[0] === 1);
  move(robot, output[1] === 1);
  return [pos, relativeBase];
};

const drawAll = (robot, program) => {
  let pos = 0;
  let relativeBase = 0;
  while (pos != -1) {
    [pos, relativeBase] = drawOne(robot, program, pos, relativeBase);
  }
};

const r1 = robot();
drawAll(r1, [...input.intCode]);
const part1 = Object.keys(r1.drawn).length;

console.log(part1);

const r2 = robot();
r2.drawn[toKey([0, 0])] = "white";
drawAll(r2, [...input.intCode]);

drawMap(r1);
drawMap(r2);
