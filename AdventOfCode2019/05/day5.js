const input = [
  3, 225, 1, 225, 6, 6, 1100, 1, 238, 225, 104, 0, 1102, 40, 93, 224, 1001, 224, -3720, 224, 4, 224,
  102, 8, 223, 223, 101, 3, 224, 224, 1, 224, 223, 223, 1101, 56, 23, 225, 1102, 64, 78, 225, 1102,
  14, 11, 225, 1101, 84, 27, 225, 1101, 7, 82, 224, 1001, 224, -89, 224, 4, 224, 1002, 223, 8, 223,
  1001, 224, 1, 224, 1, 224, 223, 223, 1, 35, 47, 224, 1001, 224, -140, 224, 4, 224, 1002, 223, 8,
  223, 101, 5, 224, 224, 1, 224, 223, 223, 1101, 75, 90, 225, 101, 9, 122, 224, 101, -72, 224, 224,
  4, 224, 1002, 223, 8, 223, 101, 6, 224, 224, 1, 224, 223, 223, 1102, 36, 63, 225, 1002, 192, 29,
  224, 1001, 224, -1218, 224, 4, 224, 1002, 223, 8, 223, 1001, 224, 7, 224, 1, 223, 224, 223, 102,
  31, 218, 224, 101, -2046, 224, 224, 4, 224, 102, 8, 223, 223, 101, 4, 224, 224, 1, 224, 223, 223,
  1001, 43, 38, 224, 101, -52, 224, 224, 4, 224, 1002, 223, 8, 223, 101, 5, 224, 224, 1, 223, 224,
  223, 1102, 33, 42, 225, 2, 95, 40, 224, 101, -5850, 224, 224, 4, 224, 1002, 223, 8, 223, 1001,
  224, 7, 224, 1, 224, 223, 223, 1102, 37, 66, 225, 4, 223, 99, 0, 0, 0, 677, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1105, 0, 99999, 1105, 227, 247, 1105, 1, 99999, 1005, 227, 99999, 1005, 0, 256, 1105,
  1, 99999, 1106, 227, 99999, 1106, 0, 265, 1105, 1, 99999, 1006, 0, 99999, 1006, 227, 274, 1105, 1,
  99999, 1105, 1, 280, 1105, 1, 99999, 1, 225, 225, 225, 1101, 294, 0, 0, 105, 1, 0, 1105, 1, 99999,
  1106, 0, 300, 1105, 1, 99999, 1, 225, 225, 225, 1101, 314, 0, 0, 106, 0, 0, 1105, 1, 99999, 1007,
  226, 677, 224, 1002, 223, 2, 223, 1005, 224, 329, 1001, 223, 1, 223, 1007, 226, 226, 224, 1002,
  223, 2, 223, 1006, 224, 344, 101, 1, 223, 223, 1107, 677, 226, 224, 102, 2, 223, 223, 1006, 224,
  359, 1001, 223, 1, 223, 108, 677, 677, 224, 1002, 223, 2, 223, 1006, 224, 374, 1001, 223, 1, 223,
  107, 677, 677, 224, 1002, 223, 2, 223, 1005, 224, 389, 101, 1, 223, 223, 8, 677, 677, 224, 1002,
  223, 2, 223, 1005, 224, 404, 1001, 223, 1, 223, 108, 226, 226, 224, 1002, 223, 2, 223, 1005, 224,
  419, 101, 1, 223, 223, 1008, 677, 677, 224, 1002, 223, 2, 223, 1005, 224, 434, 101, 1, 223, 223,
  1008, 226, 226, 224, 1002, 223, 2, 223, 1005, 224, 449, 101, 1, 223, 223, 7, 677, 226, 224, 1002,
  223, 2, 223, 1006, 224, 464, 1001, 223, 1, 223, 7, 226, 226, 224, 1002, 223, 2, 223, 1005, 224,
  479, 1001, 223, 1, 223, 1007, 677, 677, 224, 102, 2, 223, 223, 1005, 224, 494, 101, 1, 223, 223,
  1108, 677, 226, 224, 102, 2, 223, 223, 1006, 224, 509, 1001, 223, 1, 223, 8, 677, 226, 224, 102,
  2, 223, 223, 1005, 224, 524, 1001, 223, 1, 223, 1107, 226, 226, 224, 102, 2, 223, 223, 1006, 224,
  539, 1001, 223, 1, 223, 1008, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 554, 1001, 223, 1, 223,
  1107, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 569, 1001, 223, 1, 223, 1108, 677, 677, 224,
  102, 2, 223, 223, 1005, 224, 584, 101, 1, 223, 223, 7, 226, 677, 224, 102, 2, 223, 223, 1006, 224,
  599, 1001, 223, 1, 223, 1108, 226, 677, 224, 102, 2, 223, 223, 1006, 224, 614, 101, 1, 223, 223,
  107, 226, 677, 224, 1002, 223, 2, 223, 1005, 224, 629, 101, 1, 223, 223, 108, 226, 677, 224, 1002,
  223, 2, 223, 1005, 224, 644, 101, 1, 223, 223, 8, 226, 677, 224, 1002, 223, 2, 223, 1005, 224,
  659, 1001, 223, 1, 223, 107, 226, 226, 224, 1002, 223, 2, 223, 1006, 224, 674, 101, 1, 223, 223,
  4, 223, 99, 226,
];

const execCommand = (input, arr, i, output) => {
  let code = arr[i];
  const p1mode = Math.floor(code / 100) % 10;
  const p2mode = Math.floor(code / 1000) % 10;
  code = code % 100;
  const p1 = p1mode == 1 ? arr[i + 1] : arr[arr[i + 1]];
  const p2 = p2mode == 1 ? arr[i + 2] : arr[arr[i + 2]];
  let outputPosition = arr[i + 3];
  switch (code) {
    case 1:
      arr[outputPosition] = p1 + p2;
      return i + 4;
    case 2:
      arr[outputPosition] = p1 * p2;
      return i + 4;
    case 3:
      outputPosition = arr[i + 1];
      arr[outputPosition] = input;
      return i + 2;
    case 4:
      output.push(p1);
      return i + 2;
    case 5:
      return p1 != 0 ? p2 : i + 3;
    case 6:
      return p1 == 0 ? p2 : i + 3;
    case 7:
      arr[outputPosition] = p1 < p2 ? 1 : 0;
      return i + 4;
    case 8:
      arr[outputPosition] = p1 == p2 ? 1 : 0;
      return i + 4;
    case 99:
      return 0;
    default:
      throw new Error("Unexpected code " + code);
  }
};

const execProgram = (input, arr) => {
  let output = [];
  let position = 0;
  do {
    position = execCommand(input, arr, position, output);
  } while (position);

  return output;
};

const prepInput = (arr) => {
  const copy = [...arr];
  return copy;
};

const part1input = prepInput(input);
const part1 = execProgram(1, part1input);
console.log(part1[part1.length - 1]);

const part2input = prepInput(input);
const part2 = execProgram(5, part2input);
console.log(part2[0]);