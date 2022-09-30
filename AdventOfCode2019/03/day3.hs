import Data.List (elemIndex)
import Data.Maybe (isNothing, catMaybes)
import Input (wire1, wire2)
import qualified Data.Map as M

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

fullPath x = M.fromListWith min . flip zip [1 ..] $ pathPoints (0, 0) x

wire1Path = fullPath wire1

wire2Path = fullPath wire2

intersect :: Eq a => [a] -> [a] -> [a]
intersect [] _ = []
intersect _ [] = []
intersect xs ys = filter (`elem` xs) ys

intersection = foldr1 M.intersection [wire1Path, wire2Path]

manhattanDistance (x, y) = abs x + abs y

part1 = minimum . map manhattanDistance . M.keys $ M.intersection wire1Path wire2Path

part2 = minimum . M.elems $ M.intersectionWith (+) wire1Path wire2Path

main = do
  print intersection
  print part1
  print part2
