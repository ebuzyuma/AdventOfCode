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

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

const tileTypes = {
  0: " ",
  1: "|",
  2: "#", // block
  3: "-", // joystick
  4: "*", // ball
};

const printTiles = (tiles) => {
  const map = [];
  tiles.forEach(([x, y, type]) => {
    map[y] = map[y] || [];
    map[y][x] = tileTypes[type];
  });

  let ball = 0;
  let joystick = 0;
  let str = "";
  for (let j = 0; j < map.length; j++) {
    const row = map[j];
    let rowStr = "";
    for (let i = 0; i < row.length; i++) {
      const element = row[i];
      rowStr += element || " ";
      if (element === tileTypes[4]) ball = i;
      else if (element === tileTypes[3]) joystick = i;
    }
    str += rowStr + "\n";
  }

  console.log(str);
  return [ball, joystick];
};

const draw = (program) => {
  [pos, relativeBase, output] = execProgram([], program);

  const tiles = [...chunks(output, 3)];
  return tiles;
};

const tiles = draw([...input.intCode]);
const part1 = tiles.filter((x) => x[2] === 2).length;
console.log(part1);

printTiles(tiles);

const play = (program) => {
  program[0] = 2;
  let ballOffset = 0;
  let joystickOffset = 0;
  let score = 0;
  [pos, relativeBase, output] = execProgram([], program);
  for (let i = 0; i < 10000; i++) {
    const direction = Math.sign(ballOffset - joystickOffset);
    [pos, relativeBase, output] = execProgram([direction], program);

    console.clear();
    const tiles = [...chunks(output, 3)];
    [ballOffset, joystickOffset] = printTiles(tiles);
    
    const scoreTile = tiles.find(([x, y, score]) => x === -1 && y === 0);
    score = scoreTile[2];
    console.log(i, score);
    
    if (pos === -1 && i < 9999) {
      // No more blocks left
      i = 9998;
    }
  }

  return score;
};

const part2 = play([...input.intCode]);
console.log(part2);
