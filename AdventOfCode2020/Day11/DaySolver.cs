namespace AdventOfCode2020.Day11
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "11";

        protected override string Solve(string[] input)
        {
            bool changes = true;

            char[][] preState = input.Select(x => x.ToCharArray()).ToArray();
            char[][] newState = input.Select(x => x.ToCharArray()).ToArray();

            int iteration = 0;
            while (changes)
            {
                changes = false;
                preState = newState.Select(x => (char[])x.Clone()).ToArray();
                Console.Clear();
                Console.WriteLine(iteration++);
                foreach (var line in preState)
                {
                    Console.WriteLine(line);
                }

                Thread.Sleep(10);

                for (int i = 0; i < input.Length; i++)
                {
                    for (int j = 0; j < input[i].Length; j++)
                    {
                        if (preState[i][j] == 'L' && !HasNeighbours(preState, i, j))
                        {
                            changes = true;
                            newState[i][j] = '#';
                        }
                        else if (preState[i][j] == '#' && HasTooManyNeighbours(preState, i, j))
                        {
                            changes = true;
                            newState[i][j] = 'L';
                        }
                    }
                }
            }

            Console.Clear();
            foreach (var line in preState)
            {
                Console.WriteLine(line);
            }

            Thread.Sleep(1000);


            Console.Clear();
            foreach (var line in preState)
            {
                Console.WriteLine(line);
            }

            Thread.Sleep(1000);


            return newState.SelectMany(x => x).Count(x => x == '#').ToString();
        }

        private bool HasTooManyNeighbours(char[][] state, int i, int j)
        {
            var neighbours = new List<char?>()
            {
                GetNeighbour(state, i, j, -1, -1),
                GetNeighbour(state, i, j, -1, 0),
                GetNeighbour(state, i, j, -1, +1),
                GetNeighbour(state, i, j, 0, -1),
                GetNeighbour(state, i, j, 0, +1),
                GetNeighbour(state, i, j, +1, -1),
                GetNeighbour(state, i, j, +1, 0),
                GetNeighbour(state, i, j, +1, +1),
            };

            return neighbours.Count(x => x == '#') >= 5;
        }

        private bool HasNeighbours(char[][] state, int i, int j)
        {
            var neighbours = new List<char?>()
            {
                GetNeighbour(state, i, j, -1, -1),
                GetNeighbour(state, i, j, -1, 0),
                GetNeighbour(state, i, j, -1, +1),
                GetNeighbour(state, i, j, 0, -1),
                GetNeighbour(state, i, j, 0, +1),
                GetNeighbour(state, i, j, +1, -1),
                GetNeighbour(state, i, j, +1, 0),
                GetNeighbour(state, i, j, +1, +1),
            };

            return neighbours.Any(x => x == '#');
        }

        private char? GetNeighbour(char[][] state, int i, int j, int iDir, int jDir)
        {
            if (i + iDir < 0 || j + jDir < 0
                || i + iDir >= state.Length || j + jDir >= state[i].Length)
            {
                return null;
            }

            char neighbour = state[i + iDir][j + jDir];
            if (neighbour != '.')
            {
                return neighbour;
            }

            return GetNeighbour(state, i + iDir, j + jDir, iDir, jDir);
        }
    }
}
