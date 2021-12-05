namespace AdventOfCode2020.Day05
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "05";
        
        private int[] multi = new int[10] { 64, 32, 16, 8, 4, 2, 1, 4, 2, 1 };
        private bool[] seats = new bool[829];
        
        protected override string Solve(string[] input)
        {
            var max = input
                .Select(x => ConvertToId(x.ToArray(), multi))
                .ToList();
            return string.Join(", ", seats.Select((b, i) => (b, i)).Where(x => !x.b).Select(x => x.i));
        }

        private int ConvertToId(char[] input, int[] multi)
        {
            int row = 0;
            for (int i = 0; i <= 7; i++)
            {
                if (input[i] == 'B')
                {
                    row += multi[i];
                }
            }

            int column = 0;
            for (int i = 7; i < input.Length; i++)
            {
                if (input[i] == 'R')
                {
                    column += multi[i];
                }
            }

            int id = row * 8 + column;
            seats[id] = true;
            return id;
        }
    }
}
