const utils = require("../utils");
const lines = utils.readInput(__dirname);

const example = utils.readExampleInput(__dirname);

const parseInput = (lines) => {
  let blueprints = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(
      utils.multilineRegex(
        /Blueprint (?<id>\d+): Each ore robot costs (?<oreRobot>\d+) ore. /,
        /Each clay robot costs (?<clayRobot>\d+) ore. /,
        /Each obsidian robot costs (?<obsidianRobotOre>\d+) ore and (?<obsidianRobotClay>\d+) clay. /,
        /Each geode robot costs (?<goedeRobotOre>\d+) ore and (?<goedeRobotObsidian>\d+) obsidian./
      )
    );
    let blueprint = {
      id: +m.groups.id,
      resourcesToBuild: {
        ore: { ore: +m.groups.oreRobot },
        clay: { ore: +m.groups.clayRobot },
        obsidian: { ore: +m.groups.obsidianRobotOre, clay: +m.groups.obsidianRobotClay },
        goede: { ore: +m.groups.goedeRobotOre, obsidian: +m.groups.goedeRobotObsidian },
      },
    };
    blueprints.push(blueprint);
  }

  return blueprints;
};

const isEnoughResources = (resourcesToBuild, state, targetRobot) => {
  let targetRequirements = resourcesToBuild[targetRobot];
  return Object.keys(targetRequirements).every((k) => state.resources[k] >= targetRequirements[k]);
};

const isEnoughResources2 = (requiredResources, state) => {
  return Object.keys(requiredResources).every((k) => state.resources[k] >= requiredResources[k]);
};

const buildRobot = (resourcesToBuild, state, targetRobot) => {
  let newState = {
    ...state,
    robots: { ...state.robots },
    resources: { ...state.resources },
  };

  let requiredResources = resourcesToBuild[targetRobot];
  Object.keys(requiredResources).forEach((k) => (newState.resources[k] -= requiredResources[k]));
  newState.robots[targetRobot]++;

  return newState;
};

const timeToBuild = (requirements, state) => {
  let times = Object.keys(requirements).map((k) =>
    Math.ceil((requirements[k] - state.resources[k]) / state.robots[k])
  );
  return Math.max(...times);
};

const isWorthBuilding = (resourcesToBuild, state, robotToBuild, timeLeft) => {
  const maxProduction = state.resources[robotToBuild] + state.robots[robotToBuild] * timeLeft;
  const maxCost = Math.max(
    ...Object.keys(resourcesToBuild).map((r) => resourcesToBuild[r][robotToBuild] || 0)
  );
  const consumption = maxCost * timeLeft;
  const notRequired = maxProduction >= consumption;
  return !notRequired;
};

const estimateScore = (resourcesToBuild, state, timeLeft) => {
  let totalOre = state.resources.ore + timeLeft * state.robots.ore;
  let possibleClayRobots = Math.floor(totalOre / resourcesToBuild.clay.ore);
  let totalClay =
    state.resources.clay +
    timeLeft * state.robots.clay +
    (timeLeft - possibleClayRobots) * possibleClayRobots;
  let possibleObsidianRobots = Math.floor(totalClay / resourcesToBuild.obsidian.clay);
  let totalObsidian =
    state.resources.obsidian +
    timeLeft * state.robots.obsidian +
    (timeLeft - possibleObsidianRobots) * possibleObsidianRobots;
  let possibleGoedeRobots = Math.floor(totalObsidian / resourcesToBuild.goede.obsidian);
  let possibleGoede =
    state.resources.goede +
    timeLeft * state.robots.goede +
    (timeLeft - possibleGoedeRobots) * possibleGoedeRobots;

  return possibleGoede;
};

const maximizeBfs = (blueprint, time) => {
  let initialState = {
    t: time,
    haveNotBuildPreviously: [],
    robots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      goede: 0,
    },
    resources: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      goede: 0,
    },
  };

  let minerals = Object.keys(initialState.robots);

  let robotLimits = {
    ore: Math.max(...minerals.map((k) => blueprint.resourcesToBuild[k].ore || 0)),
    clay: Math.max(...minerals.map((k) => blueprint.resourcesToBuild[k].clay || 0)),
    obsidian: Math.max(...minerals.map((k) => blueprint.resourcesToBuild[k].obsidian || 0)),
    goede: Infinity,
  };

  let q = [initialState];
  for (let i = time; i > 0; i--) {
    // console.log(new Date().toLocaleTimeString(), i, q.length);
    let nextLevel = [];
    for (let state of q) {
      let canBuild = {};
      minerals.forEach(
        (r) =>
          (canBuild[r] =
            state.robots[r] < robotLimits[r] &&
            isEnoughResources2(blueprint.resourcesToBuild[r], state) &&
            !state.haveNotBuildPreviously[r]) && // does not make sense to build robot now if it wasn't build on previous step
          isWorthBuilding(blueprint.resourcesToBuild, state, r, i)
      );

      let nextState = {
        t: time,
        haveNotBuildPreviously: {},
        resources: { ...state.resources },
        robots: { ...state.robots },
      };

      // collect
      minerals.forEach((r) => (nextState.resources[r] += state.robots[r]));

      // produce
      minerals.forEach((r) => {
        if (!canBuild[r]) return;
        let s = buildRobot(blueprint.resourcesToBuild, nextState, r);
        nextLevel.push(s);
      });

      nextState.haveNotBuildPreviously = canBuild;
      nextLevel.push(nextState);
    }

    let take = 100000;
    if (nextLevel.length > take) {
      let scores = nextLevel
        .map((state) => ({ state, score: estimateScore(blueprint.resourcesToBuild, state, i - 1) }))
        .sort((a, b) => b.score - a.score);
      q = scores.map((x) => x.state).slice(0, take);
    }
    else {
      q = nextLevel;
    }
  }

  let max = Math.max(...q.map((s) => s.resources.goede));
  console.log(new Date().toLocaleTimeString(), blueprint.id, max);
  return max;
};

// Part 1
const blueprints = parseInput(lines);
const part1 = blueprints.reduce((r, b) => r + b.id * maximizeBfs(b, 24), 0);
console.log(part1);

const part2 = blueprints.slice(0,3).reduce((r, b) => r * maximizeBfs(b, 32), 1);
console.log(part2);
