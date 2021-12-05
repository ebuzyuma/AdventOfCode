using System.Text;
using System.Text.RegularExpressions;

namespace AdventOfCode2020.Day14
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "14";

        protected string Solve1(string[] input)
        {
            long total = 1000000;// (long)Math.Pow(2, 35);
            decimal[] mem = new decimal[total];
            string mask = "";
            foreach (var item in input)
            {
                if (item.StartsWith("mask = "))
                {
                    mask = item.Replace("mask = ", string.Empty);
                }
                else
                {
                    var match = Regex.Match(item, @"mem\[(?<index>\d+)\] = (?<value>\d+)");
                    int index = int.Parse(match.Groups["index"].Value);
                    int value = int.Parse(match.Groups["value"].Value);
                    string bits = GetBits(value);

                    decimal result = 0;
                    decimal multiplier = 1;
                    for (int i = bits.Length - 1; i >= 0; i--)
                    {
                        char bit = mask[i] == 'X' ? bits[i] : mask [i];
                        result += multiplier * (bit == '1' ? 1 : 0);
                        multiplier *= 2;
                    }
                    
                    mem[index] = result;

                }
            }

            return mem.Sum().ToString();
        }

        protected override string Solve(string[] input)
        {
            Dictionary<decimal, decimal> mem = new Dictionary<decimal, decimal>();
            string mask = "";
            foreach (var item in input)
            {
                if (item.StartsWith("mask = "))
                {
                    mask = item.Replace("mask = ", string.Empty);
                }
                else
                {
                    var match = Regex.Match(item, @"mem\[(?<index>\d+)\] = (?<value>\d+)");
                    int index = int.Parse(match.Groups["index"].Value);
                    int value = int.Parse(match.Groups["value"].Value);
                    string bits = GetBits(index);

                    var indexX = new char[bits.Length];
                    for (int i = 0; i < bits.Length; i++)
                    {
                        if (mask[i] == '0')
                        {
                            indexX[i] = bits[i];
                        }
                        else if (mask[i] == '1')
                        {
                            indexX[i] = '1';
                        }
                        else
                        {
                            indexX[i] = 'X';
                        }
                    }


                    var indexes = GenerateFromTemplate(indexX, 0);

                    foreach (var ix in indexes)
                    {
                        mem[(long)ix] = value;
                    }
                }
            }

            return mem.Values.Sum().ToString();
        }

        private List<decimal> GenerateFromTemplate(char[] indexX, int i)
        {
            var result = new List<decimal>();

            while(i < indexX.Length && indexX[i] != 'X')
            {
                i++;
            }

            if (i == indexX.Length)
            {
                var str = string.Join("", indexX);
                var num = GetNumber(str);
                return new List<decimal> { num };
            }

            var copy0 = (char[])indexX.Clone();
            var copy1 = (char[])indexX.Clone();
            copy0[i] = '0';
            copy1[i] = '1';

            result.AddRange(GenerateFromTemplate(copy0, i + 1));
            result.AddRange(GenerateFromTemplate(copy1, i + 1));

            return result;
        }

        private string GetBits(int number)
        {
            var sb = new StringBuilder();
            sb.Append("0");
            for (long i = 1L << 34; i > 0; i = i / 2)
            {
                if ((number & i) != 0)
                {
                    sb.Append("1");
                }
                else
                {
                    sb.Append("0");
                }
            }

            return sb.ToString();
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
