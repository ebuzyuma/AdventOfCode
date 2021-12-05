using AdventOfCode2021.Utils;

namespace AdventOfCode2021.Day05
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "05";

        protected override string Solve(string[] input)
        {
            var converter = input.Select(x => x.Split(" -> "))
                .Select(x => (left: x[0].Split(","), right: x[1].Split(",")))
                .Select(x => (left: (int.Parse(x.left[0]), int.Parse(x.left[1])), right: (int.Parse(x.right[0]), int.Parse(x.right[1]))))
                .ToList();

            var max = input.Select(x => x.Split(" -> "))
                .SelectMany(x => x.SelectMany(y => y.Split(",").Select(int.Parse)))
                .Max() + 1;

            var matrix = new int[max][];
            for (int i = 0; i < max; i++)
            {
                matrix[i] = new int[max];
            }

            foreach (var line in converter)
            {
                if (line.left.Item1 == line.right.Item1)
                {
                    var left = line.left.Item2 < line.right.Item2 ? line.left.Item2 : line.right.Item2;
                    var right = line.left.Item2 > line.right.Item2 ? line.left.Item2 : line.right.Item2;
                    for (int i = left; i <= right; i++)
                    {
                        matrix[line.left.Item1][i]++;
                    }
                }
                else if (line.left.Item2 == line.right.Item2)
                {
                    var left = line.left.Item1 < line.right.Item1 ? line.left.Item1 : line.right.Item1;
                    var right = line.left.Item1 > line.right.Item1 ? line.left.Item1 : line.right.Item1;
                    for (int i = left; i <= right; i++)
                    {
                        matrix[i][line.left.Item2]++;
                    }
                }
                else
                {
                    int i = line.left.Item1, j = line.left.Item2;
                    for (; i != line.right.Item1 && j != line.right.Item2;)
                    {
                        matrix[i][j]++;
                        if (line.left.Item1 < line.right.Item1)
                        {
                            i++;
                        }
                        else
                        {
                            i--;
                        }
                        if (line.left.Item2 < line.right.Item2)
                        {
                            j++;
                        }
                        else
                        {
                            j--;
                        }
                    }
                    matrix[i][j]++;
                }

            }

            foreach (var item in matrix)
            {
                //Console.WriteLine(string.Join("", item).Replace("0", "."));
            }

            var count = matrix.SelectMany(x => x).Count(x => x > 1);

            return count.ToString();
        }
    }
}
