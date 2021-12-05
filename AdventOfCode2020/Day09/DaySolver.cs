namespace AdventOfCode2020.Day09
{
    public class DaySolver : SolverBase
    {
        private int preamble = 0;

        protected override string DayNo => "09";

        public override Task<string> SolveSampleAsync()
        {
            preamble = 5;
            return base.SolveSampleAsync();
        }

        public override Task<string> SolvePersonalAsync()
        {
            preamble = 25;
            return base.SolvePersonalAsync();
        }

        protected override string Solve(string[] input)
        {
            var numbers = input.Select(x => long.Parse(x)).ToList();

            long invalidNumber = 0;
            for (int i = preamble; i < numbers.Count; i++)
            {
                var number = numbers[i];
                var pre = numbers.Skip(i - preamble).Take(preamble).ToList();
                var sums = pre.SelectMany(x => pre.Where(y => y != x).Select(y => y + x)).ToList();
                if (!sums.Contains(number))
                {
                    invalidNumber = number;
                    break;
                }
            }

            int beginIndex = 0;
            int endIndex = -1;
            long sum = 0;
            for (int i = 0; i < input.Length;)
            {
                if (endIndex != i)
                {
                    endIndex = i;
                    sum += numbers[i];
                }
                if (sum > invalidNumber)
                {
                    sum -= numbers[beginIndex];
                    beginIndex++;
                }
                else if (sum == invalidNumber)
                {
                    var range = numbers.Skip(beginIndex).Take(endIndex - beginIndex + 1).ToList();
                    return (range.Min() + range.Max()).ToString();
                }
                else
                {
                    i++;
                }
            }


            return "NotFound";
        }
    }
}
