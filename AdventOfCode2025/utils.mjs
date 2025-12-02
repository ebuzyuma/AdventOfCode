import "./array.mjs";
import fs from "fs";

export const readInput = (inputFolder, file = "input.txt", doNotTrim = false) => {
  const data = fs.readFileSync(`${inputFolder}/${file}`, "utf8");

  const lines = data.split("\n").map((x) => (doNotTrim ? x : x.trim()));

  return lines;
};

export const multilineRegex = (...parts) =>
  new RegExp(parts.map((x) => (x instanceof RegExp ? x.source : x)).join(""));

export const gcd = (a, b) => {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
};

export const lcd = (a, b) => (a * b) / gcd(a, b);
