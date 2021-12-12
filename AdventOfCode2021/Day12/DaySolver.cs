using System.Text.RegularExpressions;

namespace AdventOfCode2021.Day12
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "12";

        protected override (string, string) Solve(string[] input)
        {
            var adjasent = input.Select(x => x.Trim().Split("-").ToList()).ToList();

            var pathes1 = BuildPathes1(String.Empty, "start", adjasent, new HashSet<string>());
            var pathes2 = BuildPathes2(String.Empty, "start", adjasent, new HashSet<string>(), false);
            return (pathes1.Count.ToString(), pathes2.Distinct().Count().ToString());
        }

        private List<string> BuildPathes1(string currentPath, string node, List<List<string>> adjasent, HashSet<string> visited)
        {
            currentPath += $"{node},";
            if (Regex.IsMatch(node, "[a-z]+"))
            {
                visited.Add(node);
            }

            if (node == "end")
            {
                return new List<string> { currentPath };
            }

            var pathes = new List<string>();
            var children = adjasent.Where(x => x.Contains(node))
                .Select(x => x.Single(y => y != node))
                .ToList();
            var nodesToVisit = children.Where(x => !visited.Contains(x)).ToList();
            foreach (var child in nodesToVisit)
            {
                var childPathes = BuildPathes1(currentPath, child, adjasent, new HashSet<string>(visited));
                pathes.AddRange(childPathes);
            }

            return pathes;
        }



        private List<string> BuildPathes2(string currentPath, string node, List<List<string>> adjasent, HashSet<string> visited, bool hasTwiceNode)
        {
            currentPath += $"{node},";
            bool isSmall = Regex.IsMatch(node, "[a-z]+");
            if (isSmall)
            {
                visited.Add(node);
            }

            if (node == "end")
            {
                return new List<string> { currentPath };
            }

            var pathes = new List<string>();
            var children = adjasent.Where(x => x.Contains(node))
                .Select(x => x.Single(y => y != node))
                .ToList();
            var nodesToVisit = children.Where(x => !visited.Contains(x)).ToList();
            var visited2 = new HashSet<string>(visited);
            visited2.Remove(node);
            foreach (var child in nodesToVisit)
            {

                var childPathes = BuildPathes2(currentPath, child, adjasent, new HashSet<string>(visited), hasTwiceNode);
                pathes.AddRange(childPathes);
                if (!hasTwiceNode && isSmall && node != "start" && node != "end")
                {
                    childPathes = BuildPathes2(currentPath, child, adjasent, new HashSet<string>(visited2), true);
                    pathes.AddRange(childPathes);
                }
            }

            return pathes;
        }
    }

}
