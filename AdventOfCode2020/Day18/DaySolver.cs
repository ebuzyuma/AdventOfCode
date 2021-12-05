using System.Text.RegularExpressions;

namespace AdventOfCode2020.Day18
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "12";

        protected override string Solve(string[] input)
        {
            var result = input.Select(x => x.Trim()).Select(Evaluate).Sum();
            return result.ToString();
        }

        private long Evaluate(string exp)
        {
            int pos = 0;
            long leftN = 0;

            while (pos < exp.Length)
            {
                if (leftN == 0)
                {
                    var leftStr = GetTerm2(exp, pos, out pos);
                    leftN = Calculate(leftStr);
                }

                var operation = exp[pos + 1];
                pos = pos + 3;
                var rightStr = GetTerm2(exp, pos, out pos);
                long rightN = Calculate(rightStr);

                if (operation == '+')
                {
                    leftN = leftN + rightN;
                }
                else if (operation == '*')
                {
                    leftN = leftN * rightN;
                }
                else
                {
                    throw new NotImplementedException();
                }
            }

            return leftN;
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

        private string GetTerm2(string exp, int start, out int end)
        {
            if (exp[start] == '(')
            {
                return GetBrackets(exp, start, out end);
            }
            else
            {
                return GetBracketsAndAddition(exp, start, out end);
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

        private string GetBracketsAndAddition(string exp, int start, out int end)
        {
            end = start;
            bool isNextMultiplication = false;
            int? firstSumPos = null;
            int sumCount = 0;

            if (exp.Length == 5)
            {
                isNextMultiplication = true;
                end++;
            }

            while (!isNextMultiplication && end < exp.Length && sumCount <= 1)
            {
                if (exp[end] == '(')
                {
                    end++;
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
                    end--;
                }
                else if (end + 2 >= exp.Length)
                {
                    isNextMultiplication = true;
                    end++;
                }
                else if (exp[end + 2] == '*')
                {
                    isNextMultiplication = true;
                    end++;
                }
                else if (exp[end + 2] == '+')
                {
                    sumCount++;
                    if (sumCount == 1)
                    {
                        firstSumPos = end;
                        end += 4;
                    }
                    else
                    {
                        end = firstSumPos.Value + 1;
                    }
                }
                else
                {
                    end += 4;
                }
            }

            if (firstSumPos != null && end == exp.Length)
            {
                end = firstSumPos.Value + 1;
            }

            return exp.Substring(start, end - start);
        }
    }
}
