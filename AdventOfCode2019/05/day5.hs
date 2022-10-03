module Main where

import Input (program)

replaceAt pos list newValue =
  let (start, end) = splitAt pos list in start ++ [newValue] ++ tail end

execCommand input output i list
  | code == 1 = (output, i + 4, replaceAt updatePos list (arg1 + arg2))
  | code == 2 = (output, i + 4, replaceAt updatePos list (arg1 * arg2))
  | code == 3 = (output, i + 2, replaceAt p1 list input)
  | code == 4 = (arg1 : output, i + 2, list)
  | code == 5 = (output, if arg1 /= 0 then arg2 else i + 3, list)
  | code == 6 = (output, if arg1 == 0 then arg2 else i + 3, list)
  | code == 7 = (output, i + 4, replaceAt updatePos list (if arg1 < arg2 then 1 else 0))
  | code == 8 = (output, i + 4, replaceAt updatePos list (if arg1 == arg2 then 1 else 0))  
  | code == 99 = (output, -1, list)
  | otherwise = error $ "Invalid code " ++ show code
  where
    fullCode = list !! i
    code = fullCode `mod` 100
    test = fromIntegral fullCode / 100
    p1mode = flip mod 10 $ floor (fromIntegral fullCode / 100)
    p2mode = flip mod 10 $ floor (fromIntegral fullCode / 1000)
    (pos1, pos2, pos3) = (i + 1, i + 2, i + 3)
    (p1, p2, p3) = (list !! pos1, list !! pos2, list !! pos3)
    arg1 = if p1mode == 1 then p1 else list !! p1
    arg2 = if p2mode == 1 then p2 else list !! p2
    updatePos = p3

execProgram input output pos list
  | nextPos == -1 = output
  | otherwise = execProgram input nextOutput nextPos nextList
  where
    (nextOutput, nextPos, nextList) = execCommand input output pos list

execFullProgram input = execProgram input [] 0

part1 = head $ execFullProgram 1 program

part2 = head $ execFullProgram 5 program

main = do
  print part1
  print part2
