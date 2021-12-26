namespace AdventOfCode2021.Day24
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "24";

        protected override (string, string) Solve(string[] input)
        {
            // Expression: z / p0 * (25 * (z % 26 + p1 != w) + 1) + (w + 15) * (z % 26 + 12 != w)
            int commandsPerDigit = 18;
            int commandsAmount = 14;
            var commandsWithParams = new int[] { 4, 5, 15 };
            var parameters = Enumerable.Range(0, commandsAmount).Select(i => i * commandsPerDigit)
                .Select(i => commandsWithParams.Select(p => long.Parse(input[i + p].Split(" ")[2])).ToArray())
                .ToList();

            var pairs = new Dictionary<int, int>();
            var increase = new Stack<int>();
            for (int i = 0; i < parameters.Count; i++)
            {
                if (parameters[i][0] == 1)
                {
                    increase.Push(i);
                }
                else
                {
                    pairs[increase.Pop()] = i;
                }
            }

            // key + p2_key + p1_value = value 
            var zMax = new long[commandsAmount];
            var zMin = new long[commandsAmount];
            foreach (var pair in pairs)
            {
                Console.WriteLine($"{pair.Key}, {parameters[pair.Key][2]}, {parameters[pair.Value][1]}, {pair.Value}");
                var diff = parameters[pair.Key][2] + parameters[pair.Value][1];
                if (diff >= 0)
                {
                    zMax[pair.Key] = 9 - diff;
                    zMax[pair.Value] = 9;

                    zMin[pair.Key] = 1;
                    zMin[pair.Value] = 1 + diff;
                }
                else
                {
                    zMax[pair.Key] = 9;
                    zMax[pair.Value] = 9 + diff;

                    zMin[pair.Key] = 1 - diff;
                    zMin[pair.Value] = 1;
                }
            }            


            return (string.Join("", zMax).ToString(), String.Join("", zMin).ToString());
        }
    }

}
