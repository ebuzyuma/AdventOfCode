import "./array.mjs";
import fs from "fs";

export const readInput = (inputFolder, file = "input.txt", doNotTrim = false) => {
  const data = fs.readFileSync(`${inputFolder}/${file}`, "utf8");

  const lines = data.split("\n").map((x) => (doNotTrim ? x : x.trim()));

  return lines;
};

export const multilineRegex = (...parts) =>
  new RegExp(parts.map((x) => (x instanceof RegExp ? x.source : x)).join(""));
