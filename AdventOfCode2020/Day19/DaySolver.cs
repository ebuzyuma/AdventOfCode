using AdventOfCode2020.Utils;

namespace AdventOfCode2020.Day19
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "19";

        private Dictionary<string, List<string>> cache;

        protected override string Solve(string[] input)
        {
            cache = new Dictionary<string, List<string>>();
            var split = InputParser.SplitByEmptyLine(input).ToList();
            var rules = split[0].Select(x => x.Split(": "))
                .ToDictionary(k => int.Parse(k[0]), v => v[1]);
            var messages = split[1];

            // Part 1
            var valid1 = GetAllValidMessages(rules[0], rules).ToHashSet();
            var match1 = messages.Count(x => valid1.Contains(x));

            // Part 2
            // rule 0: 8 11
            rules[8] = "42 | 42 8";
            rules[11] = "42 31 | 42 11 31";
            var valid42 = GetAllValidMessages(rules[42], rules).ToHashSet();
            var valid31 = GetAllValidMessages(rules[31], rules).ToHashSet();
            var matched = new List<string>();
            foreach (var message in messages)
            {
                var startsWith42 = valid42.FirstOrDefault(x => message.StartsWith(x));
                var endsWith31 = valid31.FirstOrDefault(x => message.EndsWith(x));
                if (startsWith42 != null && endsWith31 != null)
                {
                    if (IsMatch(message.Substring(startsWith42.Length), valid42, valid31))
                    {
                        matched.Add(message);
                    }
                }
            }
            return matched.Count.ToString();
        }

        private bool IsMatch(string message, HashSet<string> valid42, HashSet<string> valid31)
        {
            var startsWith42 = valid42.FirstOrDefault(x => message.StartsWith(x));
            if (startsWith42 != null)
            {
                var subMessage = message.Substring(startsWith42.Length);
                var endsWith31 = valid31.FirstOrDefault(x => subMessage.EndsWith(x));
                if (endsWith31 != null)
                {
                    subMessage = subMessage.Substring(0, subMessage.Length - endsWith31.Length);
                }

                if (string.IsNullOrEmpty(subMessage))
                {
                    return true;
                }

                return IsMatch(subMessage, valid42, valid31);
            }

            return false;
        }

        private List<string> GetAllValidMessages(string rule, Dictionary<int, string> rules)
        {
            if (cache.ContainsKey(rule))
            {
                return cache[rule];
            }

            if (rule.Contains("\""))
            {
                return new List<string> { rule.Trim().Trim('\"') };
            }

            if (rule.Contains(" | "))
            {
                return rule.Split(" | ").SelectMany(x => GetAllValidMessages(x, rules)).ToList();
            }

            var ruleRules = rule.Split(" ").Select(int.Parse).Select(x => rules[x]).ToList();
            List<string> result = new List<string> { string.Empty };
            foreach (var item in ruleRules)
            {
                var rr = GetAllValidMessages(item, rules);
                result = result.SelectMany(x => rr.Select(y => $"{x}{y}")).ToList();
            }

            cache[rule] = result;
            return result;

        }
    }
}
