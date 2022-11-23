const readInput = (file = "input") => {
  var fs = require("fs");
  var path = process.cwd();
  var buffer = fs.readFileSync(path + "\\14\\" + file);
  return buffer.toString();
};

const parseReactions = (str) => {
  const lines = str.split("\n").map((x) => x.trim());
  const rules = {};
  lines.forEach((line) => {
    const split = line.split(" => ");
    const output = split[1].split(" ");
    const inputs = split[0].split(", ").map((x) => x.split(" "));
    rules[output[1]] = {
      outputQuantity: +output[0],
      inputs: inputs.reduce((obj, cur) => ({ ...obj, [cur[1]]: +cur[0] }), {}),
    };
  });

  return rules;
};

const hasOnlyAvailableInput = (requirements, input) =>
  Object.keys(requirements).every((k) => k === input || requirements[k] <= 0);

const reduceByReaction = (reactions, requirements, input) => {
  let [requiredChemical, requiredQuantity] = Object.entries(requirements).find(
    ([chemical, amount]) => chemical !== input && amount > 0
  );

  // Reduce by reaction
  const reaction = reactions[requiredChemical];
  const applyCount = Math.ceil(requiredQuantity / reaction.outputQuantity);
  for (const inputChemical in reaction.inputs) {
    requirements[inputChemical] = requirements[inputChemical] || 0;
    requirements[inputChemical] += reaction.inputs[inputChemical] * applyCount;
  }

  const reactionOutput = reaction.outputQuantity * applyCount;
  requirements[requiredChemical] = requiredQuantity - reactionOutput;
  if (requirements[requiredChemical] === 0) {
    delete requirements[requiredChemical];
  }
};

const reduce = (reactions, requirements, inputChemical) => {
  while (!hasOnlyAvailableInput(requirements, inputChemical)) {
    reduceByReaction(reactions, requirements, inputChemical);
  }

  return requirements[inputChemical];
};

// Part 1
const input = readInput();
const reactions = parseReactions(input);
const orePerFuel = reduce(reactions, { FUEL: 1 }, "ORE");
console.log(orePerFuel);

// Part 2
// console.log(reduce(reactions, { FUEL: 3000000 }, "ORE"));
const maximizeFuel = (reactions, orePerFuel, inputOreQuantity) => {
  let low = Math.floor(inputOreQuantity / orePerFuel);
  let requiredOre = orePerFuel;
  let high = 3000000;
  while (low < high) {
    const mid = Math.ceil((high + low) / 2);
    requiredOre = reduce(reactions, { FUEL: mid }, "ORE");
    if (requiredOre > inputOreQuantity) {
      high = mid - 1;
    } else {
      low = mid;
    }
  }

  return low;
};

const max = maximizeFuel(reactions, orePerFuel, 1000000000000);
console.log(max);
