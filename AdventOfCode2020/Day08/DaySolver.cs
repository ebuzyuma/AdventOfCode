namespace AdventOfCode2020.Day08
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "08";

        protected override string Solve(string[] input)
        {
            var parsed = input.Select(x =>
            {
                var y = x.Trim().Split(" ");
                return (command: y[0], value: int.Parse(y[1]));
            }).ToList();

            var jmpToNop = parsed
                .Select((x, i) => (x, i))
                .Where(x => x.x.command == "jmp")
                .ToDictionary(k => k.i, v => v.x);

            foreach (var kv in jmpToNop)
            {
                bool[] cycle = new bool[input.Length];
                int acc = 0;

                for (int i = 0; i < parsed.Count && i >= 0; i++)
                {
                    if (i == parsed.Count - 1)
                    {
                        Console.WriteLine($"Changed {kv.Key} jump to nop");
                        return acc.ToString();
                    }

                    if (cycle[i])
                    {
                        break;
                    }

                    cycle[i] = true;

                    var item = parsed[i];
                    if (item.command == "acc")
                    {
                        acc += item.value;
                    }
                    else if (item.command == "jmp" && i != kv.Key)
                    {
                        i += item.value - 1;
                    }
                }
            }


            return "NotFound";
        }
    }
}
