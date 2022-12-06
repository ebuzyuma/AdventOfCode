import qualified Data.Set as Set

firstStartMarker x d i = if (Set.size . Set.fromList . take d $ x) == d then i + d else firstStartMarker (tail x) d i + 1

main = do
  content <- readFile "input.txt"
  
  print $ firstStartMarker content 4 0
  print $ firstStartMarker content 14 0
