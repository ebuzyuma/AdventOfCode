namespace AdventOfCode2021.Day23
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "23";

        private static readonly HashSet<int> HallwayRoomsIndexes = new HashSet<int> { 2, 4, 6, 8 };
        private static readonly Dictionary<char, long> Costs = new Dictionary<char, long> { { 'A', 1 }, { 'B', 10 }, { 'C', 100 }, { 'D', 1000 } };
        private static readonly Dictionary<char, int> ExpectedPositions = new Dictionary<char, int> { { 'A', 0 }, { 'B', 1 }, { 'C', 2 }, { 'D', 3 }, { '.', -1 } };

        protected override (string, string) Solve(string[] input)
        {
            currentMin = long.MaxValue;
            var hallway = Enumerable.Repeat('.', input[1].Length - 2).ToArray();
            var amphipodsTopLevel = input[2].Trim().Replace("#", string.Empty).ToArray();
            var amphipodsBottomLevel = input[3].Trim().Replace("#", string.Empty).ToArray();
            var initState = new BurrowState(hallway, amphipodsTopLevel, amphipodsBottomLevel);

            var minBurrow = RotateToProperState(initState);

            ReplayMoves(initState, minBurrow.Moves);

            return (minBurrow.TotalCost.ToString(), "".ToString());
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

            //endStateCache[burrow.Key] = min;

            return min;
        }

        private void ReplayMoves(BurrowState burrow, List<Move> moves)
        {
            burrow.Print();
            var clone = burrow.Clone();
            foreach (var move in moves)
            {
                clone.Move(move);
                clone.Print();
            }
        }

        private static int ConvertRoomIndexToHallway(int room) => room * 2 + 2;

        public class BurrowState
        {
            public char[] Hallway { get; set; }
            public char[] AmphipodsTopLevel { get; set; }
            public char[] AmphipodsBottomLevel { get; set; }
            public long TotalCost { get; set; }
            public List<Move> Moves { get; set; } = new List<Move>();

            public string Key => $"{string.Join("", Hallway)}|{string.Join("", AmphipodsTopLevel)}|{string.Join("", AmphipodsBottomLevel)}";

            public BurrowState(char[] hallway, char[] amphipodsTopLevel, char[] amphipodsBottomLevel)
            {
                Hallway = hallway;
                AmphipodsTopLevel = amphipodsTopLevel;
                AmphipodsBottomLevel = amphipodsBottomLevel;
            }

            public BurrowState Clone()
            {
                var clone = new BurrowState(Hallway.ToArray(), AmphipodsTopLevel.ToArray(), AmphipodsBottomLevel.ToArray());
                clone.TotalCost = TotalCost;
                clone.Moves = Moves.ToList();
                return clone;
            }

            public bool IsFinalPosition()
            {
                return Enumerable.Range(0, AmphipodsBottomLevel.Length)
                    .All(i => IsOnRightPosition(i, AmphipodsTopLevel) && IsOnRightPosition(i, AmphipodsBottomLevel));
            }

            private bool IsOnRightPosition(int pos, char[] level)
            {
                return ExpectedPositions[level[pos]] == pos;
            }

            private bool IsEmptyPosition(int pos, char[] level) => level[pos] == '.';


            public void Print()
            {
                Console.WriteLine(string.Join("", Enumerable.Repeat('#', Hallway.Length + 2)));
                Console.WriteLine($"#{string.Join("", Hallway)}#");
                Console.WriteLine($"###{string.Join("#", AmphipodsTopLevel)}###");
                Console.WriteLine($"  #{string.Join("#", AmphipodsBottomLevel)}#  ");
                Console.WriteLine($"  #########  ");
            }

            public List<Move> GetAllPossibleMoves()
            {
                var moves = new List<Move>();
                for (int i = 0; i < Hallway.Length; i++)
                {
                    if (IsEmptyPosition(i, Hallway)) continue;

                    var amphipod = Hallway[i];
                    var expectedPosition = ExpectedPositions[amphipod];
                    if (IsCleanHallway(i, ConvertRoomIndexToHallway(expectedPosition), i)
                        && IsEmptyPosition(expectedPosition, AmphipodsTopLevel)
                        && (IsEmptyPosition(expectedPosition, AmphipodsBottomLevel) || IsOnRightPosition(expectedPosition, AmphipodsBottomLevel)))
                    {
                        var destination = AmphipodsBottomLevel[expectedPosition] == amphipod ? SourceType.TopLevel : SourceType.BottomLevel;
                        moves.Add(new Move(amphipod, i, SourceType.Hallway, expectedPosition, destination));
                    }
                }

                for (int i = 0; i < AmphipodsTopLevel.Length; i++)
                {
                    if (IsEmptyPosition(i, AmphipodsTopLevel)
                        || (IsOnRightPosition(i, AmphipodsTopLevel) && IsOnRightPosition(i, AmphipodsBottomLevel)))
                    {
                        continue;
                    }

                    var amphipod = AmphipodsTopLevel[i];
                    var expectedPosition = ExpectedPositions[amphipod];
                    if (IsCleanHallway(ConvertRoomIndexToHallway(i), ConvertRoomIndexToHallway(expectedPosition))
                        && IsEmptyPosition(expectedPosition, AmphipodsTopLevel)
                        && (IsEmptyPosition(expectedPosition, AmphipodsBottomLevel) || IsOnRightPosition(expectedPosition, AmphipodsBottomLevel)))
                    {
                        var destination = IsEmptyPosition(expectedPosition, AmphipodsBottomLevel) ? SourceType.BottomLevel : SourceType.TopLevel;
                        moves.Add(new Move(amphipod, i, SourceType.TopLevel, expectedPosition, destination));
                    }
                    else
                    {
                        var possible = PossibleHallwayPositions(ConvertRoomIndexToHallway(i))
                            .Select(x => new Move(amphipod, i, SourceType.TopLevel, x, SourceType.Hallway))
                            .ToList();
                        moves.AddRange(possible);
                    }
                }

                for (int i = 0; i < AmphipodsBottomLevel.Length; i++)
                {
                    if (IsEmptyPosition(i, AmphipodsBottomLevel) || IsOnRightPosition(i, AmphipodsBottomLevel)) continue;

                    var amphipod = AmphipodsBottomLevel[i];
                    var expectedPosition = ExpectedPositions[amphipod];
                    if (!IsEmptyPosition(i, AmphipodsTopLevel))
                    {
                        continue;
                    }
                    else if (IsCleanHallway(ConvertRoomIndexToHallway(i), ConvertRoomIndexToHallway(expectedPosition))
                        && IsEmptyPosition(expectedPosition, AmphipodsTopLevel)
                        && (IsEmptyPosition(expectedPosition, AmphipodsBottomLevel) || IsOnRightPosition(expectedPosition, AmphipodsBottomLevel)))
                    {
                        var destination = IsEmptyPosition(expectedPosition, AmphipodsBottomLevel) ? SourceType.BottomLevel : SourceType.TopLevel;
                        moves.Add(new Move(amphipod, i, SourceType.BottomLevel, expectedPosition, destination));
                    }
                    else
                    {
                        var possible = PossibleHallwayPositions(ConvertRoomIndexToHallway(i))
                            .Select(x => new Move(amphipod, i, SourceType.BottomLevel, x, SourceType.Hallway))
                            .ToList();
                        moves.AddRange(possible);
                    }
                }

                return moves;
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
                if (move.From == SourceType.TopLevel)
                {
                    AmphipodsTopLevel[move.FromPos] = '.';
                }
                else if (move.From == SourceType.BottomLevel)
                {
                    AmphipodsBottomLevel[move.FromPos] = '.';
                }
                else
                {
                    Hallway[move.FromPos] = '.';
                }

                if (move.To == SourceType.TopLevel)
                {
                    AmphipodsTopLevel[move.ToPos] = move.Amphipod;
                }
                else if (move.To == SourceType.BottomLevel)
                {
                    AmphipodsBottomLevel[move.ToPos] = move.Amphipod;
                }
                else
                {
                    Hallway[move.ToPos] = move.Amphipod;
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
            public SourceType From { get; set; }
            public int ToPos { get; set; }
            public SourceType To { get; set; }

            public Move(char amphipod, int fromPos, SourceType from, int toPos, SourceType to)
            {
                this.Amphipod = amphipod;
                this.FromPos = fromPos;
                this.From = from;
                this.ToPos = toPos;
                this.To = to;
            }

            public override string ToString()
            {
                return $"{Amphipod} from {FromPos} {From} to {ToPos} {To}";
            }

            public int Steps()
            {
                int result = 0;
                result += Math.Abs(From - SourceType.Hallway);
                result += Math.Abs(SourceType.Hallway - To);
                if (From == SourceType.Hallway)
                {
                    result += Math.Abs(FromPos - ConvertRoomIndexToHallway(ToPos));
                }
                else if (To == SourceType.Hallway)
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
