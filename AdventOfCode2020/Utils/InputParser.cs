using System.Text.RegularExpressions;

namespace AdventOfCode2020.Utils
{
    public static class InputParser
    {
        public static IEnumerable<List<string>> SplitByEmptyLine(string[] input)
        {
            var part = new List<string>();
            foreach (var line in input)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    yield return part;
                    part = new List<string>();
                }
                else
                {
                    part.Add(line);
                }
            }

            if (part.Count > 0)
            {
                yield return part;
            }
        }

        public static string GetGroup(string input, string pattern, string groupName)
        {
            return Regex.Match(input, pattern).Groups[groupName].Value;
        }
    }
}
