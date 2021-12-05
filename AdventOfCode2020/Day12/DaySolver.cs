namespace AdventOfCode2020.Day12
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "12";

        protected override string Solve(string[] input)
        {
            var method = input.Select(x => (dir: x[0], amount: int.Parse(x.Substring(1)))).ToList();
            var circle = new[] { 'E', 'S', 'W', 'N' };
            int iDir = 3;
            int x = 0, y = 0;
            int xp = 10, yp = 1;
            foreach (var item in method)
            {
                if (item.dir == 'F')
                {
                    x += xp * item.amount;
                    y += yp * item.amount;
                }
                else if (item.dir == 'L')
                {
                    for (int i = 0; i < item.amount / 90; i++)
                    {
                        iDir = (iDir - 1 + 4) % 4;
                        var tmp = xp;
                        xp = -yp;
                        yp = tmp;
                    }
                }
                else if (item.dir == 'R')
                {
                    for (int i = 0; i < item.amount / 90; i++)
                    {
                        iDir = (iDir + 1) % 4;
                        var tmp = xp;
                        xp = yp;
                        yp = -tmp;
                    }
                }
                else if (item.dir == 'E') xp += item.amount;
                else if (item.dir == 'W') xp -= item.amount;
                else if (item.dir == 'N') yp += item.amount;
                else if (item.dir == 'S') yp -= item.amount;
            }

            return (Math.Abs(x)+Math.Abs(y)).ToString();
        }
    }
}
