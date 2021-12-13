using AdventOfCode2021.Utils;

namespace AdventOfCode2021
{
    public abstract class SolverBase
    {
        protected abstract string DayNo { get; }

        public virtual async Task<string> SolveSampleAsync()
        {
            var input = await InputReader.ReadStringArrayAsync($"../../../Day{DayNo}/sample.txt");
            return Solve(input);
        }

        public virtual async Task<string> SolvePersonalAsync()
        {
            var input = await InputReader.ReadStringArrayAsync($"../../../Day{DayNo}/personal.txt");
            return Solve(input);
        }

        protected abstract string Solve(string[] input);
    }
}
