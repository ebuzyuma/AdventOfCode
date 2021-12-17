namespace AdventOfCode2021.Day17
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "17";

        protected override (string, string) Solve(string[] input)
        {
            var split = input[0].Split(": ")[1].Split(", ");
            var xRange = split[0].Split("=")[1].Split("..").Select(int.Parse).ToList();
            var yRange = split[1].Split("=")[1].Split("..").Select(int.Parse).ToList();

            var posX = FindX(xRange);
            var posY = FindY(yRange);

            var velocities = new HashSet<(int x, int y)>();
            foreach (var xVel in posX)
            {
                foreach (var yVel in posY)
                {
                    var velocity = (xVel, yVel);
                    if (ReachTheArea(xRange, yRange, velocity))
                    {
                        velocities.Add(velocity);
                    }
                }
            }


            var heightgs = velocities.Select(p => p.y * (p.y + 1) / 2).ToList();
            var max = heightgs.Max();

            return (max.ToString(), velocities.Count.ToString());
        }

        private List<int> FindX(List<int> xRange)
        {
            var result = new List<int>();
            for (int x0 = 1; x0 <= xRange[1]; x0++)
            {
                var xVelocity = x0;
                var x = 0;
                while(xVelocity >= 0)
                {
                    x += xVelocity;
                    xVelocity--;

                    if (x >= xRange[0] && x <= xRange[1])
                    {
                        result.Add(x0);
                        break;
                    }

                }
            }
            return result;
        }

        private List<int> FindY(List<int> yRange)
        {
            var result = new List<int>();
            var exit = false;
            for (int y0 = yRange[0]; y0 < Math.Abs(yRange[0]) * 2; y0++)
            {
                var yVelocity = y0;
                var y = 0;
                while (y > yRange[1])
                {
                    y += yVelocity; 
                    yVelocity--;

                    if (y >= yRange[0] && y <= yRange[1])
                    {
                        result.Add(y0);
                    }
                }
            }
            return result;
        }

        public bool ReachTheArea(List<int> xRange, List<int> yRange, (int x, int y) velocity)
        {
            var pos = velocity;
            while(!ShouldStop(xRange, yRange, pos))
            {
                if (IsInArea(xRange, yRange, pos))
                {
                    return true;
                }

                velocity = ChangeVelocity(velocity);
                pos = (pos.x + velocity.x, pos.y + velocity.y);
            }

            return false;
        }

        public bool IsInArea(List<int> xRange, List<int> yRange, (int x, int y) pos)
        {
            return pos.x >= xRange[0] && pos.x <= xRange[1]
                && pos.y >= yRange[0] && pos.y <= yRange[1];
        }

        public (int x, int y) ChangeVelocity((int x, int y) velocity)
        {
            var x = velocity.x > 0 ? velocity.x - 1 : (velocity.x < 0 ? velocity.x + 1 : 0);
            return (x, velocity.y - 1);
        }

        private bool ShouldStop(List<int> xRange, List<int> yRange, (int x, int y) pos)
        {
            return pos.y < yRange[0] || pos.x > xRange[1];
        }
    }

}
