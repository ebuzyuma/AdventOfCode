using AdventOfCode2021.Utils;

namespace AdventOfCode2021.Day13
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "13";

        protected override (string, string) Solve(string[] input)
        {
            var split = InputParser.SplitByEmptyLine(input).ToList();
            var dots = split[0].Select(x => x.Split(",").Select(long.Parse).ToList())
                .Select(x => (column: x[0], row: x[1]))
                .ToList();
            var sizeRow = dots.Max(x => x.row) + 1;
            var sizeColumn = dots.Max(x => x.column) + 1;
            var matrix = new char[sizeRow, sizeColumn];
            foreach (var item in dots)
            {
                matrix[item.row, item.column] = '#';
            }

            var instructions = split[1].Select(x => x.Split("="))
                .Select(x => (type: x[0], pos: int.Parse(x[1])))
                .ToList();

            for (int i = 0; i < instructions.Count; i++)
            {
                if (instructions[i].type == "fold along x")
                {
                    matrix = FoldLeft(matrix, instructions[i].pos);
                }
                else
                {
                    matrix = FoldUp(matrix, instructions[i].pos);
                }
            }

            var count = 0;
            for (int i = 0; i < matrix.GetLength(0); i++)
            {
                for (int j = 0; j < matrix.GetLength(1); j++)
                {
                    if (matrix[i,j] == '#')
                    {
                        Console.Write('#');
                        count++;
                    }
                    else
                    {
                        Console.Write(' ');
                    }
                }

                Console.WriteLine();
            }

            return (count.ToString(), "".ToString());
        }

        private char[,] FoldLeft(char[,] matrix, int pos)
        {
            var newMatrix = new char[matrix.GetLength(0), pos];
            for (int row = 0; row < matrix.GetLength(0); row++)
            {
                for (int column = 0; column < matrix.GetLength(1); column++)
                {
                    if (column < pos)
                    {
                        newMatrix[row,column] = matrix[row, column];
                    }
                    else if (column > pos)
                    {
                        var distFromPos = column - pos;
                        if (newMatrix[row, pos - distFromPos] != '#')
                        {
                            newMatrix[row, pos - distFromPos] = matrix[row, column];
                        }
                    }
                }
            }

            return newMatrix;
        }

        private char[,] FoldUp(char[,] matrix, int pos)
        {
            var newMatrix = new char[pos, matrix.GetLength(1)];
            for (int row = 0; row < matrix.GetLength(0); row++)
            {
                for (int column = 0; column < matrix.GetLength(1); column++)
                {
                    if (row < pos)
                    {
                        newMatrix[row, column] = matrix[row, column];
                    }
                    else if (row > pos)
                    {
                        var distFromPos = row - pos;
                        if (newMatrix[pos - distFromPos, column] != '#')
                        {
                            newMatrix[pos - distFromPos, column] = matrix[row, column];
                        }
                    }
                }
            }

            return newMatrix;
        }
    }

}
