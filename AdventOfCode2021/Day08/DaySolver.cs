using System.Text.RegularExpressions;

namespace AdventOfCode2021.Day08
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "08";

        protected override string Solve(string[] input)
        {
            var numbers = input
                .Select(x => x.Split(" | "))
                .Select(x => (digits: x[0].Split(" ").ToArray(), data: x[1].Trim().Split(" ")))
                .ToList();

            // Part 1
            var count = numbers.SelectMany(x => x.data).Count(x => x.Length == 4 || x.Length == 2 || x.Length == 3|| x.Length == 7);

            // Part 2
            //  0:      1:      2:      3:      4:
            //  aaaa    ....    aaaa    aaaa    ....
            // b    c  .    c  .    c  .    c  b    c
            // b    c  .    c  .    c  .    c  b    c
            //  ....    ....    dddd    dddd    dddd
            // e    f  .    f  e    .  .    f  .    f
            // e    f  .    f  e    .  .    f  .    f
            //  gggg    ....    gggg    gggg    ....
            //
            //  5:      6:      7:      8:      9:
            //  aaaa    aaaa    aaaa    aaaa    aaaa
            // b    .  b    .  .    c  b    c  b    c
            // b    .  b    .  .    c  b    c  b    c
            //  dddd    dddd    ....    dddd    dddd
            // .    f  e    f  .    f  e    f  .    f
            // .    f  e    f  .    f  e    f  .    f
            //  gggg    gggg    ....    gggg    gggg

            // Idea: 
            // 1: determine simple numbers by distinct amount of segments in it. applied for 1,4,7,8
            // 2: to distinguish numbers with the same amount of segments mask them out with a known number to obtain a single match
            // e.g. mask numbers with 6 segments (possibly 0,6 or 9) by 1 => result with 5 segmens is 6

            long sum = 0;
            foreach (var number in numbers)
            {
                var decoded = new string[10];
                decoded[1] = number.digits.Single(x => x.Length == 2);
                decoded[4] = number.digits.Single(x => x.Length == 4);
                decoded[7] = number.digits.Single(x => x.Length == 3);
                decoded[8] = number.digits.Single(x => x.Length == 7);

                var length6 = number.digits.Where(x => x.Length == 6).ToList();
                var number6 = length6
                    .Select(x => (number: x, masked: Regex.Replace(x, $"[{decoded[1]}]", string.Empty)))
                    .Single(x => x.masked.Length == 5);
                decoded[6] = number6.number;

                var length5 = number.digits.Where(x => x.Length == 5).ToList();
                var number3 = length5
                    .Select(x => (number: x, masked: Regex.Replace(x, $"[{decoded[1]}]", string.Empty)))
                    .Single(x => x.masked.Length == 3);
                decoded[3] = number3.number;

                var number9 = length6
                    .Select(x => (number: x, masked: Regex.Replace(x, $"[{decoded[3]}]", string.Empty)))
                    .Single(x => x.masked.Length == 1);
                decoded[9] = number9.number;

                decoded[0] = length6.Single(x => x != decoded[6] && x != decoded[9]);

                var number5 = length5
                    .Select(x => (number: x, masked: Regex.Replace(x, $"[{decoded[6]}]", string.Empty)))
                    .Single(x => x.masked.Length == 0);
                decoded[5] = number5.number;

                decoded[2] = length5.Single(x => x != decoded[3] && x != decoded[5]);

                var digits = number.data.Select(x => Decode(x, decoded)).ToList();
                var num = long.Parse(string.Join(string.Empty, digits));
                sum += num;
            }

            return sum.ToString();
        }

        private int Decode(string code, string[] decoded)
        {
            var letters = code.OrderBy(x => x).ToList();
            for (int i = 0; i < decoded.Length; i++)
            {
                if (letters.SequenceEqual(decoded[i].OrderBy(x => x)))
                {
                    return i;
                }
            }

            throw new Exception();
        }
    }

}
