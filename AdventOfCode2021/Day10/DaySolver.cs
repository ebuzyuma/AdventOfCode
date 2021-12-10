namespace AdventOfCode2021.Day10
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "10";

        protected override string Solve(string[] input)
        {
            long result = 0;
            var openClose = new Dictionary<char, char>
            {
                [')'] = '(',
                ['}'] = '{',
                [']'] = '[',
                ['>'] = '<',
            };
            var notClosedItems = new List<List<char>>();
            foreach (var line in input)
            {
                var opened = new List<char>();
                bool isCorrupted = false;
                foreach (var item in line)
                {
                    bool isClose = openClose.ContainsKey(item);
                    if (isClose)
                    {
                        var open = openClose[item];
                        if (opened.Last() != open)
                        {
                            result += ScorePart1(item);
                            isCorrupted = true;
                            break;
                        }
                        else
                        {
                            opened.RemoveAt(opened.Count - 1);
                        }
                    }
                    else
                    {
                        opened.Add(item);
                    }
                }

                if (!isCorrupted)
                {
                    notClosedItems.Add(opened);
                }
            }

            var scores = new List<long>();
            foreach (var line in notClosedItems)
            {
                long score = 0;
                foreach (var item in line.AsEnumerable().Reverse())
                {
                    score = score * 5 + ScorePart2(item);
                }

                scores.Add(score);
            }

            var r2 = scores.OrderBy(x => x).ElementAt(scores.Count / 2);

            return r2.ToString();
        }

        private long ScorePart1(char item)
        {
            return item switch
            {
                ')' => 3,
                ']' => 57,
                '}' => 1197,
                '>' => 25137,
                _ => throw new Exception(),
            };
        }

        private long ScorePart2(char item)
        {
            return item switch
            {
                '(' => 1,
                '[' => 2,
                '{' => 3,
                '<' => 4,
                _ => throw new Exception(),
            };
        }
    }

}
