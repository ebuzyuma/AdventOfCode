module Main where

import Data.List (transpose)
import qualified Data.Set as S

-- <x=14, y=2, z=8>
-- <x=7, y=4, z=10>
-- <x=1, y=17, z=16>
-- <x=-4, y=-1, z=1>

planets =
  [ ([14, 2, 8], [0, 0, 0]),
    ([7, 4, 10], [0, 0, 0]),
    ([1, 17, 16], [0, 0, 0]),
    ([-4, -1, 1], [0, 0, 0])
  ]

applyGravityAxis x1 x2
  | x1 == x2 = 0
  | x1 < x2 = 1
  | otherwise = -1

applyGravityOne (p, v) ps = (p, map sum $ transpose $ v : map (zipWith applyGravityAxis p) ps)

applyGravity ps = [applyGravityOne p1 px | p1 <- ps]
  where
    px = map fst ps

applyVelocity (p, v) = (zipWith (+) p v, v)

step = map applyVelocity . applyGravity

steps ps = ps : map step (steps ps)

steps2 ps = scanl (\acc i -> step acc) ps [1 ..]

nsteps n ps = foldl (\acc i -> step acc) ps [1 .. n]

pot (p, v) = sum $ map abs p

kin (p, v) = sum $ map abs v

energy pl = pot pl * kin pl

systemState = sum . map energy

test1 =
  [ ([-1, 0, 2], [0, 0, 0]),
    ([2, -10, -7], [0, 0, 0]),
    ([4, -8, 8], [0, 0, 0]),
    ([3, 5, -1], [0, 0, 0])
  ]

test2 =
  [ ([-8, -10, 0], [0, 0, 0]),
    ([5, 5, 10], [0, 0, 0]),
    ([2, -7, 3], [0, 0, 0]),
    ([9, -8, -3], [0, 0, 0])
  ]

part1 = sum . map energy $ steps planets !! 1000

--takeUntilDuplicateSet :: Num a => [[([a], [a])]] -> S.Set a

takeUntilCircle axis pl = pl : takeWhile (\x -> getXs x /= firstXs) (tail $ steps2 pl)
  where
    getXs p = (map ((!! axis) . fst) p, map ((!! axis) . snd) p)
    firstXs = getXs pl

fullCircle pl = lcm x $ lcm y z
  where
    x = length $ takeUntilCircle 0 pl
    y = length $ takeUntilCircle 1 pl
    z = length $ takeUntilCircle 2 pl

part2 = length $ takeUntilCircle 0 planets

--test = S.size $ takeUntilDuplicateSet $ map (!! 0) $ take 1000 $ steps test1

main = do
  print part1
