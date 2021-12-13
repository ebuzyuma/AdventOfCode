using AdventOfCode2020.Utils;
using System.Text.RegularExpressions;

namespace AdventOfCode2020.Day20
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "20";

        protected override (string, string) Solve(string[] input)
        {
            var camerasList = InputParser.SplitByEmptyLine(input)
                .Select(x => new CameraInfo(
                    id: int.Parse(InputParser.GetGroup(x[0], @"Tile (?<id>\d+):", "id")),
                    lines: x.Skip(1).ToList()
                ))
                .ToList();

            var camerasArray = ArrangeCameras(camerasList);

            // Part 1
            int size = camerasArray.GetLength(0);
            var cornersProduct = camerasArray[0, 0].Id
                * camerasArray[0, size - 1].Id
                * camerasArray[size - 1, 0].Id
                * camerasArray[size - 1, size - 1].Id;

            
            // Part 2
            var image = BuildImage(camerasArray);
            
            var seeMonster = new List<string>
            {
                "                  # ".Replace(" ", "."),
                "#    ##    ##    ###".Replace(" ", "."),
                " #  #  #  #  #  #   ".Replace(" ", "."),
            };

            var singleCamera = new CameraInfo(0, image);
            var monsters = FindSeeMonsters(singleCamera, seeMonster);
            image = singleCamera.Lines;

            // Draw monsters on image
            var seeMonsterWidth = seeMonster.First().Length;
            foreach (var monster in monsters)
            {
                for (int m = 0; m < seeMonster.Count; m++)
                {
                    var newString = singleCamera.Lines[monster.row + m].Substring(monster.column, seeMonsterWidth)
                        .Select((x, pos) => seeMonster[m][pos] == '#' ? 'O' : x)
                        .ToList();
                    image[monster.row + m] = image[monster.row + m].Substring(0, monster.column)
                        + string.Join(string.Empty, newString)
                        + image[monster.row + m].Substring(monster.column + seeMonsterWidth);
                }
            }

            Print(image);

            var roughness = image.Sum(x => x.Count(y => y == '#'));

            return (cornersProduct.ToString(), roughness.ToString());
        }

        private CameraInfo[,] ArrangeCameras(List<CameraInfo> cameras)
        {
            // idea:
            // place first camera image as-is on position (0, 0)
            // then fit neighbours recursively
            var availableCamers = cameras.ToList();
            var camerasDict = new Dictionary<(int row, int column), CameraInfo>
            {
                [(0, 0)] = availableCamers.First()
            };
            availableCamers.RemoveAt(0);
            FitNeighbours(0, 0, availableCamers, camerasDict);

            // Create a 2d array from cameras dictionary
            int size = (int)Math.Sqrt(camerasDict.Count);
            int minRow = camerasDict.Keys.Min(x => x.row);
            int minColumn = camerasDict.Keys.Min(x => x.column);
            var camerasArray = new CameraInfo[size, size];
            for (int i = 0; i < size; i++)
            {
                for (int j = 0; j < size; j++)
                {
                    var key = (minRow + i, minColumn + j);
                    var current = camerasDict[key];
                    camerasArray[i, j] = current;
                    Console.Write($"{camerasArray[i, j].Id} ");
                }
                Console.WriteLine();
            }

            return camerasArray;
        }

        private List<string> BuildImage(CameraInfo[,] camerasArray)
        {
            int size = camerasArray.GetLength(0);
            var cameraImageSize = camerasArray[0,0].Lines.Count - 2;
            var image = Enumerable.Repeat(string.Empty, cameraImageSize * size).ToList();
            for (int i = 0; i < size; i++)
            {
                for (int j = 0; j < size; j++)
                {
                    for (int k = 0; k < cameraImageSize; k++)
                    {
                        image[i * cameraImageSize + k] += camerasArray[i, j].Lines[k + 1].Substring(1, cameraImageSize);
                    }
                }
            }

            return image;
        }

        private List<(int row, int column)> FindSeeMonsters(CameraInfo image, List<string> seeMonster)
        {
            var monsters = new List<(int, int)>();
            var seeMonsterWidth = seeMonster.First().Length;
            int maxColumnStart = image.Lines.First().Length - seeMonsterWidth;

            while (monsters.Count == 0)
            {
                for (int i = 0; i < image.Lines.Count - 2; i++)
                {
                    for (int j = 0; j <= maxColumnStart; j++)
                    {
                        if (Enumerable.Range(0, seeMonster.Count)
                            .All(m => Regex.IsMatch(image.Lines[i + m].Substring(j, seeMonsterWidth), seeMonster[m])))
                        {
                            monsters.Add((i, j));
                            j += seeMonsterWidth - 1;
                        }
                    }
                }

                if (monsters.Count == 0)
                {
                    if (image.Rotation < 3)
                    {
                        RotateClockwise(image);
                    }
                    else
                    {
                        if (!TryFlip(image))
                        {
                            throw new Exception("Failed to find monsters in any vairation");
                        }
                    }
                }
            }

            return monsters;
        }

        private void FitNeighbours(int row, int column, List<CameraInfo> availableCameras, Dictionary<(int row, int column), CameraInfo> camerasDict)
        {
            var currentTile = camerasDict[(row, column)];

            var upMatchTile = camerasDict.ContainsKey((row - 1, column))
                ? null
                : FindMatch(currentTile, IsMatchUp, availableCameras);
            if (upMatchTile != null)
            {
                availableCameras.Remove(upMatchTile);
                camerasDict[(row - 1, column)] = upMatchTile;
                bool isUpNotFitLeftRightNeighbours =
                    (camerasDict.TryGetValue((row - 1, column - 1), out var left) && !IsMatchLeft(upMatchTile.Lines, left.Lines))
                    || (camerasDict.TryGetValue((row - 1, column + 1), out var right) && !IsMatchRight(upMatchTile.Lines, right.Lines));
                if (isUpNotFitLeftRightNeighbours)
                {
                    // check that we could safely flip the puzzle
                    var matchBorder = upMatchTile.Lines.Last().AsEnumerable();
                    if (!matchBorder.SequenceEqual(matchBorder.Reverse()))
                    {
                        throw new Exception("Failed to solve the puzzle");
                    }
                    upMatchTile.Lines = FlipOverVertical(upMatchTile.Lines);
                }

                FitNeighbours(row-1, column, availableCameras, camerasDict);
            }

            var downMatchTile = camerasDict.ContainsKey((row + 1, column))
                ? null
                : FindMatch(currentTile, IsMatchDown, availableCameras);
            if (downMatchTile != null)
            {
                availableCameras.Remove(downMatchTile);
                camerasDict[(row + 1, column)] = downMatchTile;
                bool isDownNotFitLeftRightNeighbours =
                    (camerasDict.TryGetValue((row + 1, column - 1), out var left) && !IsMatchLeft(downMatchTile.Lines, left.Lines))
                    || (camerasDict.TryGetValue((row + 1, column + 1), out var right) && !IsMatchRight(downMatchTile.Lines, right.Lines));
                if (isDownNotFitLeftRightNeighbours)
                {
                    // check that we could safely flip the puzzle
                    var matchBorder = downMatchTile.Lines.First().AsEnumerable();
                    if (!matchBorder.SequenceEqual(matchBorder.Reverse()))
                    {
                        throw new Exception("Failed to solve the puzzle");
                    }
                    downMatchTile.Lines = FlipOverVertical(downMatchTile.Lines);
                }

                FitNeighbours(row+1, column, availableCameras, camerasDict);
            }

            var leftMatchTile = camerasDict.ContainsKey((row, column - 1))
                ? null
                : FindMatch(currentTile, IsMatchLeft, availableCameras);
            if (leftMatchTile != null)
            {
                availableCameras.Remove(leftMatchTile);
                camerasDict[(row, column - 1)] = leftMatchTile;
                bool isLeftNotFitUpDownNeighbours =
                    (camerasDict.TryGetValue((row - 1, column - 1), out var up) && !IsMatchUp(leftMatchTile.Lines, up.Lines))
                    || (camerasDict.TryGetValue((row + 1, column - 1), out var down) && !IsMatchDown(leftMatchTile.Lines, down.Lines));
                if (isLeftNotFitUpDownNeighbours)
                {
                    // check that we could safely flip the puzzle
                    var matchBorder = leftMatchTile.Lines.Select(x => x.Last());
                    if (!matchBorder.SequenceEqual(matchBorder.Reverse()))
                    {
                        throw new Exception("Failed to solve the puzzle");
                    }
                    leftMatchTile.Lines = FlipOverHorizontal(leftMatchTile.Lines);
                }

                FitNeighbours(row, column - 1, availableCameras, camerasDict);
            }

            var rightMatchTile = camerasDict.ContainsKey((row, column + 1))
                ? null
                : FindMatch(currentTile, IsMatchRight, availableCameras);
            if (rightMatchTile != null)
            {
                availableCameras.Remove(rightMatchTile);
                camerasDict[(row, column + 1)] = rightMatchTile;
                bool isRightNotFitUpDownNeighbours =
                    (camerasDict.TryGetValue((row - 1, column + 1), out var up) && !IsMatchUp(rightMatchTile.Lines, up.Lines))
                    || (camerasDict.TryGetValue((row + 1, column + 1), out var down) && !IsMatchDown(rightMatchTile.Lines, down.Lines));
                if (isRightNotFitUpDownNeighbours)
                {
                    // check that we could safely flip the puzzle
                    var matchBorder = rightMatchTile.Lines.Select(x => x.First());
                    if (!matchBorder.SequenceEqual(matchBorder.Reverse()))
                    {
                        throw new Exception("Failed to solve the puzzle");
                    }
                    rightMatchTile.Lines = FlipOverHorizontal(rightMatchTile.Lines);
                }

                FitNeighbours(row, column + 1, availableCameras, camerasDict);
            }
        }

        private CameraInfo? FindMatch(CameraInfo current, Func<List<string>, List<string>, bool> matcher, List<CameraInfo> availableCameras)
        {
            foreach (var camera in availableCameras)
            {
                camera.ResetPosition();
                bool failedToMatch = false;
                while (!failedToMatch)
                {
                    if (matcher(current.Lines, camera.Lines))
                    {
                        return camera;
                    }

                    if (camera.Rotation < 3)
                    {
                        RotateClockwise(camera);
                    }
                    else
                    {
                        failedToMatch = !TryFlip(camera);
                    }
                }
            }

            return null;
        }

        private bool IsMatchUp(List<string> current, List<string> up) => current.First() == up.Last();
        private bool IsMatchDown(List<string> current, List<string> down) => current.Last() == down.First();
        private bool IsMatchLeft(List<string> current, List<string> left) => current.Select(x => x.First()).SequenceEqual(left.Select(x => x.Last()));
        private bool IsMatchRight(List<string> current, List<string> right) => current.Select(x => x.Last()).SequenceEqual(right.Select(x => x.First()));

        private List<string> RotateClockwise(List<string> lines)
        {
            return Enumerable.Range(0, lines.Count)
                .Select(i => string.Join(string.Empty, lines.Select(line => line[i]).Reverse()))
                .ToList();
        }

        private void RotateClockwise(CameraInfo camera)
        {
            camera.Lines = RotateClockwise(camera.Lines);
            camera.Rotation++;
        }

        private List<string> FlipOverHorizontal(List<string> lines)
        {
            return lines.AsEnumerable().Reverse().ToList();     
        }

        private void FlipOverHorizontal(CameraInfo camera)
        {
            camera.Lines = FlipOverHorizontal(camera.Lines);
            camera.Rotation = 0;
            camera.HasHorizontalFlip = true;
        }

        private List<string> FlipOverVertical(List<string> lines)
        {
            return lines.Select(line => string.Join(string.Empty, line.Reverse())).ToList();
        }

        private void FlipOverVertical(CameraInfo camera)
        {
            camera.Lines = FlipOverVertical(camera.Lines);
            camera.Rotation = 0;
            camera.HasVerticalFlip = true;
        }

        private bool TryFlip(CameraInfo camera)
        {
            if (!camera.HasHorizontalFlip)
            {
                FlipOverHorizontal(camera);
            }
            else if (!camera.HasVerticalFlip)
            {
                FlipOverVertical(camera);
            }
            else
            {
                // camera already was in all variation
                return false;
            }

            return true;
        }

        private void Print(List<string> lines)
        {
            foreach (var line in lines)
            {
                Console.WriteLine(line);
            }
            Console.WriteLine();
        }

        private class CameraInfo
        {
            public long Id { get; set; }

            public List<string> Lines { get; set; }

            public CameraInfo(int id, List<string> lines)
            {
                Id = id;
                Lines = lines;
            }

            public int Rotation { get; set; }

            public bool HasHorizontalFlip { get; set; }

            public bool HasVerticalFlip { get; set; }

            public void ResetPosition()
            {
                Rotation = 0;
                HasHorizontalFlip = false;
                HasVerticalFlip = false;
            }

            public override string ToString()
            {
                return $"{Id}";
            }
        }
    }
}
