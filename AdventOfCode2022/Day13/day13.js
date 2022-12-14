const utils = require("../utils");
const lines = utils.readInput(__dirname);

let result = 0;

const parseItems = (x) => {
  let items = [];
  let i = 0;
  while (i < x.length) {
    if (x[i] === "[") {
      let endIndex = i + 1;
      let open = 0;
      while (open !== 0 || x[endIndex] !== "]") {
        if (x[endIndex] === "[") {
          open++;
        } else if (x[endIndex] === "]") {
          open--;
        }
        endIndex++;
      }
      let subItems = parseItems(x.substring(i + 1, endIndex));
      items.push(subItems);
      i = endIndex + 1;
    } else {
      let coma = x.indexOf(",", i);
      if (coma === -1) {
        coma = x.length;
      }
      v = +x.substring(i, coma);
      items.push(v);
      i = coma;
    }

    i++;
  }

  return items;
};

const toString = (x) => {
  if (Array.isArray(x)) {
    let join = x.map((a) => toString(a)).join(",");
    return `[${join}]`;
  }

  return x.toString();
};

let pairs = [];
for (let i = 0; i < lines.length - 1; i += 3) {
  const left = parseItems(lines[i].substring(1, lines[i].length - 1));
  let backToStr = toString(left);
  if (backToStr != lines[i]) {
    console.log(backToStr);
    console.log(lines[i]);
  }
  const right = parseItems(lines[i + 1].substring(1, lines[i + 1].length - 1));
  backToStr = toString(right);
  if (backToStr != lines[i + 1]) {
    console.log(backToStr);
    console.log(lines[i + 1]);
  }

  pairs.push({ left, right });
}

const compare = (left, right) => {
  let isLeftArray = Array.isArray(left);
  let isRightArray = Array.isArray(right);
  if (isLeftArray && isRightArray) {
    if (left.length === 0 && right.length === 0) {
      return 0;
    }
    if (left.length === 0) {
      return 1;
    }
    if (right.length === 0) {
      return -1;
    }
    let compResult = compare(left[0], right[0]);
    if (compResult === 0) {
      return compare(left.slice(1), right.slice(1));
    }

    return compResult;
  }
  if (isLeftArray) {
    return compare(left, [right]);
  }
  if (isRightArray) {
    return compare([left], right);
  }

  return Math.sign(right - left);
};

let s = [[2]];
let e = [[6]];
let items = [s, e];

let sum = 0;
for (let i = 0; i < pairs.length; i++) {
  let pair = pairs[i];
  items.push(pair.left);
  items.push(pair.right);
  if (compare(pair.left, pair.right) === 1) {
    sum += i + 1;
  }
}

console.log(sum);

items = items.sort(compare).reverse();
let si = items.indexOf(s) + 1;
let se = items.indexOf(e) + 1;
console.log(si * se);
