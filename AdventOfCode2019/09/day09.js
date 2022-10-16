var input = require("./input.js");

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

const execProgram = (input, arr, startingPosition = 0) => {
  let output = [];
  let prevPosition;
  let currentPosition = startingPosition;
  let relativeBase = 0;
  const exitIndicator = -1;
  do {
    prevPosition = currentPosition;
    previousBase = relativeBase;
    [currentPosition, relativeBase] = execCommand(input, arr, prevPosition, output, relativeBase);
  } while (currentPosition != exitIndicator && prevPosition != currentPosition);

  return [currentPosition, output];
};

const copy = (arr) => {
  const copy = [...arr];
  return copy;
};

const [_, part1] = execProgram([1], input.program);
console.log(part1);

const [__, part2] = execProgram([2], input.program);
console.log(part2);
