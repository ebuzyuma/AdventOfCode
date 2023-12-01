Array.prototype.numSort = function () {
  return this.sort((a, b) => a - b);
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.splitBy = function (delimiter) {
  if (typeof delimiter !== "function") {
    const stringDelimiter = delimiter;
    delimiter = (x) => x === stringDelimiter;
  }

  let group = [];
  const groups = [];
  for (let value of this) {
    if (delimiter(value)) {
      groups.push(group);
      group = [];
    } else {
      group.push(value);
    }
  }

  if (group.length > 0) {
    groups.push(group);
  }

  return groups;
};

Array.prototype.sum = function () {
  return this.reduce((prev, curr) => prev + +curr, 0);
};

Array.prototype.product = function () {
  return this.reduce((prev, curr) => prev * curr, 1);
};
