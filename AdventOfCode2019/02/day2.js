const input = [
  1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 1, 10, 19, 1, 19, 6, 23, 2, 23, 13, 27, 1, 27,
  5, 31, 2, 31, 10, 35, 1, 9, 35, 39, 1, 39, 9, 43, 2, 9, 43, 47, 1, 5, 47, 51, 2, 13, 51, 55, 1,
  55, 9, 59, 2, 6, 59, 63, 1, 63, 5, 67, 1, 10, 67, 71, 1, 71, 10, 75, 2, 75, 13, 79, 2, 79, 13, 83,
  1, 5, 83, 87, 1, 87, 6, 91, 2, 91, 13, 95, 1, 5, 95, 99, 1, 99, 2, 103, 1, 103, 6, 0, 99, 2, 14,
  0, 0,
];

const execCommand = (arr, i) => {
  const code = arr[i];
  const outputPosition = arr[i + 3];
  const p1 = arr[arr[i + 1]];
  const p2 = arr[arr[i + 2]];
  switch (code) {
    case 1:
      arr[outputPosition] = p1 + p2;
      return true;
    case 2:
      arr[outputPosition] = p1 * p2;
      return true;
    case 99:
      return false;
    default:
      throw new Error("Unexpected code " + code);
  }
};

const execProgram = (arr) => {
  let position = 0;
  while (execCommand(arr, position)) {
    position += 4;
  }
};

const prepInput = (arr, p1, p2) => {
  const copy = [...arr];
  copy[1] = p1;
  copy[2] = p2;
  return copy;
};

const part1input = prepInput(input, 12, 2);
execProgram(part1input);
const part1 = part1input[0];
console.log(part1);

const findMatch = (input, expectedOutput) => {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      let part2input = prepInput(input, noun, verb);
      try {
        execProgram(part2input);
        if (part2input[0] == expectedOutput) {
          return 100 * noun + verb;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const part2 = findMatch(input, 19690720);
console.log(part2);
