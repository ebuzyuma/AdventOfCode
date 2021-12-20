namespace AdventOfCode2020.Day24
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "24";

        protected override (string part1, string part2) Solve(string[] input)
        {
            var directions = new string[] { "e", "se", "sw", "w", "nw", "ne" };

            var dirChange = new (int x, int y)[] { (2, 0), (1, -1), (-1, -1), (-2, 0), (-1, 1), (1, 1) };

            // Part 1
            var result = new List<(int x, int y)>();
            foreach (var tile in input)
            {
                var pos = ParseTile(tile, directions, dirChange);
                result.Add(pos);
            }

            var group = result.GroupBy(x => x).ToList();
            var black = group.Where(x => x.Count() % 2 == 1).ToList();

            // Part 2
            var floor = group.ToDictionary(k => k.Key, v => v.Count() % 2 == 1);
            floor = ExtendWithWhite(floor, dirChange);
            for (int i = 0; i < 100; i++)
            {
                floor = Flip(floor, dirChange);
                floor = ExtendWithWhite(floor, dirChange);
                Console.WriteLine($"{i}: {floor.Count(x => x.Value)}");
            }

            return (black.Count.ToString(), floor.Count(x => x.Value).ToString());
        }

        private void Print(Dictionary<(int x, int y), bool> floor)
        {
            var minX = floor.Min(p => p.Key.x);
            var maxX = floor.Max(p => p.Key.x);
            var minY = floor.Min(p => p.Key.y);
            var maxY = floor.Max(p => p.Key.y);

            for (int y = minY; y <= maxY; y++)
            {
                for (int x = minX; x <= maxX; x++)
                {
                    if (floor.TryGetValue((x,y), out var isBlack))
                    {
                        Console.Write(isBlack ? "#" : ".");
                    }
                    else
                    {
                        Console.Write(" ");
                    }
                }
                Console.WriteLine();
            }
            Console.WriteLine();
        }

        private Dictionary<(int x, int y), bool> ExtendWithWhite(Dictionary<(int x, int y), bool> floor, (int x, int y)[] dirChange)
        {
            var next = new Dictionary<(int x, int y), bool>();
            foreach (var currentTile in floor)
            {
                next.Add(currentTile.Key, currentTile.Value);
                for (int i = 0; i < dirChange.Length; i++)
                {
                    var p = (currentTile.Key.x + dirChange[i].x, currentTile.Key.y + dirChange[i].y);
                    if (!floor.ContainsKey(p) && currentTile.Value && !next.ContainsKey(p))
                    {
                        // to extend the floor add adjacent white tile if current is black
                        next.Add(p, false);
                    }
                }
            }

            return next;
        }

        private Dictionary<(int x, int y), bool> Flip(Dictionary<(int x, int y), bool> floor, (int x, int y)[] dirChange)
        {
            var next = new Dictionary<(int x, int y), bool>();
            foreach (var currentTile in floor)
            {
                int blackCount = 0;
                for (int i = 0; i < dirChange.Length; i++)
                {
                    var p = (currentTile.Key.x + dirChange[i].x, currentTile.Key.y + dirChange[i].y);
                    if (floor.TryGetValue(p, out var isBlack))
                    {
                        blackCount += (isBlack ? 1 : 0);
                    }
                    else if (currentTile.Value && !next.ContainsKey(p))
                    {
                        // to extend the floor add adjacent white tile if current is black
                        next.Add(p, false);
                    }
                }
                if (currentTile.Value)
                {
                    // black
                    next[currentTile.Key] = blackCount != 0 && blackCount <= 2;
                }
                else
                {
                    // white
                    next[currentTile.Key] = blackCount == 2;
                }
            }

            return next;
        }

        private (int x, int y) ParseTile(string tile, string[] directions, (int x, int y)[] dirChange)
        {
            int x = 0, y = 0;
            while (tile.Length > 0)
            {
                for (int i = 0; i < directions.Length; i++)
                {
                    if (tile.StartsWith(directions[i]))
                    {
                        tile = tile.Substring(directions[i].Length);
                        x += dirChange[i].x;
                        y += dirChange[i].y;
                        break;
                    }
                }
            }

            return (x, y);
        }
    }
}
