namespace AdventOfCode2021.Day24
{
    public class DayResearchWithStr : SolverBase2
    {
        protected override string DayNo => "24";
        // Generates output like this:
        //z => z / 1 * (25 * (z % 26 + 12 ?= w ?= 0) + 1) + (w + 7) * (z % 26 + 12 ?= w ?= 0) (8..16)
        //z => z / 1 * (25 * (z % 26 + 12 ?= w ?= 0) + 1) + (w + 8) * (z % 26 + 12 ?= w ?= 0) (217..433)
        //z => z / 1 * (25 * (z % 26 + 13 ?= w ?= 0) + 1) + (w + 2) * (z % 26 + 13 ?= w ?= 0) (5645..11269)
        //z => z / 1 * (25 * (z % 26 + 12 ?= w ?= 0) + 1) + (w + 11) * (z % 26 + 12 ?= w ?= 0) (146782..293014)
        //z => z / 26 * (25 * (z % 26 + -3 ?= w ?= 0) + 1) + (w + 6) * (z % 26 + -3 ?= w ?= 0) (5645..293009)
        //z => z / 1 * (25 * (z % 26 + 10 ?= w ?= 0) + 1) + (w + 12) * (z % 26 + 10 ?= w ?= 0) (146783..7618255)
        //z => z / 1 * (25 * (z % 26 + 14 ?= w ?= 0) + 1) + (w + 14) * (z % 26 + 14 ?= w ?= 0) (3816373..198074653)
        //z => z / 26 * (25 * (z % 26 + -16 ?= w ?= 0) + 1) + (w + 13) * (z % 26 + -16 ?= w ?= 0) (146783..198074652)
        //z => z / 1 * (25 * (z % 26 + 12 ?= w ?= 0) + 1) + (w + 15) * (z % 26 + 12 ?= w ?= 0) (3816374..5149940976)
        //z => z / 26 * (25 * (z % 26 + -8 ?= w ?= 0) + 1) + (w + 10) * (z % 26 + -8 ?= w ?= 0) (146783..5149940971)
        //z => z / 26 * (25 * (z % 26 + -12 ?= w ?= 0) + 1) + (w + 6) * (z % 26 + -12 ?= w ?= 0) (5645..5149940967)
        //z => z / 26 * (25 * (z % 26 + -7 ?= w ?= 0) + 1) + (w + 10) * (z % 26 + -7 ?= w ?= 0) (217..5149940971)
        //z => z / 26 * (25 * (z % 26 + -6 ?= w ?= 0) + 1) + (w + 8) * (z % 26 + -6 ?= w ?= 0) (8..5149940969)
        //z => z / 26 * (25 * (z % 26 + -11 ?= w ?= 0) + 1) + (w + 5) * (z % 26 + -11 ?= w ?= 0) (0..5149940966)

        protected override (string, string) Solve(string[] input)
        {
            var dimensions = new string[] { "w", "x", "y", "z" };

            var oneLine = string.Join("|", input);
            var perDigit = oneLine.Split("inp w|", StringSplitOptions.RemoveEmptyEntries);
            var zPositions = new[] { 3, 11, 16 };
            var deviders = new long[perDigit.Length];
            var firstTerm = new string[perDigit.Length];
            var secondTerm = new string[perDigit.Length];
            var x06 = new long[perDigit.Length];
            var y16 = new long[perDigit.Length];

            var minValues = new long[perDigit.Length];
            var maxValues = new long[perDigit.Length];
            var minDigit = 1L;
            var maxDigit = 9L;
            for (var i = 0; i < perDigit.Length; i++)
            { 
                var digitCommands = perDigit[i];
                //Console.WriteLine(digitCommands);
                var commands = digitCommands.Split("|").ToList();
                
                deviders[i] = long.Parse(commands[zPositions[0]].Split(" ")[2]);

                x06[i] = int.Parse(commands[zPositions[0] + 1].Split(" ")[2]);
                var xStr = $"(z % 26 + {x06[i]} ?= w ?= 0)";
                firstTerm[i] = $"25 * {xStr} + 1";

                y16[i] = int.Parse(commands[zPositions[2] - 2].Split(" ")[2]);
                secondTerm[i] = $"(w + {y16[i]}) * {xStr}";

                var minX = x06[i] > 9 ? 1 : 0;
                var maxX = 1;
                var prevMin = i == 0 ? 0 : minValues[i - 1];
                var prevMax = i == 0 ? 0 : maxValues[i - 1];
                minValues[i] = prevMin / deviders[i] * (25 * minX + 1) + (minDigit + y16[i]) * minX;
                maxValues[i] = prevMax / deviders[i] * (25 * maxX + 1) + (maxDigit + y16[i]) * maxX;

                Console.WriteLine($"z => z / {deviders[i]} * ({firstTerm[i]}) + {secondTerm[i]} ({minValues[i]}..{maxValues[i]})");
            }

            string result = "";
            for (int i = perDigit.Length - 1; i >= 0; i--)
            {
                var minX = x06[i] > 9 ? 1 : 0;
                var maxX = 1;
                var prevMin = i == 0 ? 0 : minValues[i - 1];
                var prevMax = i == 0 ? 0 : maxValues[i - 1];
                for (var digit = minDigit; digit <= maxDigit; digit++)
                {
                    if (minValues[i] == prevMin / deviders[i] * (25 * minX + 1) + (digit + y16[i]) * minX)
                    {
                        result = $"{result}{digit}";
                    }
                }
            }

            Console.WriteLine(Calculate("97919997299495"));

            long Calculate(string input)
            {
                var output = 0L;
                for (int i = 0; i < input.Length; i++)
                {
                    var digit = int.Parse(input[i].ToString());
                    var x = output % 26 + x06[i] != digit ? 1 : 0;
                    output = output / deviders[i] * (25 * x + 1) + (digit + y16[i]) * x;

                }

                return output;
            }


            return (result.ToString(), "".ToString());
        }
    }

}
