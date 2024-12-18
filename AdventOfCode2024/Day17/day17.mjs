import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Parsing
  const [registersRaw, programRaw] = input.splitBy("");
  let registers = registersRaw.map((r) => +r.split(": ")[1]);
  let program = programRaw[0]
    .split(": ")[1]
    .split(",")
    .map((n) => +n);

  // Part 1
  const divideBy2Power = (x, y) => {
    const bits = x.toString(2);
    if (y >= bits.length) {
      return 0;
    }
    const result = parseInt(bits.slice(0, bits.length - y), 2);
    if (result < 0) debugger;
    return result;
  };
  const xor = (x, y) => {
    const xBits = x.toString(2).split("").reverse();
    const yBits = y.toString(2).split("").reverse();
    let result = [];
    for (let i = 0; i < Math.max(xBits.length, yBits.length); i++) {
      result.push((xBits[i] ?? "0") === (yBits[i] ?? "0") ? "0" : "1");
    }

    return parseInt(result.reverse().join(""), 2);
  };

  // WHY JS WHY
  console.log(xor(5, 2184718816), 5 ^ 2184718816);

  const runProgram = (registers, program, expectedOutput) => {
    const getComboOperand = (v) => (v > 3 ? registers[v - 4] : v);
    let pointer = 0;
    let output = [];
    while (pointer < program.length) {
      let opcode = program[pointer];
      let literalOperand = program[pointer + 1];
      let comboOperand = getComboOperand(literalOperand);
      let jump = false;
      switch (opcode) {
        case 0:
          registers[0] = divideBy2Power(registers[0], comboOperand); // Math.trunc(registers[0] / Math.pow(2, comboOperand));
          break;
        case 1:
          const xor1 = xor(registers[1], literalOperand);
          registers[1] = xor1;
          break;
        case 2:
          registers[1] = comboOperand % 8;
          break;
        case 3:
          if (registers[0] !== 0) {
            pointer = literalOperand;
            jump = true;
          }
          break;
        case 4:
          const xor4 = xor(registers[1], registers[2]);
          if (xor4 < 0) debugger;
          registers[1] = xor4;
          break;
        case 5:
          output.push(comboOperand % 8);
          if (expectedOutput && !expectedOutput.startsWith(output.join(","))) {
            return output;
          }
          break;
        case 6:
          registers[1] = divideBy2Power(registers[0], comboOperand); // Math.trunc(registers[0] / Math.pow(2, comboOperand));
          break;
        case 7:
          registers[2] = divideBy2Power(registers[0], comboOperand); // Math.trunc(registers[0] / Math.pow(2, comboOperand));
          break;
        default:
          throw new Error("unknown code");
      }

      if (!jump) {
        pointer += 2;
      }
    }

    return output;
  };

  const p1 = runProgram([...registers], program).join(",");

  // Part 2
  const tooHigh = 1188741167528975;
  let valid = [];
  const expectedOutput = program.join(",");
  const bitsCombinations = (n) => [...Array(Math.pow(2, n))].map((_, i) => i.toString(2));
  let paddings = bitsCombinations(8);
  let q = [{ mLen: 0, a: "" }];
  while (q.length > 0) {
    let { mLen, a } = q.shift();
    if (mLen === program.length) {
      const value = parseInt(a, 2);
      let test = runProgram([value, 0, 0], program).join(",");
      if (test === expectedOutput && !valid.includes(value)) {
        valid.push(value);
        valid.sort();
        break;
      }
    }
    for (let p of paddings) {
      let aBits = p + a;
      registers[0] = parseInt(aBits, 2);
      if (parseInt(aBits, 2) > tooHigh) {
        continue;
      }
      const output = runProgram([...registers], program);
      if (output.length > mLen && expectedOutput.startsWith(output.slice(0, mLen + 1).join(","))) {
        q.push({ mLen: mLen + 1, a: aBits });
      }
    }

    q = q.sort((x, y) => {
      if (x.mLen === y.mLen) {
        return parseInt(x.a, 2) - parseInt(y.a, 2);
      }
      return y.mLen - x.mLen;
    });
  }
  const p2 = valid[0];

  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput, 0));
