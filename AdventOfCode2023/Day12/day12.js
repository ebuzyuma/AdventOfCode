const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function canPlace(conditions, start, groups) {
  let regex = "^" + groups.map((n) => `[#?]{${n}}`).join("[.?]+") + "[.?]*$";
  let substring = conditions.substring(start);
  return substring.match(regex);
}

function isValidTail(conditions, start, groups) {
  let regex = "^[.?]*" + groups.map((n) => `[#?]{${n}}`).join("[.?]+") + "[.?]*$";
  let substring = conditions.substring(start);
  return substring.match(regex);
}

function isValid(conditions, groups) {
  let regex = "^[.]*" + groups.map((n) => `#{${n}}`).join(".+") + "[.?]*$";
  return conditions.match(regex);
}

function findArrangements(conditions, start, groups, memo) {
  let key = conditions.substring(start) + "_" + groups.join(",");
  let memValue = memo[key];
  if (memValue) {
    return memValue;
  }

  if (conditions[start] === ".") {
    while (conditions[start] === ".") start++;
    return findArrangements(conditions, start, groups, memo);
  }

  if (groups.length == 0) {
    if (conditions.substring(start).match(/^[.?]*$/)) {
      return 1;
    }
    return 0;
  }

  let arrangements = 0;
  if (canPlace(conditions, start, groups)) {
    let groupSize = groups[0];
    let newCondition =
      conditions.substring(0, start) +
      "#".repeat(groupSize) +
      (start + groupSize + 1 < conditions.length ? "." : "") +
      conditions.substring(start + groupSize + 1);
    let local = findArrangements(newCondition, start + groupSize + 1, groups.slice(1), memo);
    arrangements += local;
  }

  if (conditions[start] === "?") {
    let newCondition = conditions.substring(0, start) + "." + conditions.substring(start + 1);
    if (isValidTail(newCondition, start + 1, groups)) {
      let local2 = findArrangements(newCondition, start + 1, groups, memo);
      arrangements += local2;
    }
  }

  memo[key] = arrangements;

  return arrangements;
}

function bfs(conditions, groups) {
  let toVisit = [[conditions, 0, groups]];
  let arrangements = 0;
  let step = 0;
  while (toVisit.length > 0) {
    let [conditions, start, groups] = toVisit.pop();
    step++;
    if (step % 10000000 == 0) {
      console.log(step, toVisit.length, conditions);
    }

    if (conditions[start] === ".") {
      toVisit.push([conditions, start + 1, groups]);
      continue;
    }

    if (groups.length == 0) {
      if (conditions.substring(start).match(/^[.?]*$/)) {
        arrangements++;
      }
      continue;
    }

    if (canPlace(conditions, start, groups)) {
      let groupSize = groups[0];
      let newCondition =
        conditions.substring(0, start) +
        "#".repeat(groupSize) +
        (start + groupSize + 1 < conditions.length ? "." : "") +
        conditions.substring(start + groupSize + 1);
      toVisit.push([newCondition, start + groupSize + 1, groups.slice(1)]);
    }

    if (conditions[start] === "?") {
      let newCondition = conditions.substring(0, start) + "." + conditions.substring(start + 1);
      toVisit.push([newCondition, start + 1, groups]);
    }
  }

  return arrangements;
}

function solve(input) {
  let values = input.map((line) => {
    let [record, numbers] = line.split(" ");
    numbers = numbers.split(",").map((x) => +x);
    return { record, numbers };
  });

  // Part 1
  let sum = 0;
  for (let { record, numbers } of values) {
    let arrangements = findArrangements(record, 0, numbers, {});
    sum += arrangements;
  }

  // Part 2
  // Something is wrong with the memory. So just execute the script for every 100 like:
  // node day12.js 0 100 && node day12.js 100 200 && node day12.js 200 300 && node day12.js 300 400 && node day12.js 400 500 && node day12.js 500 600 && node day12.js 600 700 && node day12.js 700 800 && node day12.js 800 900 && node day12.js 900 1000
  let sum2 = 0;
  let from = +process.argv[2] || 0;
  let to = +process.argv[3] || values.length;
  let step = -1;
  for (let { record, numbers } of values.slice(from, to)) {
    let recordX5 = Array(5).fill(record).join("?");
    let numbersX5 = Array(5).fill(numbers).flat();

    // let arrangements2 = bfs(arg2, num2);
    let arrangements = findArrangements(recordX5, 0, numbersX5, {});
    sum2 += arrangements;
    // console.log(step++, sum2);
  }

  return [sum, sum2];
}

// console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
