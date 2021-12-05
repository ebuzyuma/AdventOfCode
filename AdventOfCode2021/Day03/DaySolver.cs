using AdventOfCode2021.Utils;

namespace AdventOfCode2021.Day03
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "03";

        protected string SolvePart1(string[] input)
        {
            string gamma = "";
            string epsilon = "";
            var count = input[0].Length;
            for (int i = 0; i < count; i++)
            {
                int count1 = input.Select(x => x[i]).Count(x => x == '1');
                int count0 = input.Select(x => x[i]).Count(x => x == '0');
                if (count1 > count0)
                {
                    gamma += "1";
                    epsilon += "0";
                }
                else
                {
                    gamma += "0";
                    epsilon += "1";
                }


            }
            var g = GetNumber(gamma);
            var e = GetNumber(epsilon);

            return (g * e).ToString();
        }

        protected override string Solve(string[] input)
        {
            string v1 = "";
            string v2 = "";
            var count = input[0].Length;
            var v1input = (string[])input.Clone();
            var v2input = (string[])input.Clone();
            for (int i = 0; i < count; i++)
            {
                if (v1input.Length == 1)
                {
                    break;
                }
                int count1 = v1input.Select(x => x[i]).Count(x => x == '1');
                int count0 = v1input.Select(x => x[i]).Count(x => x == '0');
                if (count1 >= count0)
                {
                    v1 += "1";
                    v1input = v1input.Where(x => x.StartsWith(v1)).ToArray();
                }
                else
                {
                    v1 += "0";
                    v1input = v1input.Where(x => x.StartsWith(v1)).ToArray();
                }
            }
            for (int i = 0; i < count; i++)
            {
                if (v2input.Length == 1)
                {
                    break;
                }
                int count1 = v2input.Select(x => x[i]).Count(x => x == '1');
                int count0 = v2input.Select(x => x[i]).Count(x => x == '0');
                if (count0 <= count1)
                {
                    v2 += "0";
                    v2input = v2input.Where(x => x.StartsWith(v2)).ToArray();
                }
                else
                {
                    v2 += "1";
                    v2input = v2input.Where(x => x.StartsWith(v2)).ToArray();
                }
            }
            var g = GetNumber(v1input.Single());
            var e = GetNumber(v2input.Single());

            return (g * e).ToString();
        }

        private decimal GetNumber(string bits)
        {
            decimal result = 0;
            decimal multiplier = 1;
            for (int i = bits.Length - 1; i >= 0; i--)
            {
                result += multiplier * (bits[i] == '1' ? 1 : 0);
                multiplier *= 2;
            }

            return result;
        }
    }
}
