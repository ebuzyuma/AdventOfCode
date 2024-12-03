import re

def solve(file):  
  data = open(file).read()
  matches = re.findall(r"mul\((\d{1,3}),(\d{1,3})\)", data)
  p1 = sum(map(lambda p: int(p[0]) * int(p[1]), matches))
  
  modified = re.sub(r"don't\(\)[\s\S]+?do\(\)", "", data)
  matches2 = re.findall(r"mul\((\d{1,3}),(\d{1,3})\)", modified)
  p2 = sum(map(lambda p: int(p[0]) * int(p[1]), matches2))
  return p1, p2

print(solve('example.txt'))
print(solve('input.txt'))