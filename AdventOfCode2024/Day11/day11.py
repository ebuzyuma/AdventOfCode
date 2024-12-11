from functools import cache

@cache
def solve(n, steps):
    if steps == 0: 
      return 1
    if n == '0':
      return solve('1', steps-1)
    elif (size := len(n)) % 2 == 0:
        return sum(solve(x, steps-1) 
                   for x in [str(int(str(x))) for x in (n[:size//2], n[size//2:])])
    return solve(str(int(n) * 2024), steps-1)

print(sum(solve(n, steps=25) for n in open('input.txt').read().split()))
print(sum(solve(n, steps=75) for n in open('input.txt').read().split()))