namespace AdventOfCode2021.Day07
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "07";

        protected override string Solve(string[] input)
        {
            var numbers = input[0].Split(',').Select(int.Parse).ToList();

            var count = numbers.GroupBy(x => x)
                .ToDictionary(k => k.Key, v => v.Count());

            var max = count.MaxBy(kv => kv.Value).Key;
            var fuel = numbers.Aggregate(0L, (r, x) => r += CalculateFuel(max, x));
            bool decrease = true;
            while (decrease)
            {
                var nextMax = max + 1;
                var nextFuel = numbers.Aggregate(0L, (r, x) => r += CalculateFuel(nextMax, x));
                if (nextFuel <= fuel)
                {
                    max = nextMax;
                    fuel = nextFuel;
                }
                else
                {
                    decrease = false;
                }
            }


            return fuel.ToString();
        }

        private long CalculateFuel(int start, int target)
        {
            var diff = Math.Abs(start - target);
            return (1 + diff) * diff / 2;
        }
    }

}
