from itertools import combinations

def is_safe(report):
  d = report[0] - report[1]
  return all(((d > 0 and a > b) or (d < 0 and a < b)) and 1 <= abs(a-b) <= 3 for a,b in zip(report, report[1:]))

def is_safe2(report):
  return any(map(is_safe, [report, *combinations(report, len(report) - 1)]))

def solve(file):  
  data = list(map(lambda str: list(map(int, str.rstrip().split(' '))),open(file).readlines()))
  p1 = sum(map(is_safe, data))
  p2 = sum(map(is_safe2, data))
  return p1, p2

print(solve('example.txt'))
print(solve('input.txt'))