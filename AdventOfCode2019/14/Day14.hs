import Data.List (find)
import Data.List.Split (splitOn)
import Data.Maybe (fromJust, fromMaybe, isNothing)
import qualified Data.Map as M
import GHC.Integer (floatFromInteger)

type Chemical = (String, Integer) -- name, quantity

toChemical :: [Char] -> Chemical
toChemical s = let [quantity, name] = splitOn " " s in (name, read quantity :: Integer)

parseReaction :: [Char] -> (Chemical, [Chemical])
parseReaction s = (toChemical right, inputs)
  where
    [left, right] = splitOn " => " s
    inputs = map toChemical $ splitOn ", " left

parseReactions s =
  let xs = lines s in [parseReaction x | x <- xs]

findForReplace :: [Chemical] -> Maybe Chemical
findForReplace = find (\(n, q) -> n /= "ORE" && q > 0)

reduce' :: [(Chemical, [Chemical])] -> [Chemical] -> Integer
reduce' reactions requirements
  | isNothing replace = snd $ fromJust ore
  | otherwise = reduce' reactions newRequirements
  where
    replace = findForReplace requirements
    ore = find (\(n, _) -> n == "ORE") requirements
    Just (chemical, quantity) = replace
    Just ((rChemical, rQuantity), rInput) = find (\((n, _), _) -> n == chemical) reactions
    (quot, rem) = quotRem quantity rQuantity
    applyCount = if rem > 0 then quot + 1 else quot
    reactionOutput = rQuantity * applyCount
    toAdd = map (\(n, q) -> (n, q * applyCount)) rInput
    n1 = foldl (\acc (n, q) -> M.insertWith (+) n q acc) (M.fromList requirements) toAdd
    n2 = M.insertWith (flip (-)) chemical reactionOutput n1 
    newRequirements = M.toList n2

maximizeFuel :: [(Chemical, [Chemical])] -> t -> Integer -> Float -> Float -> Float
maximizeFuel reactions orePerFuel oreLimit low high
  | low > high = low
  | otherwise = maximizeFuel reactions orePerFuel oreLimit low1 high1
  where
    mid = ceiling $ (low + high) / 2
    midF = fromIntegral mid
    requiredOre = reduce' reactions [("FUEL", mid)]
    [low1, high1] = if requiredOre > oreLimit then [low, midF - 1] else [midF, high]

part1 reactions = reduce' reactions [("FUEL", 1)]

part2 reactions orePerFuel = maximizeFuel reactions orePerFuel oreLimit (fromIntegral low) (fromIntegral high)
  where
    oreLimit = 1000000000000
    low = oreLimit `div` orePerFuel
    high = 3000000

main = do
  content <- readFile "input"
  let reactions = parseReactions content
  let p1 = part1 reactions 
  print p1
  print $ part2 reactions p1