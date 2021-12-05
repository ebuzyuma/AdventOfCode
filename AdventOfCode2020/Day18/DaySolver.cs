using System.Text.RegularExpressions;

namespace AdventOfCode2020.Day18
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "18";

        protected override string Solve(string[] input)
        {
            for(int i = 28; i < input.Length; i++)
            {
                var x = Evaluate(input[i].Trim());
            }
            var result = input.Select(x => x.Trim()).Select(Evaluate).Sum();
            return result.ToString();
        }

        private long Evaluate(string exp)
        {
            if (exp.Length == 1)
            {
                return long.Parse(exp);
            }
            if (exp.Length == 5)
            {
                var operation = exp[2];
                long left = long.Parse(exp.Substring(0, 1));
                long right = long.Parse(exp.Substring(4, 1));

                if (operation == '+')
                {
                    return left + right;
                }
                else if (operation == '*')
                {
                    return left * right;
                }
                else
                {
                    throw new NotImplementedException();
                }
            }


            var sums = SplitBy(exp, '*');
            if (sums.Count == 1)
            {
                sums = SplitBy(sums[0], '+');
                return sums.Select(x => Evaluate(x)).Sum();
            }

            return sums.Select(x => Evaluate(x)).Aggregate(1L, (r, x) => r * x);
        }

        private long Calculate(string exp)
        {
            if (Regex.IsMatch(exp, @"^\d$"))
            {
                return long.Parse(exp);
            }
            else
            {
                return Evaluate(exp);
            }
        }

        private string GetTerm(string exp, int start, out int end)
        {
            if (exp[start] == '(')
            {
                return GetBrackets(exp, start, out end);
            }
            else
            {
                end = start + 1;
                return exp.Substring(start, 1);
            }
        }

        private string GetBrackets(string exp, int start, out int end)
        {
            end = start + 1;
            int brackets = 1;
            while (brackets > 0)
            {
                if (exp[end] == '(')
                {
                    brackets++;
                }
                else if (exp[end] == ')')
                {
                    brackets--;
                }
                end++;
            }

            return exp.Substring(start + 1, end - start - 2);
        }

        private List<string> SplitBy(string exp, char separatorOperation)
        {
            int start = 0;
            int pos = 0;
            var terms = new List<string>();
            int brackets = 0;
            int? firstBracketStart = null;
            int? firstBracketEnd = null;
            while (pos < exp.Length)
            {
                if (exp[pos] == '(')
                {
                    if (brackets == 0) firstBracketStart = pos;
                    brackets++;
                    pos++;
                }
                else if (brackets > 0 && exp[pos] == ')')
                {
                    firstBracketEnd = pos;
                    brackets--;
                    pos++;
                    if (brackets == 0)
                    {
                        pos--;
                    }
                }
                else if (brackets == 0)
                {
                    if (pos == exp.Length - 1)
                    {
                        var term = exp.Substring(start, pos - start + 1);
                        if (firstBracketStart == start && firstBracketEnd == pos)
                        {
                            firstBracketStart = firstBracketEnd = null;
                            term = term.Substring(1, term.Length - 2);
                        }
                        terms.Add(term);
                        pos++;
                    }
                    else if (exp[pos + 2] == separatorOperation)
                    {
                        var term = exp.Substring(start, pos - start + 1);
                        if (firstBracketStart == start && firstBracketEnd == pos)
                        {
                            firstBracketStart = firstBracketEnd = null;
                            term = term.Substring(1, term.Length - 2);
                        }
                        terms.Add(term);
                        pos += 4;
                        start = pos;
                    }
                    else
                    {
                        pos += 4;
                    }
                }
                else
                {
                    // continue till the closing bracket
                    pos++;
                }
            }

            return terms;
        }
    }
}
