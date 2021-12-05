namespace AdventOfCode2020.Day03
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "03";

        protected override string Solve(string[] input)
        {
            var steps = new[] { (1, 1), (3, 1), (5, 1), (7, 1), (1, 2) };

            long product = 1;
            foreach (var step in steps)
            {
                int column = 0;
                int trees = 0;

                for (int i = step.Item2; i < input.Length; i += step.Item2)
                {
                    string line = input[i];
                    column += step.Item1;
                    if (line[column % line.Length] == '#')
                    {
                        trees++;
                    }
                }

                product *= trees;
            }
            return product.ToString();
        }
    }
}
