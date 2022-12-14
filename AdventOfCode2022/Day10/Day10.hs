import Data.List.Split (chunksOf)

parseAddx line = read (last . words $ line) :: Int

cycleX (x1, _) line = if line == "noop" then (x1, [x1]) else (x1 + parseAddx line, replicate 2 x1)

signalStrength xs i = i * xs !! (i - 1)

draw xs size i = if abs ((xs !! i) - (i `mod` size)) <= 1 then '█' else ' '

main = do
  content <- readFile "input.txt"
  let cycles = concatMap snd $ scanl cycleX (1, []) (lines content)

  let p = [20, 60, 100, 140, 180, 220]
  let part1 = sum $ map (signalStrength cycles) p
  print part1

  let size = 40
  let part2 = map (draw cycles size) [0 .. length cycles - 1]
  putStr $ unlines (chunksOf size part2)
