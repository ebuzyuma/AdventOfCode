using AdventOfCode2021.Utils;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Engines;

namespace AdventOfCode2021
{
    [SimpleJob(RunStrategy.Monitoring)]
    [MinColumn, MaxColumn, MeanColumn, MedianColumn]
    public abstract class SolverBase2
    {
        protected abstract string DayNo { get; }

        public virtual async Task SolveSampleAsync()
        {
            Console.WriteLine("Sample:");
            await SolveAsync(async () => await InputReader.ReadStringArrayAsync($"../../../Day{DayNo}/sample.txt"));
        }

        [Benchmark]
        public virtual async Task SolvePersonalAsync()
        {
            Console.WriteLine("Personal:");
            await SolveAsync(async () => await InputReader.ReadStringArrayAsync($"../../../Day{DayNo}/personal.txt"));
        }

        private async Task SolveAsync(Func<Task<string[]>> inputFunc)
        {
            var input = await inputFunc();
            var answer = Solve(input);

            Console.WriteLine($"Part 1: {answer.part1}");
            Console.WriteLine($"Part 2: {answer.part2}");
            Console.WriteLine();
        }

        protected abstract (string part1, string part2) Solve(string[] input);
    }
}
