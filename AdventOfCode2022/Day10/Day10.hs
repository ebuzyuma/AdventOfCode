import Data.List.Split (chunksOf)
import Data.Bool (bool)

parseInstruction :: String -> [Int]
parseInstruction = addition . words
  where 
    addition ["noop"] = [0]
    addition ["addx", count] = [0, read count]
    addition x = error "invalid input format"

parseInstructions :: String -> [Int]
parseInstructions = scanl (+) 1 . concatMap parseInstruction . lines

signalStrength :: [Int] -> Int -> Int
signalStrength xs i = i * xs !! (i - 1)

part1 :: String -> String
part1 =
  show 
    . sum
    . flip map [20, 60, 100, 140, 180, 220]
    . signalStrength
    . parseInstructions

isVisible :: (Ord a, Num a) => a -> a -> Bool
isVisible index value = abs (value - index) <= 1

part2 :: Int -> String -> String
part2 size = 
  unlines 
    . chunksOf size
    . map (bool ' ' '█')
    . zipWith isVisible (cycle [0..size-1])
    . parseInstructions

main :: IO ()
main = do
  content <- readFile "input.txt"

  print $ part1 content

  putStr $ part2 40 content
