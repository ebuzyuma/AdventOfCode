import Data.List (intersect, isSubsequenceOf)
import Data.List.Split (splitWhen)

rangeToList s = [left, left + 1 .. right]
  where
    [left, right] = map (\x -> read x :: Int) $ splitWhen (== '-') s

contains line = if isSubsequenceOf elf1 elf2 || isSubsequenceOf elf2 elf1 then 1 else 0
  where
    [elf1, elf2] = map rangeToList $ splitWhen (== ',') line

intersect' line = if not (null common) then 1 else 0
  where
    [elf1, elf2] = map rangeToList $ splitWhen (== ',') line
    common = elf1 `intersect` elf2

main = do
  content <- readFile "input.txt"
  print $ sum . map contains $ lines content
  print $ sum . map intersect' $ lines content