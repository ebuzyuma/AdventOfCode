import * as utils from "../utils.mjs";
import { lcmArray } from "../algorithms.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleInput = utils.readInput(scriptDirectory, "example.txt");
const puzzleInput = utils.readInput(scriptDirectory, "input.txt");

const lowPulse = 0;
const highPulse = 1;

function pressButton(modules, pulseMemo, fromModule, expectedSendPulse) {
  let sendPulses = [];
  let queue = [{ pulse: lowPulse, from: "button", to: "broadcaster" }];
  while (queue.length > 0) {
    let state = queue.shift();
    let module = modules[state.to];
    pulseMemo[state.pulse]++;
    if (!module) {
      continue;
    }
    let sendPulse = null;
    if (state.to === "broadcaster") {
      sendPulse = state.pulse;
    } else if (module.type === "%" && state.pulse === lowPulse) {
      if (module.on) {
        sendPulse = lowPulse;
      } else {
        sendPulse = highPulse;
      }
      module.on = !module.on;
    } else if (module.type === "&") {
      module.connected[state.from] = state.pulse;
      let isAllHighPulse = Object.values(module.connected).every((s) => s === highPulse);
      if (isAllHighPulse) {
        sendPulse = lowPulse;
      } else {
        sendPulse = highPulse;
      }
    }

    if (state.to === fromModule && sendPulse === expectedSendPulse) {
      sendPulses.push(sendPulse);
    }

    if (sendPulse !== null) {
      let next = module.destinations.map((d) => ({ pulse: sendPulse, from: state.to, to: d }));
      queue.push(...next);
    }
  }

  return sendPulses;
}

function findCycle(modules, fromModule, expectedPulse) {
  let modulesCopy = JSON.parse(JSON.stringify(modules));
  let sendPulses = [];
  let count = 0;
  let pulseMemo = {
    [lowPulse]: 0,
    [highPulse]: 0,
  };

  while (sendPulses.last() !== expectedPulse) {
    count++;
    sendPulses = pressButton(modulesCopy, pulseMemo, fromModule, expectedPulse);
  }

  return count;
}

function solve(input, targetModule) {
  let modules = {};
  const lineRegex = /^(?<type>[&%]*)(?<name>\w+) -> (?<destinations>.+)$/;
  for (let line of input) {
    const match = lineRegex.exec(line);
    const { type, name, destinations } = match.groups;
    modules[name] = {
      type,
      destinations: destinations.split(", "),
    };
  }

  for (let [key, module] of Object.entries(modules)) {
    if (module.type === "%") {
      module.on = false;
    } else if (module.type === "&") {
      let connected = Object.keys(modules).filter((m) => modules[m].destinations.includes(key));
      module.connected = {};
      connected.forEach((m) => (module.connected[m] = lowPulse));
    }
  }

  // Part 1
  let press = 1000;
  let pulseMemo = {
    [lowPulse]: 0,
    [highPulse]: 0,
  };
  let modulesCopy = JSON.parse(JSON.stringify(modules));
  for (let i = 0; i < press; i++) {
    pressButton(modulesCopy, pulseMemo);
  }
  let p1 = pulseMemo[lowPulse] * pulseMemo[highPulse];

  // Part 2
  // target = rx
  // 0 -> rx <=> 1 -> &zp <=> 1 -> zp.connected
  let leadToTarget = Object.keys(modules).find(m => modules[m].destinations.includes(targetModule))
  let connected = Object.keys(modules[leadToTarget].connected)
  let cycles = connected.map(c => findCycle(modules, c, highPulse));
  let p2 = lcmArray(cycles)

  return [p1, p2];
}

console.log("example:", solve(exampleInput, "output"));
console.log(" puzzle:", solve(puzzleInput, "rx"));
