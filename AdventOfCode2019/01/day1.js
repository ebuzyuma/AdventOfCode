const input = [
  125050,
  115884,
  132344,
  67441,
  119823,
  86204,
  111093,
  99489,
  67860,
  51288,
  62815,
  65263,
  56540,
  81380,
  96101,
  116351,
  56330,
  123123,
  133969,
  115050,
  137851,
  136900,
  71254,
  53458,
  139976,
  140218,
  117085,
  52241,
  71251,
  136110,
  103784,
  132893,
  140216,
  85568,
  94327,
  85200,
  136753,
  110917,
  147197,
  120161,
  81684,
  56987,
  143452,
  94728,
  138355,
  54577,
  59898,
  69123,
  133769,
  118418,
  93530,
  50297,
  71543,
  113383,
  135203,
  140129,
  70977,
  58566,
  129593,
  137456,
  130100,
  130915,
  88872,
  96014,
  62746,
  127048,
  89522,
  62021,
  85363,
  143611,
  135995,
  65836,
  146022,
  119911,
  127381,
  121007,
  71577,
  129637,
  90271,
  54640,
  117213,
  116151,
  114022,
  107683,
  102079,
  94388,
  135676,
  69019,
  104056,
  124799,
  107998,
  148696,
  122793,
  135417,
  52981,
  122890,
  142491,
  88137,
  57609,
  54921,
]

const calculateFuel = mass => Math.floor(mass / 3.0) - 2;
const part1result = input.map(calculateFuel).reduce((r, i) => r + i, 0);
console.log(part1result);

const calculateFullFuel = mass => {
  let totalFuel = 0;
  let additionalFuel = calculateFuel(mass);
  do  {
    totalFuel += additionalFuel;
    additionalFuel = calculateFuel(additionalFuel);
  } while (additionalFuel > 0)

  return totalFuel;
}

const part2result = input.map(calculateFullFuel).reduce((r, i) => r + i, 0);
console.log(part2result);