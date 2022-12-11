import Data.List (nub)

dirToCoords "R" = (1, 0)
dirToCoords "L" = (-1, 0)
dirToCoords "U" = (0, 1)
dirToCoords "D" = (0, -1)
dirToCoords x = error ("Invalid dir " ++ x)

type Position = (Int, Int)

parseLine :: [Char] -> [Position]
parseLine line = replicate p $ dirToCoords dir
  where
    [dir, s] = words line
    p = read s :: Int

parseInput :: String -> [Position]
parseInput = concatMap parseLine . lines

headPath :: [(Int, Int)] -> [(Int, Int)]
headPath = scanl moveHead (0, 0)
  where
    moveHead (x, y) (dx, dy) = (x + dx, y + dy)

stepSize x1 x2 = if abs dx > 1 then signum dx else 0
  where dx = x2 - x1
move (x, y) (xh, yh) = (x + dx', y + dy')
  where
    dx = xh - x
    dy = yh - y
    (dx', dy') = if abs dx > 1 || abs dy > 1 then (signum dx, signum dy) else (0, 0)

knotPath = tail . scanl move (0, 0)

part1 :: String -> Int
part1 = length . nub . knotPath . headPath . parseInput

nthKnotPath n = (!!n) . iterate knotPath

part2 = length . nub . nthKnotPath 9 . headPath . parseInput

main = do
  content <- readFile "input.txt"
  print $ part1 content
  print $ part2 content