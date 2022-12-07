import qualified Data.Map as M

data Entry = Dir [String] | File Int deriving (Show, Eq)

-- fs = Map pwd [Entry]
parseCmd (fs, pwd) ["$", "ls"] = (fs, pwd)
parseCmd (fs, pwd)  ["$", "cd", ".."] = (fs, tail pwd)
parseCmd (fs, pwd) ["$", "cd", dir] = let p = dir:pwd in (M.insert p [] fs, p)
parseCmd (fs, pwd) ["dir", name] = (M.adjust (Dir (name : pwd) :) pwd fs, pwd)
parseCmd (fs, pwd) [size, name] = (M.adjust (File (read size) :) pwd fs, pwd)
parseCmd _         cmd = error $ "Invalid command: " ++ unwords cmd

dirSize fs = sum . map entrySize
  where
    entrySize (Dir dir) = dirSize fs (fs M.! dir)
    entrySize (File f) = f

buildFs cmds = let (fs, _) = foldl parseCmd (M.empty, []) cmds in M.map (dirSize fs) fs

part1 = sum . filter (<= 100000) . M.elems

part2 fs = minimum . filter (>= toFree) . M.elems $ fs
  where
    fsSize = fs M.! ["/"]
    toFree = fsSize - (70000000 - 30000000)

main = do
  content <- readFile "input.txt"
  let sizes = buildFs . map words . lines $ content
  print $ part1 sizes
  print $ part2 sizes
