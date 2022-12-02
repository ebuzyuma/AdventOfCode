import Data.List.Split (splitWhen)
import Data.List (sort)

elfToInt x
  | x == 'A' = 1 
  | x == 'B' = 2 
  | x == 'C' = 3 
  | otherwise = error "Unexpected"

meToInt x
  | x == 'X' = 1 
  | x == 'Y' = 2 
  | x == 'Z' = 3 
  | otherwise = error "Unexpected"

score1 [elf, _, me]
  | a == b = b + 3
  | b - a == 1 = b + 6
  | b == 1 && a == 3 = b + 6
  | otherwise = b
  where
    a = elfToInt elf
    b = meToInt me
score1 x = error "invalid input"

meToInt2 elf me
  | me == 'X' = if elf == 1 then 3 else elf - 1
  | me == 'Y' = elf
  | otherwise = if elf == 3 then 1 else elf + 1

score2 [elf, _, me]
  | a == b = b + 3
  | b - a == 1 = b + 6
  | b == 1 && a == 3 = b + 6
  | otherwise = b
  where
    a = elfToInt elf
    b = meToInt2 a me
score2 x = error "invalid input"

main = do
  content <- readFile "input.txt"
  -- part 1
  let totalScore1 = sum . map score1 $ lines content  
  print totalScore1

  -- part 2
  let totalScore2 = sum . map score2 $ lines content
  print totalScore2
