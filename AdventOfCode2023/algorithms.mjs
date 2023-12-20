// greatest common divisor
export function gcdPair(a, b) {
  if (b === 0) {
    return a;
  }

  return gcdPair(b, a % b);
}

export function gcdArray(arr) {
  let gcd = arr[0];
  for (let i = 1; i < arr.length; i++) {
    gcd = gcdPair(gcd, arr[i]);
  }

  return gcd;
}

// least common multiplier
export function lcmPair(a, b) {
  return (a * b) / gcdPair(a, b);
}

export function lcmArray(arr) {
  let lcm = arr[0];
  for (let i = 1; i < arr.length; i++) {
    lcm = lcmPair(lcm, arr[i]);
  }

  return lcm;
}
