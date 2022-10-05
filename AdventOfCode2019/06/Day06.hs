module Main where

import qualified Data.Map as Map
import Input (orbits)

toMap = Map.fromListWith (++) . map (\(x, y) -> (x, [y]))

paths :: [Char] -> [[Char]] -> Map.Map [Char] [[Char]] -> Map.Map [Char] [[Char]] -> Map.Map [Char] [[Char]]
paths x path orbits out = result
  where
    directOrbits = Map.lookup x orbits
    withCurrent = Map.insert x path out
    result = case directOrbits of
      Nothing -> withCurrent
      Just connections -> foldr (\y acc -> paths y (x : path) orbits acc) withCurrent connections

-- Part 1
orbitsMap = toMap orbits

distances = paths "COM" [] orbitsMap Map.empty

part1 = sum $ map length $ Map.elems distances

-- Part 2
pathTo x m = case Map.lookup x m of
  Just p -> reverse (x : p)
  Nothing -> error "No path"

youPath = pathTo "YOU" distances

santaPath = pathTo "SAN" distances

aToBPath s a@(x : xs) b@(y : ys) = if x == y then aToBPath x xs ys else reverse a ++ [s] ++ b
aToBPath _ _ _ = error "No common"

youToSanta = aToBPath "" youPath santaPath

part2 = length youToSanta - 2 - 1

main = do
  print part1
  print part2