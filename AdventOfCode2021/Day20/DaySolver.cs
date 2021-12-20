using AdventOfCode2021.Utils;
using System.Text;

namespace AdventOfCode2021.Day20
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "20";

        protected override (string, string) Solve(string[] input)
        {
            var split = InputParser.SplitByEmptyLine(input).ToList();
            var code = string.Join(string.Empty, split[0]).Select(CodeToBool).ToList();
            var image = split[1]
                .Select(x => x.Select(CodeToBool).ToList())
                .ToList();

            //Print(image);
            image = Expand(image, false);
            //Print(image);

            int part1 = 0;
            for (int i = 0; i < 1000; i++)
            {
                image = Apply(image, code);
                //Print(image);

                image = Expand(image, code[0] ? image[0][0] : false);
                //Print(image);


                if (i == 2)
                {
                    part1 = image.SelectMany(x => x).Count(x => x);
                }
            }

            var part2 = image.SelectMany(x => x).Count(x => x);
            return (part1.ToString(), part2.ToString());
        }

        private void Print(List<List<bool>> list)
        {
            foreach (var row in list)
            {
                foreach (var item in row)
                {
                    Console.Write(item ? '#' : '.');
                }
                Console.WriteLine();
            }
            Console.WriteLine();
        }

        private List<List<bool>> Apply(List<List<bool>> image, List<bool> code)
        {
            var newImage = new List<List<bool>>();
            for (int row = 1; row < image.Count - 1; row++)
            {
                var line = new List<bool>();
                for (int column = 1; column < image[row].Count - 1; column++)
                {
                    var mapped = Map(row, column, image, code);
                    line.Add(mapped);
                }
                newImage.Add(line);
            };

            return newImage;
        }

        private bool Map(int row, int column, List<List<bool>> image, List<bool> code)
        {
            var input = new StringBuilder();
            for (int i = -1; i <= 1; i++)
            {
                for (int j = -1; j <= 1; j++)
                {
                    input.Append(image[row + i][column + j] ? 1 : 0);
                }
            }

            var number = GetNumber(input.ToString());
            return code[(int)number];
        }

        private List<List<bool>> Expand(List<List<bool>> image, bool extendItem)
        {
            var newImage = Clone(image);
            var rowLength = image[0].Count;

            int firstNonEmptyRow = 0;
            while(image[firstNonEmptyRow].All(x => !x))
            {
                firstNonEmptyRow++;
            }
            for (int i = 0; i < 4 - firstNonEmptyRow; i++)
            {
                newImage = newImage.Prepend(Enumerable.Repeat(extendItem, rowLength).ToList()).ToList();
            }

            int lastNonEmptyRow = image.Count - 1;
            while (image[lastNonEmptyRow].All(x => !x))
            {
                lastNonEmptyRow--;
            }
            for (int i = 0; i < 4 - (image.Count - 1 - lastNonEmptyRow); i++)
            {
                newImage = newImage.Append(Enumerable.Repeat(extendItem, rowLength).ToList()).ToList();
            }

            int firstNonEmptyColumn = 0;
            while(image.All(x => !x[firstNonEmptyColumn]))
            {
                firstNonEmptyColumn++;
            }
            for (int i = 0; i < 4 - firstNonEmptyColumn; i++)
            {
                for (int row = 0; row < newImage.Count; row++)
                {
                    newImage[row] = newImage[row].Prepend(extendItem).ToList();
                }
            }

            int lastNonEmptyColumn = rowLength - 1;
            while (image.All(x => !x[lastNonEmptyColumn]))
            {
                lastNonEmptyColumn--;
            }
            for (int i = 0; i < 4 - (rowLength - 1 - lastNonEmptyColumn); i++)
            {
                newImage.ForEach(row => row.Add(extendItem));
            }


            return newImage;
        }

        private List<List<bool>> Clone(List<List<bool>> image)
        {
            return image.Select(x => x.ToList()).ToList();
        }

        private bool CodeToBool(char x) => x == '#';

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
