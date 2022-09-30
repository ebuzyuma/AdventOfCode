from = 271973

to = 785961

hasDouble (x : y : ys) = (x == y) || hasDouble (y : ys)
hasDouble _ = False

isIncrease (x : y : ys) = y >= x && isIncrease (y : ys)
isIncrease _ = True

p1conditions x = all ($ x) [isIncrease, hasDouble]

passwords = filter p1conditions $ map show [from..to]

part1 = length passwords

hasDoubleAlone (x : y : z : zs) = (x == y && y /= z) || if x == y then hasDoubleAlone $ dropWhile (== x) zs else hasDoubleAlone (y : z :zs)
hasDoubleAlone [x, y] = x == y
hasDoubleAlone _ = False

part2 = length $ filter hasDoubleAlone passwords

main = do
  print part1
  print part2