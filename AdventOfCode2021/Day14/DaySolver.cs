using System.Text;

namespace AdventOfCode2021.Day14
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "14";

        protected override (string, string) Solve(string[] input)
        {
            string polymer = input[0];

            var rules = input.Skip(2).Select(x => x.Split(" -> "))
                .ToDictionary(k => k[0], v => v[1]);

            // Part 1
            var result = BuildPolymer(polymer, rules, 10);
            var group = result.OrderBy(x => x).GroupBy(x => x).ToDictionary(x => x.Key, x => x.LongCount());
            var min = group.Min(x => x.Value);
            var max = group.Max(x => x.Value);
            var part1 = max - min;

            // Part 2
            var histogram = BuildHistogram(polymer, rules, 40);
            min = histogram.Min(x => x.Value);
            max = histogram.Max(x => x.Value);
            var part2 = max - min;

            return (part1.ToString(), part2.ToString());
        }

        private Dictionary<char, long> BuildHistogram(string polymer, Dictionary<string, string> rules, int iterations)
        {
            // idea:
            // build cache for all rules for half of iterations
            // Count for half of iterations from polymer and for the other half from cache

            var alphabet = rules.Values.Select(x => x[0]).Union(polymer).Distinct().OrderBy(x => x);
            var histogram = alphabet.ToDictionary(k => k, v => 0L);

            // Build cache
            var rulesHistograms = new Dictionary<string, Dictionary<char, long>>();
            foreach (var rule in rules)
            {
                var ruleHistogram = alphabet.ToDictionary(k => k, v => 0L);
                Count(rule.Key[0], rule.Key[1], 0, iterations / 2, ruleHistogram, rules);
                rulesHistograms[rule.Key] = ruleHistogram;
            }

            // Count for half of iterations
            ItemsOfPolymer.Clear();
            for (int i = 0; i < polymer.Length - 1; i++)
            {
                histogram[polymer[i]]++;
                Count(polymer[i], polymer[i + 1], 0, iterations / 2, histogram, rules);
            }
            histogram[polymer.Last()]++;

            // Count the rest from cache 
            foreach (var pair in ItemsOfPolymer)
            {
                var ruleHistogram = rulesHistograms[$"{pair.left}{pair.right}"];
                foreach (var item in ruleHistogram)
                {
                    histogram[item.Key] += item.Value;
                }
            }

            return histogram;
        }

        private string BuildPolymer(string polymer, Dictionary<string, string> rules, int iterations)
        {
            for (int i = 0; i < iterations; i++)
            {
                var newPolymer = new StringBuilder();
                newPolymer.Append(polymer.First());
                for (int j = 0; j < polymer.Length - 1; j++)
                {
                    if (rules.TryGetValue($"{polymer[j]}{polymer[j + 1]}", out var add))
                    {
                        newPolymer.Append(add);
                    }
                    newPolymer.Append(polymer[j + 1]);
                }
                polymer = newPolymer.ToString();
            }

            return polymer;
        }

        private List<(char left, char right)> ItemsOfPolymer = new List<(char, char)>();

        private void Count(char a, char b, int iteration, int maxIterations,
            Dictionary<char, long> values,
            Dictionary<string, string> rules)
        {
            if (iteration == maxIterations)
            {
                ItemsOfPolymer.Add((a, b));
                return;
            }

            if (rules.TryGetValue($"{a}{b}", out var add))
            {
                values[add[0]]++;
                Count(a, add[0], iteration + 1, maxIterations, values, rules);
                Count(add[0], b, iteration + 1, maxIterations, values, rules);                
            }
        }
    }
}
