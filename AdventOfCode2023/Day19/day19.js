const utils = require("../utils");
const exampleInput = utils.readInput(__dirname, "example.txt");
const puzzleInput = utils.readInput(__dirname, "input.txt");

function checkRule(rule, part) {
  let condition = rule.condition
    .replace("x", part.x)
    .replace("m", part.m)
    .replace("a", part.a)
    .replace("s", part.s);

  let match = eval(condition);
  return match;
}

function findOptions(workflows) {
  let minValue = 1;
  let maxValue = 4000;
  let range = { from: minValue, to: maxValue };
  let initialRanges = {
    x: { ...range },
    m: { ...range },
    a: { ...range },
    s: { ...range },
  };

  let result = [];
  let queue = [{ workflow: "in", ranges: initialRanges }];
  while (queue.length > 0) {
    if (result.length % 100 === 0) {
      console.log(result.length, queue.length);
    }
    let state = queue.pop();
    if (state.workflow === "A") {
      result.push(state.ranges);
      continue;
    } else if (state.workflow === "R") {
      continue;
    }

    let workflow = workflows[state.workflow];
    let ranges = { ...state.ranges };
    for (let rule of workflow.rules) {
      if (rule.condition == "true") {
        queue.push({
          workflow: rule.result,
          ranges: ranges,
        });
        continue;
      }
      let category = rule.condition[0];
      let comparison = rule.condition[1];
      let number = Number(rule.condition.substring(2));

      // rule is false
      if (
        (comparison === ">" && ranges[category].to <= number) ||
        (comparison === "<" && ranges[category].from >= number)
      ) {
        continue;
      }

      let trueFrom, trueTo, falseFrom, falseTo;
      if (comparison === ">") {
        falseFrom = ranges[category].from;
        falseTo = number;
        trueFrom = number + 1;
        trueTo = ranges[category].to;
      } else {
        // comparison == <
        trueFrom = ranges[category].from;
        trueTo = number - 1;
        falseFrom = number;
        falseTo = ranges[category].to;
      }

      // true
      let trueRanges = { ...ranges };
      trueRanges[category] = { from: trueFrom, to: trueTo };
      queue.push({
        workflow: rule.result,
        ranges: trueRanges,
      });

      // false
      ranges[category] = { from: falseFrom, to: falseTo };
    }
  }

  return result;
}

function solve(input) {
  let [workflowsLine, parts] = input.splitBy("");

  const workflowRegex = /^(?<name>[a-z]+){(?<rules>.+)}$/;
  let workflows = {};
  for (let workflow of workflowsLine) {
    const match = workflowRegex.exec(workflow);
    const { name, rules } = match.groups;
    workflows[name] = {
      rules: rules.split(",").map((r) => ({
        condition: r.includes(":") ? r.split(":")[0] : "true",
        result: r.includes(":") ? r.split(":")[1] : r,
      })),
    };
  }

  const partRegex = /^{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)}$/;

  parts = parts.map((p) => partRegex.exec(p).groups);

  let startWorkflow = "in";

  // Part 1
  let acceptedParts = [];
  for (let part of parts) {
    let workflow = startWorkflow;
    while (true) {
      let wRules = workflows[workflow].rules;
      let mRule = wRules.find((r) => checkRule(r, part));
      if (mRule.result === "A") {
        acceptedParts.push(part);
        break;
      } else if (mRule.result === "R") {
        break;
      } else {
        workflow = mRule.result;
      }
    }
  }

  let p1 = acceptedParts.map((p) => +p.x + +p.m + +p.a + +p.s).sum();

  // Part 2
  let ranges = findOptions(workflows);
  let p2 = 0;
  let result = ranges
    .map(
      (r) => (r.x.to - r.x.from + 1) * (r.m.to - r.m.from + 1) * (r.a.to - r.a.from + 1) * (r.s.to - r.s.from + 1)
    )
    .sum();

  return [p1, p2, result];
}

console.log("example:", solve(exampleInput));
console.log(" puzzle:", solve(puzzleInput));
