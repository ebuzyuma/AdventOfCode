sign = lambda x: x and (1, -1)[x<0]

def is_safe(report):
  direction = sign(report[0] - report[1])
  i = 0
  while(i < len(report) - 1):
    diff = report[i] - report[i + 1]
    if (abs(diff) > 3 or sign(diff) != direction):
      return False
    i = i + 1
      
  return True

def is_safe2(report):
  if (is_safe(report)):
    return True
  
  i = 0
  while (i < len(report)):
    new_report = report.copy()
    del new_report[i]
    if (is_safe(new_report)):
      return True
    i = i + 1
    
  return False

def solve(file):  
  data = list(map(lambda str: list(map(int, str.rstrip().split(' '))),open(file).readlines()))
  p1 = list(map(is_safe, data)).count(True)
  p2 = list(map(is_safe2, data)).count(True)
  return p1, p2

print(solve('example.txt'))
print(solve('input.txt'))