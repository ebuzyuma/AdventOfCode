using AdventOfCode2021.Utils;

namespace AdventOfCode2021.Day01
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "12";

        protected override string Solve(string[] input)
        {
            var count = 0;
            var numbers = input.Select(int.Parse).ToList();
            for (int i = 2; i < input.Length - 1; i++)
            {
                if (numbers[i - 2] - numbers[i + 1] < 0)
                {
                    count++;
                }
            }

            return count.ToString();
        }
    }
}
