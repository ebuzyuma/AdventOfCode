using AdventOfCode2020.Utils;

namespace AdventOfCode2021.Day19
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "19";

        protected override (string, string) Solve(string[] input)
        {
            // Idea:
            // 1. if bacon for scanner1 has position x and for scanner2 has possition y
            // then scanner2 possition for scanner1 is x-y
            // Thus, find all possible possitions of scanner2 based on points from both scanners
            // 2. Find match with a scanner in absolute coordinates,
            // Make current to be in absolute coordinates. Repeat.


            var scanners = InputParser.SplitByEmptyLine(input)
                .Select(x => x.Skip(1).Select(y => new Position(y)).ToList())
                .ToList();

            var matches = new MatchResult[scanners.Count];
            matches[0] = new MatchResult { Position = new Position(0,0,0) };
            
            while (matches.Count(x => x != null) != scanners.Count)
            {
                for (int current = 0; current < scanners.Count; current++)
                {
                    if (matches[current] != null)
                    {
                        // skip already found matches
                        continue;
                    }

                    var found = FindMatch(current, scanners, matches);
                }
            }

            // Part 1
            var distinct = scanners.SelectMany(x => x)
                .Distinct()
                .OrderBy(x => x.X).ThenBy(x => x.Y).ThenBy(x => x.Z)
                .ToList();

            //Print(distinct);

            // Part 2
            var sums = new List<int>();
            for (int i = 0; i < scanners.Count; i++)
            {
                for (int j = 0; j < scanners.Count; j++)
                {
                    var diff = matches[i].Position - matches[j].Position;
                    var distance = Math.Abs(diff.X) + Math.Abs(diff.Y) + Math.Abs(diff.Z);
                    sums.Add(distance);
                }
            }

            return (distinct.Count.ToString(), sums.Max().ToString());
        }

        private bool FindMatch(int current, List<List<Position>> scanners, MatchResult[] matches)
        {
            for (var matchWith = 0; matchWith < scanners.Count; matchWith++)
            {
                if (matches[matchWith] == null)
                {
                    continue;
                }

                var match = Match(scanners[matchWith], scanners[current]);
                if (match != null)
                {
                    // Console.WriteLine($"{current} with {matchWith} at {match}, rotation: {scanners[matchWith].First().Orientation}");

                    var matchPosition = matches[matchWith];
                    matches[current] = new MatchResult
                    {
                        MatchWith = matchWith,
                        RelativeTo = matchPosition.RelativeTo,
                        Position = match,
                    };

                    scanners[current].ForEach(x => x.Add(match));

                    return true;
                }
            }

            return false;
        }

        private void Print<T>(List<T> list)
        {
            list.ForEach(x => Console.WriteLine(x));
            Console.WriteLine();
        }

        private Position? Match(List<Position> becon1, List<Position> becon2)
        {
            var orientation = new ScannerOrientation();
            do
            {
                becon2.ForEach(x => x.Rotate(orientation));

                var potentialScanner2Position = becon1
                    .SelectMany(x => becon2.Select(y => x - y))
                    .GroupBy(x => x);

                var max = potentialScanner2Position.Where(g => g.Count() >= 12).ToList();
                if (max.Any())
                {
                    return max.First().Key;
                }

                orientation.Rotate();
            } while (!orientation.IsFullCircle);

            return null;
        }

        public class ScannerOrientation
        {
            public int XRotation { get; set; }

            public int YRotation { get; set; }

            public int ZRotation { get; set; }

            public bool IsFullCircle => XRotation == 0 && YRotation == 0 && ZRotation == 0;

            public ScannerOrientation()
            {
            }
            public ScannerOrientation(int xRotation, int yRotation, int zRotation)
            {
                XRotation = xRotation;
                YRotation = yRotation;
                ZRotation = zRotation;
            }

            public void Rotate()
            {
                XRotation += 90;
                if (XRotation == 360)
                {
                    XRotation = 0;
                    YRotation += 90;
                    if (YRotation == 360)
                    {
                        YRotation = 0;
                        ZRotation += 90;
                        if (ZRotation == 360)
                        {
                            ZRotation = 0;
                        }
                    }
                }
            }

            public override string ToString()
            {
                return $"{XRotation} {YRotation} {ZRotation}";
            }

            public ScannerOrientation Clone()
            {
                return new ScannerOrientation(XRotation, YRotation, ZRotation);
            }

            public override int GetHashCode()
            {
                return ToString().GetHashCode();
            }

            public override bool Equals(object? obj)
            {
                var comp = obj as ScannerOrientation;
                if (comp == null)
                {
                    return false;
                }
                return XRotation == comp.XRotation && YRotation == comp.YRotation && ZRotation == comp.ZRotation;
            }
        }

        public class Position
        {
            public int X { get; set; }

            public int Y { get; set; }

            public int Z { get; set; }

            public ScannerOrientation Orientation { get; set; } = new ScannerOrientation();

            public Position(int x, int y, int z)
            {
                X = x;
                Y = y;
                Z = z;
            }

            public Position(string pos)
            {
                var split = pos.Split(",").Select(int.Parse).ToList();
                X = split[0];
                Y = split[1];
                Z = split[2];
            }

            public static Position operator -(Position a, Position b)
            {
                return new Position(a.X - b.X, a.Y - b.Y, a.Z - b.Z);
            }

            public static Position operator +(Position a, Position b)
            {
                return new Position(a.X + b.X, a.Y + b.Y, a.Z + b.Z);
            }

            public void Add(Position position)
            {
                X += position.X;
                Y += position.Y;
                Z += position.Z;
            }

            public override int GetHashCode()
            {
                return $"{X}{Y}{Z}".GetHashCode();
            }

            public override bool Equals(object? obj)
            {
                var pos = obj as Position;
                if (pos == null)
                {
                    return false;
                }

                return X == pos.X && Y == pos.Y && Z == pos.Z;
            }

            public void Rotate(ScannerOrientation scanner)
            {
                var xRotation = scanner.XRotation - Orientation.XRotation;
                var yRotation = scanner.YRotation - Orientation.YRotation;
                var zRotation = scanner.ZRotation - Orientation.ZRotation;

                Orientation = scanner.Clone();

                if (xRotation == 0 && yRotation == 0 && zRotation == 0)
                {
                    return;
                }

                if (xRotation == 90)
                {
                    (Y, Z) = (Z, -Y);
                }
                if (yRotation == 90)
                {
                    (X, Z) = (-Z, X);
                }
                if(zRotation == 90)
                {
                    (X, Y) = (-Y, X);
                }
            }

            public override string ToString()
            {
                return $"{X},{Y},{Z}";
            }
        }
        public class MatchResult
        {
            public int MatchWith { get; set; }

            public int RelativeTo { get; set; }

            public Position Position { get; set; }
        }
    }

}
