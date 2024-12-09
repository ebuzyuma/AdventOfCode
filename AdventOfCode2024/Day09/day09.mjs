import * as utils from "../utils.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

function solve(input) {
  // Part 1
  const memory = [...input[0]];
  const data = memory.map((v, i) => (i % 2 == 0 ? { id: i / 2, size: +v } : { gap: +v }));

  let newMem = [];
  for (let i = 0; i < data.length; i++) {
    let file = data[i];
    if (file.size !== undefined) {
      newMem.push(file);
      continue;
    }

    // Move
    let gap = file.gap;
    while (gap > 0) {
      let last = data[data.length - 1];
      if (last.gap !== undefined) {
        data.pop();
      } else {
        if (last.size <= gap) {
          // Fits full
          gap -= last.size;
          newMem.push(last);
          data.pop();
        } else {
          // does not fit
          newMem.push({ id: last.id, size: gap });
          last.size -= gap;
          gap = 0;
        }
      }
    }
  }

  let p1 = BigInt(0);
  let i = 0;
  for (let m of newMem) {
    for (let k = 0; k < m.size; k++, i++) {
      p1 += BigInt(m.id) * BigInt(i);
    }
  }

  // Part 2
  let newMem2 = memory.map((v, i) => (i % 2 == 0 ? { id: i / 2, size: +v } : { gap: +v }));
  for (let rightIndex = newMem2.length - 1; rightIndex > 0; rightIndex--) {
    let file = newMem2[rightIndex];
    if (file.gap !== undefined) {
      continue;
    }

    // Find possible left position
    let leftIndex = 0;
    while (
      leftIndex < rightIndex &&
      (!newMem2[leftIndex].gap || newMem2[leftIndex].gap < file.size)
    ) {
      leftIndex++;
    }
    if (leftIndex < rightIndex) {
      newMem2[rightIndex] = { gap: file.size };
      if (newMem2[leftIndex].gap == file.size) {
        // replace
        newMem2[leftIndex] = file;
      } else {
        // insert
        const newGap = { gap: newMem2[leftIndex].gap - file.size };
        newMem2 = [...newMem2.slice(0, leftIndex), file, newGap, ...newMem2.slice(leftIndex + 1)];
        rightIndex++;
      }
    }
  }

  let p2 = BigInt(0);
  i = 0;
  for (let m of newMem2) {
    if (m.gap !== undefined) {
      i += m.gap;
      continue;
    }
    for (let k = 0; k < m.size; k++, i++) {
      p2 += BigInt(m.id) * BigInt(i);
    }
  }
  return [p1, p2];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
