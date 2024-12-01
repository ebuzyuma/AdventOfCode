def solve(file):
  data = [*map(int, open(file).read().split())]
  left, right = sorted(data[0::2]), sorted(data[1::2])
  p1 = sum(map(lambda a, b: abs(a - b), left, right))
  p2 = sum(map(lambda a: a * right.count(a), left))
  return p1, p2

print(solve('example.txt'))
print(solve('input.txt'))