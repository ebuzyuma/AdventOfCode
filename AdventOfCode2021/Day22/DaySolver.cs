namespace AdventOfCode2021.Day22
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "22";

        protected override (string, string) Solve(string[] input)
        {
            var instructions = input.Select(x => new Instruction(x)).ToList();

            var activeSet = new List<(long, long, long)>();
            var areas = new List<Area>();
            for (var i = 0; i < instructions.Count; i++)
            {
                var instruction = instructions[i];

                // Part 1
                if (instruction.IsForInit())
                {
                    var set = instruction.GenerateSet();
                    activeSet = instruction.IsOn ? activeSet.Union(set).ToList() : activeSet.Except(set).ToList();
                }
                //Console.WriteLine($"active by count: {on.Count}");

                // Part 2
                var intersections = areas.Where(a => a.IsIntersect(instruction)).ToList();
                foreach (var intersectWith in intersections)
                {
                    if (instruction.IsOn)
                    {
                        var splited = intersectWith.Except(instruction).ToList();
                        areas.Remove(intersectWith);
                        areas.AddRange(splited);
                    }
                    else
                    {
                        var splited = intersectWith.Except(instruction).ToList();
                        areas.Remove(intersectWith);
                        areas.AddRange(splited);
                    }
                }
                if (instruction.IsOn)
                {
                    areas.Add(instruction);
                }
                //Console.WriteLine($"active by range: {areas.Sum(x => x.Count())}");

            }

            return (activeSet.Count.ToString(), areas.Sum(x => x.Count()).ToString());
        }

        public class Area
        {
            public long[] XRange { get; set; }

            public long[] YRange { get; set; }

            public long[] ZRange { get; set; }

            public Area()
            {
            }

            public Area(long[] x, long[] y, long[] z)
            {
                XRange = x;
                YRange = y;
                ZRange = z;
            }

            public long Count()
            {
                return (Math.Abs(XRange[1] - XRange[0]) + 1) * (Math.Abs(YRange[1] - YRange[0]) + 1) * (Math.Abs(ZRange[1] - ZRange[0]) + 1);
            }

            private bool IsIntersect(long[] range1, long[] range2)
            {
                return Math.Max(range1[0], range2[0]) <= Math.Min(range1[1], range2[1]);
            }

            public bool IsIntersect(Area area)
            {
                return IsIntersect(XRange, area.XRange)
                    && IsIntersect(YRange, area.YRange)
                    && IsIntersect(ZRange, area.ZRange);
            }

            public IEnumerable<Area> Except(Area instruction)
            {
                var xExcept = Except(XRange, instruction.XRange);
                var yExcept = Except(YRange, instruction.YRange);
                var zExcept = Except(ZRange, instruction.ZRange);

                var xMatch = Intersect(XRange, instruction.XRange);
                var yMatch = Intersect(YRange, instruction.YRange);
                var zMatch = Intersect(ZRange, instruction.ZRange);

                foreach (var x in xExcept)
                {
                    yield return new Area(x, YRange, ZRange);
                }

                foreach (var y in yExcept)
                {
                    yield return new Area(xMatch, y, ZRange);
                }

                foreach (var z in zExcept)
                {
                    yield return new Area(xMatch, yMatch, z);
                }
            }

            private long[] Intersect(long[] left, long[] right)
            {
                return new long[] { Math.Max(left[0], right[0]), Math.Min(left[1], right[1]) };
            }

            private List<long[]> Except(long[] root, long[] exclude)
            {
                var result = new List<long[]>();
                if (root[0] < exclude[0])
                {
                    result.Add(new long[] { root[0], exclude[0] - 1 });
                }

                if (root[1] > exclude[1])
                {
                    result.Add(new long[] { exclude[1] + 1, root[1] });
                }

                return result;
            }

            public override string ToString()
            {
                return $"{XRange[0]}..{XRange[1]}, {YRange[0]}..{YRange[1]}, {ZRange[0]}..{ZRange[1]}";
            }
        }

        public class Instruction : Area
        {
            public bool IsOn { get; set; }

            public List<(long x, long y, long z)> GenerateSet()
            {
                var xRange = Enumerable.Range(Convert.ToInt32(XRange[0]), Convert.ToInt32(XRange[1] - XRange[0] + 1)).Select(Convert.ToInt64).ToList();
                var yRange = Enumerable.Range(Convert.ToInt32(YRange[0]), Convert.ToInt32(YRange[1] - YRange[0] + 1)).Select(Convert.ToInt64).ToList();
                var zRange = Enumerable.Range(Convert.ToInt32(ZRange[0]), Convert.ToInt32(ZRange[1] - ZRange[0] + 1)).Select(Convert.ToInt64).ToList();
                var combinations = xRange.SelectMany(x => yRange.SelectMany(y => zRange.Select(z => (x, y, z)))).ToList();
                return combinations;
            }

            public Instruction(string command)
            {
                var split = command.Split(' ');
                IsOn = split[0] == "on";
                var ranges = split[1].Split(',');
                XRange = ranges[0].Split('=')[1].Split("..").Select(long.Parse).ToArray();
                YRange = ranges[1].Split('=')[1].Split("..").Select(long.Parse).ToArray();
                ZRange = ranges [2].Split('=')[1].Split("..").Select(long.Parse).ToArray();
            }

            public bool IsForInit()
            {
                return XRange[0] >= -50 && XRange[1] <= 50
                    && YRange[0] >= -50 && YRange[1] <= 50
                    && ZRange[0] >= -50 && ZRange[1] <= 50;
            }
        }
    }

}
