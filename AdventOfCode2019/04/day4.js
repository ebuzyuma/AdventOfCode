from = 271973;
to = 785961;

const hasDouble = (str) => str.length >= 2 && (str[0] == str[1] || hasDouble(str.slice(1)));
const isIncrease = (str) => str.length <= 1 || (str[1] >= str[0] && isIncrease(str.slice(1)));

let passwords = [];
const all = Array.from({ length: to - from + 1 }, (_, i) => (from + i).toString());

const part1passwords = all.filter(isIncrease).filter(hasDouble);

const part1 = part1passwords.length;
console.log(part1);

const dropWhile = (arr, key) => {
  return arr && arr[0] == key ? dropWhile(arr.slice(1), key) : arr;
};

const hasDoubleAlone = (str) =>
  !str || str.length < 2
    ? false
    : str.length == 2
    ? str[0] == str[1]
    : (str[0] == str[1] && str[1] != str[2]) ||
      (str[0] == str[1] ? hasDoubleAlone(dropWhile(str, str[0])) : hasDoubleAlone(str.slice(1)));

const part2 = part1passwords.filter(hasDoubleAlone).length;
console.log(part2);
