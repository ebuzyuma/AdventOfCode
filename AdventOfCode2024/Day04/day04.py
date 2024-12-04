import re

def solve(file):  
  data = open(file).readlines()
  g = { (x, y): c
       for y, r in enumerate(data)
       for x, c in enumerate(r.strip())       
  }
  xh, yh = max(g.keys())
  p1 = sum("XMAS" == "".join(g.get((x + dx * n, y + dy * n), "")
                             for n in range(4))
           for y in range(yh + 1)
           for x in range(xh + 1)
           for dx in (-1, 0, 1)
           for dy in (-1, 0, 1))

  xmas = ( "MAS", "SAM" )
  p2 = sum("".join(g.get((x + dx, y + dy), "")
                   for dx, dy in [(-1,-1), (0,0), (1,1)]) in xmas and
           "".join(g.get((x + dx, y + dy), "")
                   for dx, dy in [(-1,1), (0,0), (1,-1)]) in xmas
           for y in range(yh + 1)
           for x in range(xh + 1))
  return p1, p2

print(solve('example.txt'))
print(solve('input.txt'))