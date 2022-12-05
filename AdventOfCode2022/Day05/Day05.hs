import Data.List.Split (splitWhen)

stacks =
  [ "QWPSZRHD",
    "VBRWQHF",
    "CVSH",
    "HFG",
    "PGJBZ",
    "QTJHWFL",
    "ZTWDLVJN",
    "DTZCJGHF",
    "WPVMBH"
  ]

parseMove s =
  let [_, quantity, _, from, _, to] = words s
   in (read quantity, read from, read to) :: (Int, Int, Int)

move stacks (quantity, from, to)
  | quantity == 0 = stacks
  | otherwise = move newStacks (quantity - 1, from, to)
  where
    crate = last . snd $ stacks !! (from - 1)
    newStacks = map moveCrate stacks
    moveCrate (i, stack)
      | i == from = (i, init stack)
      | i == to = (i, stack ++ [crate])
      | otherwise = (i, stack)

move2 stacks (quantity, from, to) = newStacks
  where
    (_, fromStack) = stacks !! (from - 1)
    fromNewLength = length fromStack - quantity
    crate = drop fromNewLength fromStack
    newStacks = map moveCrates stacks
    moveCrates (i, stack)
      | i == from = (i, take fromNewLength stack)
      | i == to = (i, stack ++ crate)
      | otherwise = (i, stack)

main = do
  content <- readFile "input.txt"
  let movesStr = last . splitWhen (== "") $ lines content
  let moves = map parseMove movesStr
  let stacksT = zip [1,2 .. length stacks] stacks
  let part1 = foldl move stacksT moves
  print $ map (last . snd) part1

  let part2 = foldl move2 stacksT moves  
  print $ map (last . snd) part2
