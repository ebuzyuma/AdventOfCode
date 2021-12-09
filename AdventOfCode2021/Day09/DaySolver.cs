namespace AdventOfCode2021.Day09
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "09";

        protected override string Solve(string[] input)
        {
            // Idea part 2:
            // Explore neighbours recursively, go only to ones that were not added already
            var numbers = input.Select(x => x.ToList().Select(x => int.Parse(x.ToString())).ToList()).ToList();

            var basins = new List<HashSet<string>>();
            for (int i = 0; i < numbers.Count; i++)
            {
                for (int j = 0; j < numbers[i].Count; j++)
                {
                    var value = numbers[i][j];
                    var up = GetNeighbour(numbers, i, j, -1, 0);
                    var down = GetNeighbour(numbers, i, j, 1, 0);
                    var right = GetNeighbour(numbers, i, j, 0, -1);
                    var left = GetNeighbour(numbers, i, j, 0, 1);
                    if ((!left.HasValue || left > value)
                        && (!right.HasValue || right > value)
                        && (!up.HasValue || up > value)
                        && (!down.HasValue || down > value))
                    {
                        // Part 1
                        // sum += value + 1;

                        // Part 2
                        var set = FindBassin(numbers, i, j);
                        basins.Add(set);
                    }
                }
            }

            // return sum.ToString();

            var max = basins.OrderByDescending(x => x.Count).Take(3).ToList();
            var multi = max.Aggregate(1, (r, s) => r *= s.Count);
            return multi.ToString();
        }

        private HashSet<string> FindBassin(List<List<int>> numbers, int i, int j)
        {
            var basin = new HashSet<string>();
            basin.Add($"{i}_{j}");
            Explore(numbers, i, j, basin);

            return basin;
        }

        private void Explore(List<List<int>> numbers, int i, int j, HashSet<string> basin)
        {
            var up = GetNeighbour(numbers, i, j, -1, 0);
            if (!basin.Contains($"{i-1}_{j}") && up.HasValue && up.Value != 9)
            {
                basin.Add($"{i - 1}_{j}");
                Explore(numbers, i - 1, j, basin);
            }

            var down = GetNeighbour(numbers, i, j, 1, 0);
            if (!basin.Contains($"{i + 1}_{j}") && down.HasValue && down.Value != 9)
            {
                basin.Add($"{i + 1}_{j}");
                Explore(numbers, i + 1, j, basin);
            }

            var left = GetNeighbour(numbers, i, j, 0, -1);
            if (!basin.Contains($"{i}_{j - 1}") && left.HasValue && left.Value != 9)
            {
                basin.Add($"{i}_{j - 1}");
                Explore(numbers, i, j - 1, basin);
            }

            var right = GetNeighbour(numbers, i, j, 0, 1);
            if (!basin.Contains($"{i}_{j + 1}") && right.HasValue && right.Value != 9)
            {
                basin.Add($"{i}_{j + 1}");
                Explore(numbers, i, j + 1, basin);
            }
        }

        private int? GetNeighbour(List<List<int>> array, int i, int j, int iDir, int jDir)
        {
            i += iDir;
            j += jDir;
            if (i < 0 || i >= array.Count
                || j < 0 || j >= array[i].Count)
            {
                return null;
            }

            return array[i][j];
        }
    }

}
