const utils = require("../utils");
const lines = utils.readInput(__dirname);

const calibration1 = lines
  .map(x => x.replaceAll(/[a-z]/g, ''))
  .map(x => `${x[0]}${x[x.length -1]}`)
  .sum();

// Part 1
console.log(calibration1);

// Part 2
let digits = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
let calibration2 = 0;
lines.forEach(line => {
  let numbers = [];
  for (let i = 0; i < line.length; i++){
    if (Number.isInteger(+line[i])) {
      numbers.push(+line[i]);
    }
    else {
      for (let index = 1; index < digits.length; index++) {
        const element = digits[index];
        if (line.startsWith(element, i)) {
          numbers.push(index);
        }        
      }
    }
  }
  
  let calibration = `${numbers[0]}${numbers.last()}`;
  calibration2 += +calibration;
});
console.log(calibration2);
