using System.Text.RegularExpressions;

namespace AdventOfCode2020.Day04
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "04";

        protected override string Solve(string[] input)
        {
            int valid = 0;
            var requiredAttributes = new HashSet<string> { "byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid" };
            var userInvalidAttributes = new HashSet<string>(requiredAttributes);
            foreach (var line in input)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    if (!userInvalidAttributes.Any())
                    {
                        valid++;
                    }

                    userInvalidAttributes = new HashSet<string>(requiredAttributes);
                }
                else
                {
                    line.Split(" ").Select(x => x.Split(":"))
                        .ToList().ForEach(x =>
                        {
                            bool isValid = false;
                            switch (x[0])
                            {
                                case "byr":
                                    isValid = int.TryParse(x[1], out var byr) && byr >= 1920 && byr <= 2002;
                                    break;
                                case "iyr":
                                    isValid = int.TryParse(x[1], out var iyr) && iyr >= 2010 && iyr <= 2020;
                                    break;
                                case "eyr":
                                    isValid = int.TryParse(x[1], out var eyr) && eyr >= 2020 && eyr <= 2030;
                                    break;
                                case "hgt":
                                    if (x[1].EndsWith("cm"))
                                    {
                                        isValid = int.TryParse(x[1].Replace("cm", string.Empty), out var h1) && h1 >= 150 && h1 <= 193;
                                    }
                                    else if (x[1].EndsWith("in"))
                                    {
                                        isValid = int.TryParse(x[1].Replace("in", string.Empty), out var h1) && h1 >= 59 && h1 <= 76;
                                    }
                                    break;
                                case "hcl":
                                    isValid = Regex.IsMatch(x[1], @"^#[\da-f]{6}$");
                                    break;
                                case "ecl": 
                                    isValid = "amb|blu|brn|gry|grn|hzl|oth".Contains(x[1]);
                                    break;
                                case "pid":
                                    isValid = Regex.IsMatch(x[1], @"^\d{9}$");
                                    break;
                                default:
                                    break;
                            }
                            if (isValid)
                            {
                                userInvalidAttributes.Remove(x[0]);
                            }
                        });
                }
            }
            return valid.ToString();
        }
    }
}
