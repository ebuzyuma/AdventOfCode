import Data.List.Split (splitWhen)
import Data.List (sort)

toInt x = read x :: Integer
sum' = sum . map toInt

main = do
  content <- readFile "input.txt"
  let calories = reverse . sort . map sum' . splitWhen (=="") $ lines content
  
  -- part 1
  print $ head calories

  -- part 2
  print $ sum . take 3 $ calories