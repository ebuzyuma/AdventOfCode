module Main where

import Input (digits)
import Data.List (minimumBy)
import Data.List.Split (chunksOf)
import Data.Ord (comparing)

type Layer = String

formatLayer :: Int -> String -> String
formatLayer _ [] = []
formatLayer w list =
  let
    (x, xs) = splitAt w list
    p = map (\t -> if t == '1' then '#' else ' ') x
   in p ++ "\n" ++ formatLayer w xs

count x = length . filter (== x)

part1 :: Int -> Int -> String -> Int
part1 w h digits = count '1' minLayer * count '2' minLayer
  where
    layersList = chunksOf (w*h) digits
    minLayer = minimumBy (comparing (count '0')) layersList

addLayer :: Layer -> Layer -> Layer
addLayer layer1 layer2 =
  [if i1 == '2' then i2 else i1 | (i1, i2) <- zip layer1 layer2]

part2 :: Int -> Int -> String -> Layer
part2 w h digits = image
  where
    layersList = chunksOf (w * h) digits
    image = foldl1 addLayer layersList

main = do
  print $ part1 25 6 digits
  putStr $ formatLayer 25 $ part2 25 6 digits