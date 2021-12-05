using AdventOfCode2021.Utils;

namespace AdventOfCode2021.Day02
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "02";

        protected override string Solve(string[] input)
        {
            int x = 0;
            int y = 0;
            int aim = 0;

            foreach (var item in input)
            {
                var split = item.Split(" ");
                if (split[0] == "forward")
                {
                    x += int.Parse(split[1]);
                    y += int.Parse(split[1]) * aim;
                }
                else if (split[0] == "up")
                {
                    aim -= int.Parse(split[1]);
                }
                else if (split[0] == "down")
                {
                    aim += int.Parse(split[1]);
                }
            }

            return (x * y).ToString();
        }
    }
}
