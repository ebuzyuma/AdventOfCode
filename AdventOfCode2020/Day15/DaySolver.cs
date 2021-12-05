namespace AdventOfCode2020.Day15
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "15";

        protected override string Solve(string[] input)
        {
            int total = 30000000;
            var result = new int[total];
            var numbers = input[0].Split(",").Select(int.Parse).ToList();
            int last = numbers.Last();
            int next = 0;
            var dict = numbers.Take(numbers.Count - 1).Select((x, i) => (x, i)).ToDictionary(k => k.x, v => v.i);
            numbers = numbers.Take(numbers.Count - 1).ToList();
            dict.ToList().ForEach(kv => result[kv.Value] = kv.Key);

            int current = numbers.Count;

            while (current + 1 != 30000000)
            {
                if (dict.TryGetValue(last, out var value))
                {
                    next = current - value;
                }
                else
                {
                    next = 0;
                }
                dict[last] = current;
                result[current] = last;
                last = next;
                current++;
            }

            return last.ToString();
        }
    }
}
