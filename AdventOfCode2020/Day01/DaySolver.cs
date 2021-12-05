namespace AdventOfCode2020.Day01
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "01";

        protected override string Solve(string[] input)
        {
            var numbers = input.Select(int.Parse).ToList();
            for (int i = 0; i < numbers.Count; i++)
            {
                for (int j = 0; j < numbers.Count; j++)
                {
                    for (int k = 0; k < numbers.Count; k++)
                    {
                        if (numbers[i] + numbers[j] + numbers[k] == 2020)
                        {
                            return (numbers[i] * numbers[j] * numbers[k]).ToString();
                        }
                    }
                }
            }

            return "NotFound";
        }
    }
}
