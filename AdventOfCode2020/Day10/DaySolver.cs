namespace AdventOfCode2020.Day10
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "10";
        
        private Dictionary<string, long> cache = new Dictionary<string, long>();

        protected override string Solve(string[] input)
        {
            var jolts = input.Select(int.Parse).ToList();
            jolts.Sort();
            int device = jolts.Last() + 3;

            jolts = jolts.Prepend(0).Append(device).ToList();
            var distinct = jolts.Distinct().ToList();
            int diff1 = 0;
            int diff3 = 0;
            for (int i = 1; i < jolts.Count; i++)
            {
                int diff = jolts[i] - jolts[i-1];
                if (diff == 1)
                {
                    diff1++;
                }
                else if (diff == 3)
                {
                    diff3++;
                }
                else if (diff > 3)
                {
                    return "Chain break";
                }
            }

            //return (diff1 * diff3).ToString();
            return CountWays(0, jolts, string.Empty).ToString();
        }

        private long CountWays(long sum, List<int> jolts, string currentPath)
        {
            int current = jolts[0];
            currentPath += $"-{current}";

            if (jolts.Count == 1)
            {
                return 1;
            }
            else if (cache.TryGetValue(string.Join("-", jolts), out var x))
            {
                return x;
            }

            var possibleWays = new List<List<int>>();
            for (int i = 1; i < jolts.Count; i++)
            {
                if (jolts[i] - current > 3)
                {
                    break;
                }

                possibleWays.Add(jolts.Skip(i).ToList());
            }

            long result = possibleWays.Sum(x => CountWays(sum, x, currentPath));
            cache.Add(string.Join("-", jolts), result);

            return result;
        }
    }
}
