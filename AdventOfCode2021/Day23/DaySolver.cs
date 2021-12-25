namespace AdventOfCode2021.Day23
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "23";

        private static readonly HashSet<int> HallwayRoomsIndexes = new HashSet<int> { 2, 4, 6, 8 };
        private static readonly Dictionary<char, long> Costs = new Dictionary<char, long> { { 'A', 1 }, { 'B', 10 }, { 'C', 100 }, { 'D', 1000 } };
        private static readonly Dictionary<char, int> ExpectedRooms = new Dictionary<char, int> { { 'A', 0 }, { 'B', 1 }, { 'C', 2 }, { 'D', 3 }, { '.', -1 } };

        protected override (string, string) Solve(string[] input)
        {
            currentMin = long.MaxValue;
            var hallway = Enumerable.Repeat('.', input[1].Length - 2).ToArray();
            var amphipodsTopLevel = input[2].Trim().Replace("#", string.Empty).ToArray();
            var amphipodsBottomLevel = input[3].Trim().Replace("#", string.Empty).ToArray();

            // Part 1
            var initState1 = new BurrowState(hallway, new[] { amphipodsTopLevel, amphipodsBottomLevel });
            var minBurrow1 = RotateToProperState(initState1);

            // Part 2
            var middle1 = new[] { 'D', 'C', 'B', 'A' };
            var middle2 = new[] { 'D', 'B', 'A', 'C' };
            var initState2 = new BurrowState(hallway, new[] { amphipodsTopLevel, middle1, middle2, amphipodsBottomLevel });
            var minBurrow2 = RotateToProperState(initState2);


            return (minBurrow1.TotalCost.ToString(), minBurrow2.TotalCost.ToString());
        }

        private long currentMin = long.MaxValue;
        private Dictionary<string, BurrowState> endStateCache = new Dictionary<string, BurrowState>();
        private BurrowState? RotateToProperState(BurrowState burrow)
        {
            //Console.WriteLine(burrow.TotalCost);
            //burrow.Print();

            if (endStateCache.TryGetValue(burrow.Key, out var value))
            {
                return value;
            }

            if (burrow.IsFinalPosition())
            {
                currentMin = Math.Min(burrow.TotalCost, currentMin);
                return burrow;
            }

            BurrowState? min = null;
            var moves = burrow.GetAllPossibleMoves();
            foreach (var move in moves)
            {
                //Console.WriteLine($"Start Move: {move}");
                var clone = burrow.Clone();
                clone.Move(move);
                if (clone.TotalCost > currentMin)
                {
                    // no need to go further, already found a better solution
                    continue;
                }

                clone = RotateToProperState(clone);                
                if (clone != null && (min == null || clone.TotalCost < min.TotalCost))
                {
                    min = clone;
                }

                //Console.WriteLine($"End Move: {move}");
                //burrow.Print();
            }

            // cache does not work becuase we should merge initial steps to get accurate total score
            // endStateCache[burrow.Key] = min;

            return min;
        }

        private void ReplayMoves(BurrowState burrow, List<Move> moves)
        {
            var clone = burrow.Clone();
            foreach (var move in moves)
            {
                Console.WriteLine(clone.TotalCost);
                clone.Print();
                Console.WriteLine(move);
                clone.Move(move);
            }

            clone.Print();
        }

        private static int ConvertRoomIndexToHallway(int room) => room * 2 + 2;

        public class BurrowState
        {
            public char[] Hallway { get; set; }
            public char[][] Levels { get; set; }
            public long TotalCost { get; set; }
            public List<Move> Moves { get; set; } = new List<Move>();

            public string Key => $"{string.Join("", Hallway)}\n" +
                $"  {string.Join("  \n  ", Levels.Select(x => string.Join(" ", x)))}  ";

            public BurrowState(char[] hallway, char[][] levels)
            {
                Hallway = hallway;
                Levels = levels;
            }

            public BurrowState Clone()
            {
                var clone = new BurrowState(Hallway.ToArray(), Levels.Select(x => x.ToArray()).ToArray());
                clone.TotalCost = TotalCost;
                clone.Moves = Moves.ToList();
                return clone;
            }

            public bool IsFinalPosition()
            {
                return Levels.All(lvl => Enumerable.Range(0, lvl.Length).All(i => IsOnRightPosition(i, lvl)));
            }

            private bool IsOnRightPosition(int pos, char[] level)
            {
                return ExpectedRooms[level[pos]] == pos;
            }

            private bool IsEmptyPosition(int pos, char[] level) => level[pos] == '.';


            public void Print()
            {
                Console.WriteLine(string.Join("", Enumerable.Repeat('#', Hallway.Length + 2)));
                Console.WriteLine($"#{string.Join("", Hallway)}#");
                for (int i = 0; i < Levels.Length; i++)
                {
                    Console.WriteLine($"{(i == 0 ? "##" : "  ")}#{string.Join("#", Levels[i])}#{(i == 0 ? "##" : "  ")}");
                }
                Console.WriteLine($"  #########  ");
            }

            public List<Move> GetAllPossibleMoves()
            {
                var moves = new List<Move>();
                for (int i = 0; i < Hallway.Length; i++)
                {
                    if (IsEmptyPosition(i, Hallway)) continue;

                    var amphipod = Hallway[i];
                    var expectedRoom = ExpectedRooms[amphipod];
                    if (IsCleanHallway(i, ConvertRoomIndexToHallway(expectedRoom), i)
                        && IsRoomAvailable(amphipod, expectedRoom, out var destinationLevel))
                    {
                        moves.Add(new Move(amphipod, i, -1, expectedRoom, destinationLevel.Value));
                    }
                }

                for (int i = 0; i < Levels[0].Length; i++)
                {
                    // iterate over rooms
                    int currentLevel = 0;
                    while (currentLevel < Levels.Length && IsEmptyPosition(i, Levels[currentLevel])) currentLevel++;
                    if (currentLevel == Levels.Length)
                    {
                        // room is empty at all
                        continue;
                    }

                    var amphipod = Levels[currentLevel][i];
                    var expectedRoom = ExpectedRooms[amphipod];
                    if (i == expectedRoom && IsRoomFilledWithProperAmphipods(amphipod, expectedRoom))
                    {
                        continue;
                    }
                    else if (IsCleanHallway(ConvertRoomIndexToHallway(i), ConvertRoomIndexToHallway(expectedRoom))
                        && IsRoomAvailable(amphipod, expectedRoom, out var destinationLevel))
                    {
                        // we could move directly
                        moves.Add(new Move(amphipod, i, currentLevel, expectedRoom, destinationLevel.Value));
                    }
                    else
                    {
                        var possible = PossibleHallwayPositions(ConvertRoomIndexToHallway(i))
                            .Select(x => new Move(amphipod, i, currentLevel, x, -1))
                            .ToList();
                        moves.AddRange(possible);
                    }
                }

                return moves;
            }

            private bool IsRoomFilledWithProperAmphipods(char amphibot, int room)
            {
                return Levels.Select(x => x[room]).All(a => a == '.' || a == amphibot);
            }

            private bool IsRoomAvailable(char amphipod, int room, out int? level)
            {
                level = null;
                var expectedChar = amphipod;

                for (int currentLevel = Levels.Length - 1; currentLevel >= 0; currentLevel--)
                {
                    if (Levels[currentLevel][room] == expectedChar)
                    {
                        continue;
                    }
                    else
                    {
                        if (Levels[currentLevel][room] == '.')
                        {
                            expectedChar = '.';
                            level = currentLevel;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }

                return level.HasValue;
            }

            private List<int> PossibleHallwayPositions(int startHallwayPos)
            {
                var possiblePositions = new List<int>();
                for (int i = startHallwayPos + 1; i < Hallway.Length; i++)
                {
                    if (!IsEmptyPosition(i, Hallway)) break;
                    
                    if (!HallwayRoomsIndexes.Contains(i))
                    {
                        possiblePositions.Add(i);
                    }
                }
                for (int i = startHallwayPos - 1; i >= 0; i--)
                {
                    if (!IsEmptyPosition(i, Hallway)) break;

                    if (!HallwayRoomsIndexes.Contains(i))
                    {
                        possiblePositions.Add(i);
                    }
                }

                possiblePositions.Sort();
                return possiblePositions;
            }

            public void Move(Move move)
            {
                Moves.Add(move);
                TotalCost += Costs[move.Amphipod] * move.Steps();
                if (move.FromLevel == -1)
                {
                    Hallway[move.FromPos] = '.';
                }
                else
                {
                    Levels[move.FromLevel][move.FromPos] = '.';
                }

                if (move.ToLevel == -1)
                {
                    Hallway[move.ToPos] = move.Amphipod;
                }
                else
                {
                    Levels[move.ToLevel][move.ToPos] = move.Amphipod;
                }
            }

            public bool IsCleanHallway(int start, int end, int? exclude = null)
            {
                var left = Math.Min(start, end);
                var right = Math.Max(start, end);
                for (int i = left; i <= right; i++)
                {
                    if (i != exclude && !IsEmptyPosition(i, Hallway))
                    {
                        return false;
                    }
                }

                return true;
            }
        }

        public enum SourceType
        {
            Hallway, TopLevel, BottomLevel,
        }

        public class Move
        {
            public char Amphipod { get; set; }
            public int FromPos { get; set; }
            public int FromLevel { get; set; }
            public int ToPos { get; set; }
            public int ToLevel { get; set; }

            public Move(char amphipod, int fromPos, int fromLevel, int toPos, int toLevel)
            {
                this.Amphipod = amphipod;
                this.FromPos = fromPos;
                this.FromLevel = fromLevel;
                this.ToPos = toPos;
                this.ToLevel = toLevel;
            }

            public override string ToString()
            {
                string fromStr = FromLevel == -1 ? "Hallway" : $"Level{FromLevel}";
                string toStr = ToLevel == -1 ? "Hallway" : $"Level{ToLevel}";
                return $"{Amphipod} from {FromPos} {fromStr} to {ToPos} {toStr}";
            }

            public int Steps()
            {
                int result = 0;
                result += FromLevel + 1;
                result += ToLevel + 1;
                if (FromLevel == -1)
                {
                    result += Math.Abs(FromPos - ConvertRoomIndexToHallway(ToPos));
                }
                else if (ToLevel == -1)
                {
                    result += Math.Abs(ToPos - ConvertRoomIndexToHallway(FromPos));
                }
                else
                {
                    result += Math.Abs(ConvertRoomIndexToHallway(ToPos) - ConvertRoomIndexToHallway(FromPos));
                }

                return result;
            }
        }
    }
}
