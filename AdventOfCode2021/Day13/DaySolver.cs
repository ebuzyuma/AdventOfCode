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
            var paper = new bool[sizeRow, sizeColumn];
            foreach (var item in dots)
            {
                paper[item.row, item.column] = true;
            }

            var instructions = split[1].Select(x => x.Split("="))
                .Select(x => (type: x[0], pos: int.Parse(x[1])))
                .ToList();

            int countAfter1Fold = 0;
            for (int i = 0; i < instructions.Count; i++)
            {
                if (i == 1)
                {
                    // Part 1
                    countAfter1Fold = paper.Cast<bool>().Count(marked => marked);
                }
                if (instructions[i].type == "fold along x")
                {
                    paper = FoldLeft(paper, instructions[i].pos);
                }
                else
                {
                    paper = FoldUp(paper, instructions[i].pos);
                }
            }

            for (int i = 0; i < paper.GetLength(0); i++)
            {
                for (int j = 0; j < paper.GetLength(1); j++)
                {
                    if (paper[i,j])
                    {
                        Console.Write('#');
                    }
                    else
                    {
                        Console.Write(' ');
                    }
                }

                Console.WriteLine();
            }

            return (countAfter1Fold.ToString(), "".ToString());
        }


        private bool[,] FoldLeft(bool[,] matrix, int pos)
        {
            var newMatrix = new bool[matrix.GetLength(0), pos];
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
                        newMatrix[row, pos - distFromPos] |= matrix[row, column];
                    }
                }
            }

            return newMatrix;
        }

        private bool[,] FoldUp(bool[,] matrix, int pos)
        {
            var newMatrix = new bool[pos, matrix.GetLength(1)];
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
                        newMatrix[pos - distFromPos, column] |= matrix[row, column];
                    }
                }
            }

            return newMatrix;
        }
    }

}
