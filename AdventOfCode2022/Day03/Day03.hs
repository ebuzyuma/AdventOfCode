import Data.List (intersect)
import Data.Char (ord, isLower)
import Data.List.Split (chunksOf)

score x = if isLower x then 1 + ord x - ord 'a' else 27 + ord x - ord 'A'

part1 = sum . map (score . head . intersect' . split') . lines
  where
    split' x = splitAt (length x `div` 2) x
    intersect' (a, b) = a `intersect` b

part2 = sum . map (score . head . intersect') . chunksOf 3 . lines
  where
    intersect' arr = foldl1 intersect arr

main = do
  content <- readFile "input.txt"
  print $ part1 content
  print $ part2 content