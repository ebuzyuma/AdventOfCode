import functools

def solve(file):  
  data = open(file).read()
  rules_input, updates_input = data.split('\n\n')
  rules = { tuple(line.split('|')) for line in rules_input.splitlines() }
  updates = (line.split(",") for line in updates_input.splitlines())

  def compare(a, b):
    return -1 if (a,b) in rules else 1 if (b, a) in rules else 0
  
  p1 = 0
  p2 = 0
  for update in updates:
    new = sorted(update, key=functools.cmp_to_key(compare))
    if (new == update):
      p1 += int(new[len(new) // 2])
    else:      
      p2 += int(new[len(new) // 2])
      
  return p1, p2
  
print(solve('example.txt'))
print(solve('input.txt'))