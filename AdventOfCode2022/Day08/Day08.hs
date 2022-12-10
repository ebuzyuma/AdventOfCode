getValue grid row col = grid !! row !! col

up grid row col = map (flip (getValue grid) col) [row - 1, row - 2 .. 0]

down grid row col = map (flip (getValue grid) col) [row + 1 .. length grid - 1]

right grid row col = map (getValue grid row) [col + 1 .. length (head grid) - 1]

left grid row col = map (getValue grid row) [col - 1, col - 2 .. 0]

isVisibleFromEdge grid row col = any isVisible ffs
  where
    tree = getValue grid row col
    isVisible f = all (< tree) (f grid row col)
    ffs = [up, down, left, right]

scenicScore grid row col = product $ map visible vvs
  where
    tree = getValue grid row col    
    visible f = if length xs == v then v else v + 1
      where
        xs = f grid row col
        v = length $ takeWhile (<tree) xs
    vvs = [up, down, left, right]

toInt x = read [x] :: Int

map' f g = map f' [0 .. t -1]
  where
    h = length g
    w = length $ head g
    t = h * w
    f' i = f g (i `div` h) (i `mod` h)

main = do
  content <- readFile "input.txt"
  let g = map (map toInt) (lines content)
  let vg = map' isVisibleFromEdge g
  print $ length $ filter (==True) vg
  let sg = map' scenicScore g
  print $ maximum sg