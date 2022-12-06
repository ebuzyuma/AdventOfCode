Array.prototype.numSort = function () {
  return this.sort((a, b) => a - b);
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.splitWhen = function (delimiter) {
  if (typeof delimiter !== "function") {
    delimiter = (x) => x === delimiter;
  }

  let split = [];
  const result = [];
  for (let value of this) {
    if (delimiter(value)) {
      result.push(split);
    } else {
      split.push(value);
    }
  }

  if (split.length > 0) {
    result.push(split);
  }

  return result;
};
