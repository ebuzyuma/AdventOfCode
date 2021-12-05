using System.Text.RegularExpressions;

namespace AdventOfCode2020.Day07
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "07";

        protected override string Solve(string[] input)
        {
            var colors = input
                .Select(x => x.Split(" bags", 2))
                .ToDictionary(
                    k => k[0],
                    v => GetChildColors(v[1]));

            string color = "shiny gold";
            var result = CountBags(colors[color], colors);

            return result.ToString();
        }

        private int CountBags(List<(string color, int amount)> list, Dictionary<string, List<(string color, int amount)>> colors)
        {
            if (!list.Any())
            {
                return 0;
            }

            return list.Sum(x => x.amount + x.amount * CountBags(colors[x.color], colors));
        }

        //private bool HasColor(List<string> x, string search, Dictionary<string, List<string>> colors)
        //{
        //    if (x.Contains(search))
        //    {
        //        return true;
        //    }

        //    return x.Any(y => HasColor(colors[y], search, colors));
        //}

        private List<(string color, int amount)> GetChildColors(string v)
        {
            var colors = new List<(string color, int amount)>();
            foreach (var color in v.Split(","))
            {
                var match = Regex.Match(color, @"(?<amount>\d) (?<color>.+) bag");
                if (match.Success)
                {
                    colors.Add((match.Groups["color"].Value, int.Parse(match.Groups["amount"].Value)));
                }

            }

            return colors;
        }
    }
}
