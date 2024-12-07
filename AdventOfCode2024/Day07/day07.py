from operator import add, mul

cat = lambda x, y: int(str(x) + str(y))

def is_valid(test, numbers, ops):  
  results = [numbers[0]]
  for y in numbers[1:]:
    results = [op(x, y)
          for x in results
          for op in ops if op(x, y) <= test]
  
  return test in results

def parse(line):
  test, numbers = line.split(': ')
  return int(test), list(map(int, numbers.split(' ')))

def solve(file):  
  data = open(file).readlines()
  calibrations = list(map(parse, data))
  valid1 = filter(lambda x: is_valid(x[0], x[1], (add, mul)), calibrations)
  p1 = sum(map(lambda x: x[0], valid1))

  valid2 = filter(lambda x: is_valid(x[0], x[1], (add, mul, cat)), calibrations)
  p2 = sum(map(lambda x: x[0], valid2))

  return p1, p2
  
print(solve('example.txt'))
print(solve('input.txt'))