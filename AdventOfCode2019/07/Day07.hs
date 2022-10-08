module Main where

import Input (optcode)

replaceAt pos list newValue =
  let (start, end) = splitAt pos list in start ++ [newValue] ++ tail end

execCommand input output i list
  | code == 1 = (input, output, i + 4, replaceAt updatePos list (arg1 + arg2))
  | code == 2 = (input, output, i + 4, replaceAt updatePos list (arg1 * arg2))
  | code == 3 = if null input then (input, output, i, list) else (tail input, output, i + 2, replaceAt p1 list $ head input)
  | code == 4 = (input, arg1 : output, i + 2, list)
  | code == 5 = (input, output, if arg1 /= 0 then arg2 else i + 3, list)
  | code == 6 = (input, output, if arg1 == 0 then arg2 else i + 3, list)
  | code == 7 = (input, output, i + 4, replaceAt updatePos list (if arg1 < arg2 then 1 else 0))
  | code == 8 = (input, output, i + 4, replaceAt updatePos list (if arg1 == arg2 then 1 else 0))
  | code == 99 = (input, output, 0, list)
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
  | nextPos == 0 = (nextPos, output)
  | nextPos == pos = (pos, output)
  | otherwise = execProgram nextInput nextOutput nextPos nextList
  where
    (nextInput, nextOutput, nextPos, nextList) = execCommand input output pos list

execAmp program =
  foldl
    (\acc s -> let (_, output) = execProgram (s : acc) [] 0 program in output)
    [0]

generateAmpSettings list
  | length list == 1 = [list]
  | otherwise = [x : xs | x <- list, xs <- generateAmpSettings [y | y <- list, y /= x]]

maximize program = maximum outputs
  where
    settings = generateAmpSettings [0 .. 4]
    outputs = [execAmp program s | s <- settings]

part1 = maximize optcode

-- execAmpWithFeedbackLoop amps input useSettingsAsInput
--   | ampNo == length positions - 1 && newPositions !! ampNo == 0 = last ampOutput
--   | otherwise = 1
--   where
--     newAmps =
--       tail scanl
--         (\acc@(_, _, _, input) amp@(program, s, p, _) -> let (newPos, output) = execProgram (if useSettingsAsInput then s:input else input) [] program in ())
--         ([], 0, 0, input)
--         amps

-- maximizeWithFeedbackLoop program = maximum outputs
--   where
--     settings = generateAmpSettings [5 .. 9]
--     outputs = [execAmpWithFeedbackLoop [(program, s !! i, 0, []) | i <- [0..4]] [0] True | s <- settings]

main = do
  print part1
  -- print $ maximizeWithFeedbackLoop optcode
