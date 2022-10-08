var input = require("./input.js");

const layersCount = (digits, w, h) => digits.length / (w * h);

const countChars = (digits, w, h, layer, char) => {
  let count = 0;
  for (let i = layer * w * h; i < (layer + 1) * w * h; i++) {
    if (digits[i] === char) {
      count++;
    }
  }

  return count;
};

const part1 = (digits, w, h) => {
  const layers = layersCount(digits, w, h);
  let minLayer = 0;
  let minZeroCount = w * h;
  for (let i = 0; i < layers; i++) {
    const count = countChars(digits, w, h, i, "0");
    if (count < minZeroCount) {
      minLayer = i;
      minZeroCount = count;
    }
  }

  const answer = countChars(digits, w, h, minLayer, "1") * countChars(digits, w, h, minLayer, "2");
  return answer;
};

const part2 = (digits, w, h) => {
  const transparent = "2";
  const digitsPerLayer = w * h;

  let out = "";
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let position = j * w + i;
      while (digits[position] === transparent) {
        position += digitsPerLayer;
      }
      out += digits[position] === "0" ? "#" : " ";
    }
    out += "\r\n";
  }

  return out;
};

const width = 25;
const height = 6;
console.log(part1(input.digits, width, height));

console.log(part2(input.digits, width, height));
