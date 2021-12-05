namespace AdventOfCode2020.Day16
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "16";

        private string Solve1(string[] input)
        {
            var ranges = new List<string>();
            var yourTicket = new List<string>();
            var nearBy = new List<string>();
            List<string> target = ranges;
            foreach (var line in input)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    if (target == ranges)
                    {
                        target = yourTicket;
                    }
                    else if (target == yourTicket)
                    {
                        target = nearBy;
                    }
                }
                else
                {
                    target.Add(line);
                }
            }

            var r = ranges.Select(x => x.Split(": ")[1])
                .SelectMany(x => x.Split(" or "))
                .Select(x => x.Split("-"))
                .Select(x => (from: int.Parse(x[0]), to: int.Parse(x[1])))
                .ToList();

            string ticket = yourTicket[1];

            var nearByNumbers = nearBy.Skip(1)
                .SelectMany(x => x.Split(","))
                .Select(int.Parse)
                .ToList();

            var outliers = nearByNumbers
                .Where(x => !r.Any(y => x >= y.from && x <= y.to))
                .ToList();

            return outliers.Sum().ToString();
        }

        protected override string Solve(string[] input)
        {
            var ranges = new List<string>();
            var yourTicket = new List<string>();
            var nearBy = new List<string>();
            List<string> target = ranges;
            foreach (var line in input)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    if (target == ranges)
                    {
                        target = yourTicket;
                    }
                    else if (target == yourTicket)
                    {
                        target = nearBy;
                    }
                }
                else
                {
                    target.Add(line);
                }
            }

            var allRanges = ranges.Select(x => x.Split(": ")[1])
                .SelectMany(x => x.Split(" or "))
                .Select(x => x.Split("-"))
                .Select(x => (from: int.Parse(x[0]), to: int.Parse(x[1])))
                .ToList();

            var r = ranges.Select(x => x.Split(": "))
                .Select(x => (
                    name: x[0], 
                    ranges: x[1].Split(" or ")
                        .Select(y => y.Split("-"))
                        .Select(y => (from: int.Parse(y[0]), to: int.Parse(y[1])))
                        .ToList()
                ))                
                .ToList();

            string ticket = yourTicket[1];
            var tt = ticket.Split(",").Select(int.Parse).ToList();

            var nearByNumbers = nearBy.Skip(1)
                .Select(x => x.Split(",").Select(int.Parse).ToList())
                .Where(x => x.All(y => allRanges.Any(z => y >= z.from && y <= z.to)))
                .ToList();

            var allcategories = new Dictionary<int, List<string>>();
            var dictionary = new Dictionary<string, int>();
            for (int i = 0; i < r.Count; i++)
            {
                var numbers = nearByNumbers.Select(x => x[i]).ToList();
                allcategories.Add(i, new List<string>());
                foreach (var rline in r)
                {
                    var allMatch = numbers.All(n => rline.ranges.Any(x => n >= x.from && n <= x.to));
                    if (allMatch)
                    {
                        allcategories[i].Add(rline.name);
                    }
                }
            }

            while (dictionary.Count != r.Count)
            {
                KeyValuePair<int, List<string>>? single = allcategories.FirstOrDefault(x => x.Value.Count == 1 && !dictionary.ContainsKey(x.Value[0]));
                if (single != null)
                {
                    string name = single.Value.Value[0];
                    dictionary[name] = single.Value.Key;
                    foreach (var category in allcategories)
                    {
                        category.Value.Remove(name);
                    }
                }
            }

            long result = 1;
            foreach (var item in dictionary.Where(k => k.Key.StartsWith("departure")))
            {
                result *= tt[item.Value];
            }

            return result.ToString();
        }
    }
}
