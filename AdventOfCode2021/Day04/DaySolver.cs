using AdventOfCode2021.Utils;

namespace AdventOfCode2021.Day04
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "04";

        protected override string Solve(string[] input)
        {
            var numbers = input[0].Split(",").Select(int.Parse).ToList();

            var boards = new Dictionary<int, List<Dictionary<int, bool>>>();
            var board = new List<Dictionary<int, bool>>();
            for (int i = 2; i < input.Length; i++)
            {

                if (string.IsNullOrEmpty(input[i]))
                {
                    boards.Add(boards.Count + 1, board);
                    board = new List<Dictionary<int, bool>>();
                }
                else
                {
                    var lineNumbers = input[i].Split(" ", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList();
                    board.Add(lineNumbers.ToDictionary(k => k, v => false));
                }
            }

            List<Dictionary<int, bool>> winner = null;
            var winners = new HashSet<int>();
            int winNumber = 0;
            for (int i = 0; i < numbers.Count; i++)
            {
                bool isAllWon = true;
                foreach (var player in boards)
                {
                    foreach (var item in player.Value)
                    {
                        if (item.ContainsKey(numbers[i]))
                        {
                            item[numbers[i]] = true;
                        }
                    }

                    if (IsLineCompleted(player.Value))
                    {
                        if (!winners.Contains(player.Key))
                        {
                            winner = player.Value;
                        }
                        winners.Add(player.Key);
                        winNumber = numbers[i];
                    }
                    else
                    {
                        isAllWon = false;
                    }
                }

                if (isAllWon)
                {
                    break;
                }
            }

            var sum = winner.SelectMany(x => x.ToList().Where(y => !y.Value)).Sum(kv => kv.Key);

            return (sum * winNumber).ToString();
        }

        private bool IsLineCompleted(List<Dictionary<int, bool>> matrix)
        {
            if (matrix.Any(x => x.All(y => y.Value)))
            {
                return true;
            }
            for (int i = 0; i < 5; i++)
            {
                if (matrix.Select(x => x.Values.ToList()[i]).All(x => x))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
