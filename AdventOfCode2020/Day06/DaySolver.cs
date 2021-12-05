namespace AdventOfCode2020.Day06
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "06";

        protected override string Solve(string[] input)
        {
            int total = 0;
            var all = new HashSet<char>(Enumerable.Range('a', 'z' - 'a' + 1).Select(Convert.ToChar));
            var group = new HashSet<char>(all);
            foreach (string line in input)
            {
                if (string.IsNullOrEmpty(line))
                {
                    total += group.Count;
                    group = new HashSet<char>(all);
                }
                else
                {
                    group = group.Intersect(line.ToList()).ToHashSet();
                }
            }
            return total.ToString();
        }
    }
}
