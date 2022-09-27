import Data.List (elemIndex)
import Data.Maybe (isNothing, catMaybes)
import Input (wire1, wire2)

--import qualified Data.HashSet as HashSet

move :: (Integral a) => (a, a) -> (Char, a) -> [(a, a)]
move (x, y) (dir, steps)
  | dir == 'L' = [(x - i, y) | i <- [1 .. steps]]
  | dir == 'R' = [(x + i, y) | i <- [1 .. steps]]
  | dir == 'U' = [(x, y + i) | i <- [1 .. steps]]
  | dir == 'D' = [(x, y - i) | i <- [1 .. steps]]
  | otherwise = error "Wrong rule"

pathPoints :: Integral a => (a, a) -> [(Char, a)] -> [(a, a)]
pathPoints _ [] = []
pathPoints pos (x : xs) = let path = move pos x in path ++ pathPoints (last path) xs

fullPath x = (0,0) : pathPoints (0,0) x

wire1Path = fullPath wire1

wire2Path = fullPath wire2

intersect :: Eq a => [a] -> [a] -> [a]
intersect [] _ = []
intersect _ [] = []
intersect xs ys = filter (`elem` xs) ys

intersection = wire1Path `intersect` wire2Path

manhattanDistance (x, y) = abs x + abs y

part1 = minimum [manhattanDistance p | p <- intersection, p /= (0, 0)]

timingDistance pos = sum (catMaybes [pos1, pos2])
  where
    pos1 = elemIndex pos wire1Path
    pos2 = elemIndex pos wire2Path

part2 = minimum [timingDistance p | p <- intersection, p /= (0,0)]

main = do
  print intersection
  print part1
  print part2
