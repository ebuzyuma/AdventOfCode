var input = require("./input.js");

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
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 + p2;
      return i + 4;
    case 2:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 * p2;
      return i + 4;
    case 3:
      // console.log(i, arr[i], arr[i + 1], input.toString());
      outputPosition = arr[i + 1];
      if (input.length == 0) {
        return i; // wait for input
      }
      arr[outputPosition] = input[0];
      input.splice(0, 1);
      return i + 2;
    case 4:
      // console.log(i, arr[i], p1);
      output.push(p1);
      return i + 2;
    case 5:
      // console.log(i, arr[i], p1, p2);
      return p1 != 0 ? p2 : i + 3;
    case 6:
      // console.log(i, arr[i], p1, p2);
      return p1 == 0 ? p2 : i + 3;
    case 7:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 < p2 ? 1 : 0;
      return i + 4;
    case 8:
      // console.log(i, arr[i], p1, p2, outputPosition);
      arr[outputPosition] = p1 == p2 ? 1 : 0;
      return i + 4;
    case 99:
      // console.log(i, arr[i]);
      return 0;
    default:
      throw new Error("Unexpected code " + code);
  }
};

const execProgram = (input, arr, startingPosition = 0) => {
  let output = [];
  let prevPosition;
  let currentPosition = startingPosition;
  do {
    prevPosition = currentPosition;
    currentPosition = execCommand(input, arr, prevPosition, output);
  } while (currentPosition != 0 && currentPosition != prevPosition);

  return [currentPosition, output];
};

const copy = (arr) => {
  const copy = [...arr];
  return copy;
};

const generateAllPossibleAmpSettings = (set = [0, 1, 2, 3, 4]) => {
  if (set.length == 1) {
    return [set];
  }

  const result = [];
  for (let i = 0; i < set.length; i++) {
    const subSet = [...set];
    subSet.splice(i, 1);
    generateAllPossibleAmpSettings(subSet).forEach((x) => result.push([set[i], ...x]));
  }

  return result;
};

const maximize = (program) => {
  let maxOutput = 0;
  let maxSettings = [];
  const allSettings = generateAllPossibleAmpSettings();
  allSettings.forEach((settings) => {
    // Run through amplifiers
    let ampOutput = [0]; // 0 is first input
    settings.forEach((ampSetting) => {
      const input = [ampSetting, ampOutput[0]];
      const optcode = copy(program);
      [_, ampOutput] = execProgram(input, optcode);
    });

    // Update max
    if (ampOutput[0] > maxOutput) {
      maxOutput = ampOutput[0];
      maxSettings = [...settings];
    }
  });

  return [maxOutput, maxSettings];
};

const [part1, settings] = maximize(input.program);
console.log(part1, settings);

const maximizeWithFeedbackLoop = (program) => {
  const firstInput = 0;
  let maxOutput = 0;
  let maxSettings = [];
  const feedbackLoopSettings = generateAllPossibleAmpSettings([5, 6, 7, 8, 9]);
  feedbackLoopSettings.forEach((fSettings) => {
    // Run through amplifiers
    let ampOutput = [firstInput];
    const amplifiers = Array.from({ length: 5 }, (x) => copy(program));
    const programPositions = [0, 0, 0, 0, 0];
    let setNewSettings = true;
    do {
      for (let i = 0; i < amplifiers.length; i++) {
        // console.log("amp", i + 1);
        const input = setNewSettings ? [fSettings[i], ...ampOutput] : ampOutput;
        [programPositions[i], ampOutput] = execProgram(input, amplifiers[i], programPositions[i]);
      }

      setNewSettings = false;
    } while (programPositions[programPositions.length - 1] != 0);

    // Update max
    if (ampOutput.at(-1) > maxOutput) {
      maxOutput = ampOutput.at(-1);
      maxSettings = [...fSettings];
    }
  });

  return [maxOutput, maxSettings];
};

const [part2, settings2] = maximizeWithFeedbackLoop(input.program);
console.log(part2, settings2);
