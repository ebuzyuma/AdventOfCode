namespace AdventOfCode2020.Day13
{
    public class DaySolver : SolverBase
    {
        private long t = 0;

        protected override string DayNo => "13";

        public override Task<string> SolveSampleAsync()
        {
            t = 0;
            return base.SolveSampleAsync();
        }

        public override Task<string> SolvePersonalAsync()
        {
            t = 100048048637548;
            return base.SolvePersonalAsync();
        }


        protected override string Solve(string[] input)
        {
            int ts = int.Parse(input[0]);
            var buses = input[1].Split(",")
                .Select(x => x == "x" ? 0 : int.Parse(x))
                .Select((x, i) => (bus: x, ts: i))
                .Where(x => x.bus != 0)
                .ToArray();

            int first = buses[0].bus;

            long N = 1;
            foreach (var item in buses)
            {
                N *= item.bus;
            }

            long sum = 0;
            foreach (var item in buses)
            {
                long Ni = N / item.bus;
                long xi = 1;
                while ((Ni * xi) % item.bus != 1)
                {
                    xi++;
                }

                sum += AbsoluteModulo(item.bus - item.ts, item.bus) * Ni * xi;
            }

            var result = sum % N;
            return result.ToString();


            //while(buses.Any(x => (t + x.ts) % x.bus != 0))
            //{
            //    t += first;
            //}
            //return t.ToString();

            // var min = buses.Select(x => (bus: x, time: ((ts / x + 1) * x - ts))).MinBy(x => x.time);
            //return (min.bus * min.time).ToString();
        }


        private static long AbsoluteModulo(int v, int cur)
        {
            return ((v % cur) + cur) % cur;
        }
    }
}
