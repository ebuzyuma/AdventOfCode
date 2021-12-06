namespace AdventOfCode2021.Day06
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "06";

        protected string ExplisitSolvePart1(string[] input)
        {
            var numbers = input[0].Split(",").Select(int.Parse).ToList();
            for (int i = 0; i < 80; i++)
            {
                var count = numbers.Count;
                for (int j = 0; j < count; j++)
                {
                    if (numbers[j] == 0)
                    {
                        numbers.Add(8);
                        numbers[j] = 6;
                    }
                    else
                    {
                        numbers[j]--;
                    }
                }
            }

            return numbers.Count.ToString();
        }

        protected override string Solve(string[] input)
        {
            var currentGen = input[0].Split(",").Select(int.Parse)
                .GroupBy(x => x)
                .ToDictionary(k => k.Key, v => v.LongCount());

            var nextGen = new Dictionary<int, long>();
            for (int i = 0; i < 256; i++)
            {
                nextGen = currentGen.Where(k => k.Key != 0).ToDictionary(k => k.Key - 1, v => v.Value);
                if (currentGen.ContainsKey(0))
                {
                    nextGen[8] = currentGen[0];
                    if (!nextGen.ContainsKey(6))
                    {
                        nextGen[6] = 0;
                    }
                    nextGen[6] += currentGen[0];
                }
                currentGen = nextGen;
            }

            return currentGen.Values.Sum().ToString();
        }
    }

}
