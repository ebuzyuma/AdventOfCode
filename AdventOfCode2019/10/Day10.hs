module Main where

import Data.Function (on)
import Data.List (elemIndices, groupBy, maximumBy, minimumBy, sortOn)
import Data.Ord (comparing)
import qualified Data.Set as Set
import Input (asteroidsMap)

test1 =
  [ ".#..#",
    ".....",
    "#####",
    "....#",
    "...##"
  ]

type Pos = (Int, Int)

findAsteroids :: [[Char]] -> [Pos]
findAsteroids m = foldr rowToVector [] rows
  where
    rows = zip [0 :: Int ..] m
    rowToVector (y, row) acc = [(x, y) | x <- elemIndices '#' row] ++ acc

vSubtract :: Pos -> Pos -> Pos
vSubtract (x1, y1) (x2, y2) = (x1 - x2, y1 - y2)

vAdd :: Pos -> Pos -> Pos
vAdd (x1, y1) (x2, y2) = (x1 + x2, y1 + y2)

vLength :: Floating a => Pos -> a
vLength (x, y) = let p = x * x + y * y in sqrt $ fromIntegral p

vMin v1 v2 = if vLength v1 < vLength v2 then v1 else v2

pseudoNorm :: Pos -> Pos
pseudoNorm (x, y) =
  let vl = gcd x y
   in (x `div` vl, y `div` vl)

isParallel :: Pos -> Pos -> Bool
isParallel (x1, y1) (x2, y2) = x1 * y2 == y1 * x2

isSameDirection :: Pos -> Pos -> Bool
isSameDirection (x1, y1) (x2, y2) = x1 * x2 >= 0 && y1 * y2 >= 0

visibleFromPoint :: Pos -> [Pos] -> Set.Set Pos
visibleFromPoint p asteroids = Set.fromList t
  where
    nonPoint = filter (/= p) asteroids
    vectors = map (`vSubtract` p) nonPoint
    t = foldl addVisibleAsteroid [] vectors
    addVisibleAsteroid (acc@a : as) x =
      if isSameDirection a x && isParallel a x
        then vMin a x : as
        else a : addVisibleAsteroid as x
    addVisibleAsteroid [] x = [x]

maximizeVisiblePoints :: [Pos] -> (Pos, Set.Set Pos)
maximizeVisiblePoints asteroids = maximumBy (comparing (Set.size . snd)) visibleMap
  where
    visibleMap = [(a, visibleFromPoint a asteroids) | a <- asteroids]

part1 = maximizeVisiblePoints . findAsteroids $ asteroidsMap

-- Part 2
laserPosition = fst part1

laserAsteroids = snd part1

dotProduct (x1, y1) (x2, y2) = x1 * x2 + y1 * y2

angle :: Floating a => Pos -> Pos -> a
angle v1 v2 =
  let p = fromIntegral $ dotProduct v1 v2
      cv = p / vLength v1 / vLength v2
   in 180 / pi * acos cv

angleFromUp :: Floating a => Pos -> a
angleFromUp v = if fst v >= 0 then angle (0, -1) v else 180 + angle (0, 1) v

sortFromUp = sortOn angleFromUp

cleanOrder = sortFromUp $ Set.toList laserAsteroids

part2 = laserPosition `vAdd` (cleanOrder !! 199)

main = do
  print $ fst part1
  print $ Set.size $ snd part1
  print part2
