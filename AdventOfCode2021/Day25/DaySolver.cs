namespace AdventOfCode2021.Day25
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "25";

        protected override (string, string) Solve(string[] input)
        {
            var map = new char[input.Length, input[0].Length];
            for (int row = 0; row < input.Length; row++)
            {
                for (int col = 0; col < input[row].Length; col++)
                {
                    map[row, col] = input[row][col];
                }
            }

            int step = 0;
            Print(map);
            bool isMoved = true;
            while (isMoved)
            {
                map = Move(map, out isMoved);
                //Print(map);
                step++;
            }

            return (step.ToString(), "".ToString());
        }

        private char[,] Move(char[,] map, out bool isMoved)
        {
            map = MoveEast(map, out var isMovedEast);
            map = MoveSouth(map, out var isMovedSouth);
            isMoved = isMovedEast || isMovedSouth;
            return map;
        }

        private char[,] MoveEast(char[,] map, out bool isMovedEast)
        {
            isMovedEast = false;
            var newMap = (char[,])map.Clone();
            for (int row = 0; row < map.GetLength(0); row++)
            {
                for (int col = 0; col < map.GetLength(1); col++)
                {
                    if (map[row, col] != '>')
                    {
                        continue;
                    }

                    var nextEastPos = GetNextEastPos(row, col, map);
                    if (nextEastPos.HasValue)
                    {
                        isMovedEast = true;
                        newMap[row, col] = '.';
                        newMap[nextEastPos.Value.row, nextEastPos.Value.col] = '>';
                        col++;
                    }
                }
            }

            return newMap;
        }

        private (int row, int col)? GetNextEastPos(int row, int col, char[,] map)
        {
            col = (col + 1) % map.GetLength(1);
            return map[row, col] == '.' ? (row, col) : null;
        }
        
        private char[,] MoveSouth(char[,] map, out bool isMovedSouth)
        {
            isMovedSouth = false;
            var newMap = (char[,])map.Clone();
            for (int col = 0; col < map.GetLength(1); col++)
            {
                for (int row = 0; row < map.GetLength(0); row++)
                {
                    if (map[row, col] != 'v')
                    {
                        continue;
                    }

                    var nextEastPos = GetNextSouthPos(row, col, map);
                    if (nextEastPos.HasValue)
                    {
                        isMovedSouth = true;
                        newMap[row, col] = '.';
                        newMap[nextEastPos.Value.row, nextEastPos.Value.col] = 'v';
                        row++;
                    }
                }
            }

            return newMap;
        }

        private (int row, int col)? GetNextSouthPos(int row, int col, char[,] map)
        {
            row = (row + 1) % map.GetLength(0);
            return map[row, col] == '.' ? (row, col) : null;
        }

        private void Print(char[,] map)
        {
            for (int row = 0; row < map.GetLength(0); row++)
            {
                for (int col = 0; col < map.GetLength(1); col++)
                {
                    Console.Write(map[row, col]);
                }
                Console.WriteLine();
            }
            Console.WriteLine();
        }

        private void Print<T>(List<T> list)
        {
            list.ForEach(t => Console.WriteLine(t));
            Console.WriteLine();
        }
    }

}
