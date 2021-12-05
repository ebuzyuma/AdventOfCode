namespace AdventOfCode2020.Day17
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "17";

        protected string Solve1(string[] input)

        {
            int cycles = 6;
            int maxSize = cycles * 2 + 3 + input[0].Length;
            char[][][] currentGen = new char[maxSize][][];
            char[][][] nextGen = new char[maxSize][][];

            for (int i = 0; i < currentGen.Length; i++)
            {
                currentGen[i] = new char[maxSize][];
                nextGen[i] = new char[maxSize][];
                for (int j = 0; j < currentGen[i].Length; j++)
                {
                    currentGen[i][j] = Enumerable.Repeat('.', maxSize).ToArray();
                    nextGen[i][j] = Enumerable.Repeat('.', maxSize).ToArray();
                }
            }

            for (var i = 0; i < input.Length; i++)
            {
                for (int j = 0; j < input[i].Length; j++)
                {
                    currentGen[cycles + 2][cycles + 2 + i][cycles + 2 + j] = input[i][j];
                }
            }

            PrintLayer(currentGen[cycles + 2]);
            for (int n = 0; n < cycles; n++)
            {
                for (int i = 0; i < currentGen.Length; i++)
                {
                    for (int j = 0; j < currentGen[i].Length; j++)
                    {
                        for (int k = 0; k < currentGen[i][j].Length; k++)
                        {
                            var current = currentGen[i][j][k];
                            var count = CountActiveNeighbours(currentGen, i, j, k);
                            if (current == '#' )
                            {
                                nextGen[i][j][k] = (count == 2 || count == 3) ? '#' : '.';
                            }
                            else if (current == '.')
                            {
                                nextGen[i][j][k] =  count == 3 ? '#' : '.';
                            }
                        }
                    }
                }

                var tmp = currentGen;
                currentGen = nextGen;
                nextGen = tmp; // use tmp for memory reduce

                PrintLayer(currentGen[cycles + 2]);
            }

            var active = currentGen.SelectMany(x => x.SelectMany(y => y)).Count(x => x == '#');
            return active.ToString();
        }

        protected override string Solve(string[] input)
        {
            int cycles = 6;
            int maxSize = cycles * 2 + 3 + input[0].Length;
            char[][][][] currentGen = new char[maxSize][][][];
            char[][][][] nextGen = new char[maxSize][][][];

            for (int i = 0; i < currentGen.Length; i++)
            {
                currentGen[i] = new char[maxSize][][];
                nextGen[i] = new char[maxSize][][];
                for (int j = 0; j < currentGen[i].Length; j++)
                {
                    currentGen[i][j] = new char[maxSize][];
                    nextGen[i][j] = new char[maxSize][];
                    for (int k = 0; k < maxSize; k++)
                    {
                        currentGen[i][j][k] = Enumerable.Repeat('.', maxSize).ToArray();
                        nextGen[i][j][k] = Enumerable.Repeat('.', maxSize).ToArray();
                    }
                }
            }

            for (var i = 0; i < input.Length; i++)
            {
                for (int j = 0; j < input[i].Length; j++)
                {
                    currentGen[cycles + 2][cycles + 2][cycles + 2 + i][cycles + 2 + j] = input[i][j];
                }
            }

            PrintLayer(currentGen[cycles + 2][cycles + 2]);
            for (int n = 0; n < cycles; n++)
            {
                for (int i = 0; i < currentGen.Length; i++)
                {
                    for (int j = 0; j < currentGen[i].Length; j++)
                    {
                        for (int k = 0; k < currentGen[i][j].Length; k++)
                        {
                            for (int m = 0; m < currentGen[i][j][k].Length; m++)
                            {
                                var current = currentGen[i][j][k][m];
                                var count = CountActiveNeighbours(currentGen, i, j, k, m);
                                if (current == '#')
                                {
                                    nextGen[i][j][k][m] = (count == 2 || count == 3) ? '#' : '.';
                                }
                                else if (current == '.')
                                {
                                    nextGen[i][j][k][m] = count == 3 ? '#' : '.';
                                }
                            }
                        }
                    }
                }

                var tmp = currentGen;
                currentGen = nextGen;
                nextGen = tmp; // use tmp for memory reduce

                PrintLayer(currentGen[cycles + 2][cycles + 2]);
            }

            var active = currentGen.SelectMany(x => x.SelectMany(y => y.SelectMany(z => z))).Count(x => x == '#');
            return active.ToString();
        }


        private void PrintLayer(char[][] layer)
        {
            Console.Clear();
            for (int i = 0; i < layer.Length; i++)
            {
                Console.WriteLine(string.Join("", layer[i]));
            }
            Thread.Sleep(1000);
        }

        private int CountActiveNeighbours(char[][][] cubes, int i, int j, int k)
        {
            int active = 0;
            for (int x = -1; x <= 1; x++)
            {
                for (int y = -1; y <= 1; y++)
                {
                    for (int z = -1; z <= 1; z++)
                    {
                        if (x != 0 || y != 0 || z != 0)
                        {
                            var n = GetNieghbour(cubes, i, j, k, x, y, z);
                            if (n == '#')
                            {
                                active++;
                            }
                        }
                    }
                }
            }

            return active;
        }

        private char? GetNieghbour(char[][][] cubes, int i, int j, int k, int idir, int jdir, int kdir)
        {
            i = i + idir;
            j = j + jdir;
            k = k + kdir;
            if (i < 0 || i >= cubes.Length
                || j < 0 || j >= cubes[i].Length
                || k < 0 || k >= cubes[i][j].Length)
            {
                return null;
            }

            return cubes[i][j][k];
        }

        private int CountActiveNeighbours(char[][][][] cubes, int i, int j, int k, int m)
        {
            int active = 0;
            for (int x = -1; x <= 1; x++)
            {
                for (int y = -1; y <= 1; y++)
                {
                    for (int z = -1; z <= 1; z++)
                    {
                        for (int w = -1; w <= 1; w++)
                        {
                            if (x != 0 || y != 0 || z != 0 || w != 0)
                            {
                                var n = GetNieghbour(cubes, i, j, k, m, x, y, z, w);
                                if (n == '#')
                                {
                                    active++;
                                }
                            }
                        }
                    }
                }
            }

            return active;
        }

        private char? GetNieghbour(char[][][][] cubes, int i, int j, int k, int m, int idir, int jdir, int kdir, int mdir)
        {
            i = i + idir;
            j = j + jdir;
            k = k + kdir;
            m = m + mdir;
            if (i < 0 || i >= cubes.Length
                || j < 0 || j >= cubes[i].Length
                || k < 0 || k >= cubes[i][j].Length
                || m < 0 || m >= cubes[i][j][k].Length)
            {
                return null;
            }

            return cubes[i][j][k][m];
        }
    }
}
