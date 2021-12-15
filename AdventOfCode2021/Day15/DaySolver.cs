namespace AdventOfCode2021.Day15
{
    public class DaySolver : SolverBase2
    {

        protected override string DayNo => "15";

        public class Node
        {
            public int Weight { get; set; }

            public int PathWeight { get; set; }

            public List<(int,int)>? Path { get; set; }
        }

        protected override (string, string) Solve(string[] input)
        {
            var directions = new List<(int, int)>
            {
                (0, -1),
                (1, 0),
                (0, 1),
                (-1, 0),
            };

            var size = input.Length;
            var nodes = new Node[size, size];
            
            // Prep for part 2
            var multiplier = 5;
            var nodes5 = new Node[size*5, size*5];
            
            for (int i = 0; i < input.Length; i++)
            {
                for (int j = 0; j < input.Length; j++)
                {
                    nodes[i, j] = new Node
                    {
                        Weight = int.Parse(input[i][j].ToString()),
                    };

                    for (int x = 0; x < multiplier; x++)
                    {
                        for (int y = 0; y < multiplier; y++)
                        {
                            var weight = nodes[i, j].Weight + x + y;
                            weight = weight > 9 ? weight - 9 : weight;
                            nodes5[x * size + i, y * size + j] = new Node
                            {
                                Weight = weight,
                            };

                        }
                    }
                }
            }

            //Print(nodes5);

            var part1 = BuildPathes(nodes, directions);
            
            var part2 = BuildPathes(nodes5, directions);


            return (part1.PathWeight.ToString(), part2.PathWeight.ToString());
        }

        private Node BuildPathes(Node[,] nodes, List<(int, int)> directions)
        {
            nodes[0, 0].Path = new List<(int, int)>();
            for (int i = 0; i < nodes.GetLength(0); i++)
            {
                for (int j = 0; j < nodes.GetLength(1); j++)
                {
                    if (i == 0 && j == 0)
                    {
                        continue;
                    }

                    CalculateNeighbours(i, j, directions, nodes);
                }
            }

            var result = nodes[nodes.GetLength(0) - 1, nodes.GetLength(1) - 1];
            return result;
        }

        private void CalculateNeighbours(int i, int j, List<(int, int)> directions, Node[,] nodes)
        {
            var node = nodes[i, j];
            var neighbours = directions
                .Select(x => (dir: x, neighbour: GetNeighbour(nodes, i, j, x.Item1, x.Item2)))
                .Where(x => x.neighbour?.Path != null)
                .ToList();

            var min = neighbours.MinBy(x => x.neighbour.PathWeight);

            node.Path = new List<(int, int)>();
            node.Path.AddRange(min.neighbour.Path);
            node.Path.Add((i + min.dir.Item1, j + min.dir.Item2));
            node.PathWeight = min.neighbour.PathWeight + node.Weight;

            var recalculatePath = neighbours.Where(x => x != min && x.neighbour.PathWeight - x.neighbour.Weight > node.PathWeight)
                .ToList();
            foreach (var item in recalculatePath)
            {
                CalculateNeighbours(i + item.dir.Item1, j + item.dir.Item2, directions, nodes);
            }
        }

        private void Print(Node[,] array)
        {
            for (int i = 0; i < array.GetLength(0); i++)
            {
                for (int j = 0; j < array.GetLength(1); j++)
                {
                    Console.Write($"{array[i, j].Weight} ");
                }
                Console.WriteLine();
            }
        }

        private T? GetNeighbour<T>(T[,] array, int i, int j, int iDir, int jDir)
        {
            i += iDir;
            j += jDir;
            if (i < 0 || i >= array.GetLength(0)
                || j < 0 || j >= array.GetLength(1))
            {
                return default(T);
            }

            return array[i,j];
        }
    }

}
