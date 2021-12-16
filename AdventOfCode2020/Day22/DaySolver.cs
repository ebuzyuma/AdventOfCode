using AdventOfCode2020.Utils;

namespace AdventOfCode2020.Day22
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "22";

        protected override (string part1, string part2) Solve(string[] input)
        {
            var split = InputParser.SplitByEmptyLine(input).ToList();
            var player1 = split[0].Skip(1).Select(int.Parse).ToList();
            var player2 = split[1].Skip(1).Select(int.Parse).ToList();

            // Part 1
            var winner = PlayCombat(new Queue<int>(player1), new Queue<int>(player2));
            var scorePart1 = CalculateScore(winner);

            // Part 1
            winner = PlayRecursiveCombat(new Queue<int>(player1), new Queue<int>(player2));
            var scorePart2 = CalculateScore(winner);


            return (scorePart1.ToString(), scorePart2.ToString());
        }

        private Queue<int> PlayCombat(Queue<int> player1, Queue<int> player2)
        {
            var winner = player1;
            while (player1.Count > 0 && player2.Count > 0)
            {
                winner = PlayCombatRound(player1, player2);
            }
            return winner;
        }

        private Queue<int> PlayRecursiveCombat(Queue<int> player1, Queue<int> player2)
        {
            var rounds = new HashSet<string>();
            var winner = player1;
            while (player1.Count > 0 && player2.Count > 0)
            {
                var key = $"{string.Join(",", player1)}_{string.Join(",", player2)}";
                if (rounds.Contains(key))
                {
                    // prevent infinite loop
                    return player1;
                }
                else
                {
                    rounds.Add(key);
                }
                winner = PlayRecursiveCombatRound(player1, player2);
            }

            return winner;
        }

        private int CalculateScore(Queue<int> cards)
        {
            var score = 0;
            var multiplier = cards.Count;
            while (cards.Count > 0)
            {
                var card = cards.Dequeue();
                score += card * multiplier;
                multiplier--;
            }

            return score;
        }

        private Queue<int> PlayCombatRound(Queue<int> player1, Queue<int> player2)
        {
            var p1 = player1.Dequeue();
            var p2 = player2.Dequeue();
            if (p1 > p2)
            {
                player1.Enqueue(p1);
                player1.Enqueue(p2);
                return player1;
            }
            else if (p1 < p2)
            {
                player2.Enqueue(p2);
                player2.Enqueue(p1);
                return player2;
            }
            else
            {
                throw new InvalidOperationException();
            }
        }

        private Queue<int> PlayRecursiveCombatRound(Queue<int> player1, Queue<int> player2)
        {
            var card1 = player1.Dequeue();
            var card2 = player2.Dequeue();
            var winner = player1;
            if (player1.Count >= card1 && player2.Count >= card2)
            {
                // Play recurse combat
                var player1Sub = new Queue<int>(player1.Take(card1));
                var player2Sub = new Queue<int>(player2.Take(card2));
                var subWinner = PlayRecursiveCombat(player1Sub, player2Sub);
                winner = subWinner == player1Sub ? player1 : player2;
            }
            else if (card1 > card2)
            {
                winner = player1;
            }
            else if (card1 < card2)
            {
                winner = player2;
            }
            else
            {
                throw new InvalidOperationException();
            }

            if (winner == player2)
            {
                // swap card to add properly
                (card1, card2) = (card2, card1);
            }

            winner.Enqueue(card1);
            winner.Enqueue(card2);

            return winner;
        }
    }
}
