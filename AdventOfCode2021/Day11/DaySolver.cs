namespace AdventOfCode2021.Day11
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "11";

        protected override (string, string) Solve(string[] input)
        {
            var grid = input.Select(x => x.Select(y => int.Parse(y.ToString())).ToList()).ToList();
            var neighbours = new List<(int, int)>
            {
                (-1, -1),
                (-1, 0),
                (-1, +1),
                (0, -1),
                (0, +1),
                (1, -1),
                (1, 0),
                (1, +1),
            };

            int totalFlashes = 0;
            int n = 0;
            bool allFlash = false;
            while (!allFlash)
            {
                n++;
                //Print(grid);

                int stepFlashes = 0;
                for (int i = 0; i < grid.Count; i++)
                {
                    for (int j = 0; j < grid[i].Count; j++)
                    {
                        grid[i][j]++;
                    }
                }

                while(grid.SelectMany(x => x).Any(x => x > 9))
                {
                    for (int i = 0; i < grid.Count; i++)
                    {
                        for (int j = 0; j < grid[i].Count; j++)
                        {
                            if (grid[i][j] > 9)
                            {
                                totalFlashes++;
                                stepFlashes++;
                                grid[i][j] = 0;
                                neighbours.ForEach(x => IncreaseNeighbour(grid, i, j, x.Item1, x.Item2));
                            }
                        }
                    }
                }
                if (stepFlashes == 100)
                {
                    allFlash = true;
                }
            }

            return (totalFlashes.ToString(), n.ToString());
        }

        private void Print(List<List<int>> grid)
        {
            for (int i = 0; i < grid.Count; i++)
            {
                for (int j = 0; j < grid[i].Count; j++)
                {
                    Console.Write(grid[i][j]);
                }
                Console.WriteLine();
            }
            Console.WriteLine();
        }

        private void IncreaseNeighbour(List<List<int>> grid, int i, int j, int iDir, int jDir)
        {
            if (i + iDir < 0 || j + jDir < 0
                || i + iDir >= grid.Count || j + jDir >= grid[i].Count)
            {
                return;
            }
            if (grid[i + iDir][j + jDir] != 0)
            {
                grid[i + iDir][j + jDir]++;
            }
        }
    }
}
