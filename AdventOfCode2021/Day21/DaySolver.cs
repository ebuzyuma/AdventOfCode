namespace AdventOfCode2021.Day21
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "21";

        protected override (string, string) Solve(string[] input)
        {
            // Decrease position by 1 for ease of calculations = position index
            // And position score will be positionIndex + 1;
            var player1PositionIndex = long.Parse(input[0].Split(": ")[1]) - 1;
            var player2PositionIndex = long.Parse(input[1].Split(": ")[1]) - 1;

            // player number is not important, hence it's always turn of player 1

            // Part 1
            var dice = new DetermenisticDice();
            var player1 = new Player(player1PositionIndex, 0);
            var player2 = new Player(player2PositionIndex, 0);
            PlayGame(player1, player2, dice, 1000);

            var minScore = Math.Min(player1.TotalScore, player2.TotalScore);
            var part1 = minScore * dice.Count;


            // Part 2
            var universe = new Universe(new Player(player1PositionIndex, 0), new Player(player2PositionIndex, 0));
            var wins = CountWins(universe);
            var part2 = Math.Max(wins.player1, wins.player2);

            return (part1.ToString(), part2.ToString());
        }

        private Dictionary<string, (long, long)> wonCache = new Dictionary<string, (long, long)>();

        private (long player1, long player2) CountWins(Universe universe)
        {
            if (wonCache.TryGetValue(universe.ToString(), out var won))
            {
                return won;
            }

            var result = (player1: 0L, player2: 0L);
            var dice = new QuantumDice();

            // Iterate over all possible sums
            foreach (var value in dice.Values)
            {
                var player = universe.Player1.Clone();
                player.Move(value);

                if (player.TotalScore >= 21)
                {
                    result = (result.player1 + 1, result.player2);
                }
                else
                {
                    var newUniverse = new Universe(universe.Player2.Clone(), player); // Swap player for move of player 2 
                    var subResult = CountWins(newUniverse);
                    result = (result.player1 + subResult.player2, result.player2 + subResult.player1); // swap sum of subresult as well
                }
            }

            wonCache.Add(universe.ToString(), result);
            return result;
        }

        public class Universe
        {
            public Player Player1 { get; set; }

            public Player Player2 { get; set; }

            public Universe(Player player1, Player player2)
            {
                Player1 = player1;
                Player2 = player2;
            }

            public override string ToString()
            {
                return $"{Player1}, {Player2}";
            }
        }

        public class QuantumDice
        {
            public List<int> Values { get; set; } = new List<int>();

            public QuantumDice()
            {
                for (int x = 1; x <= 3; x++)
                {
                    for (int y = 1; y <= 3; y++)
                    {
                        for (int z = 1; z <= 3; z++)
                        {
                            Values.Add(x + y + z);
                        }
                    }
                }
            }
        }

        private void PlayGame(Player player1, Player player2, DetermenisticDice dice, long maxScore)
        {
            while (player1.TotalScore < maxScore && player2.TotalScore < maxScore)
            {
                var sum = dice.Throw() + dice.Throw() + dice.Throw();
                player1.Move(sum);

                (player1, player2) = (player2, player1);
            }
        }

        public class DetermenisticDice
        {
            public List<int> Values { get; set; } = Enumerable.Range(1, 100).ToList();

            public int Current { get; set; }

            public long Count { get; set; }

            public int Throw()
            {
                Count++;
                if (Current == Values.Count)
                {
                    Current = 0;
                }

                return Values[Current++];
            }
        }

        public class Player
        {
            public long PositionIndex { get; set; }

            public long PositionScore => PositionIndex + 1;

            public long TotalScore { get; set; }

            public Player()
            {
            }

            public Player(long position, long score)
            {
                PositionIndex = position;
                TotalScore = score;
            }

            public void Move(long sum)
            {
                PositionIndex = (PositionIndex + sum) % 10;
                TotalScore += PositionScore;
            }

            public Player Clone()
            {
                return new Player(PositionIndex, TotalScore);
            }

            public override string ToString()
            {
                return $"{PositionIndex + 1}: {TotalScore}";
            }
        }
    }
}
