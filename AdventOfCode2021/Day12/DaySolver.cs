using System.Text.RegularExpressions;

namespace AdventOfCode2021.Day12
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "12";

        protected override (string, string) Solve(string[] input)
        {
            var adjacent = input.Select(x => x.Trim().Split("-").ToList()).ToList();
            var nodes = adjacent.SelectMany(x => x).Distinct().ToList();
            var smallNodes = nodes.Where(x => x.ToLower() == x).ToHashSet();

            var adjacentDict = nodes.ToDictionary(k => k, v => new HashSet<string>());
            foreach (var line in adjacent)
            {
                adjacentDict[line[0]].Add(line[1]);
                adjacentDict[line[1]].Add(line[0]);
            }

            var pathes1 = BuildPathes1(String.Empty, "start", adjacentDict, smallNodes, new HashSet<string>());
            var pathes2 = BuildPathes2(String.Empty, "start", adjacentDict, smallNodes, null);
            return (pathes1.Count.ToString(), pathes2.Count().ToString());
        }

        private List<string> BuildPathes1(
            string currentPath,
            string node,
            Dictionary<string, HashSet<string>> adjacent,
            HashSet<string> smallNodes,
            HashSet<string> visitedNodes)
        {
            currentPath += $"{node},";
            if (smallNodes.Contains(node))
            {
                visitedNodes.Add(node);
            }

            if (node == "end")
            {
                return new List<string> { currentPath };
            }

            var pathes = new List<string>();
            var children = adjacent[node];
            var nodesToVisit = children.Where(x => !visitedNodes.Contains(x)).ToList();
            foreach (var child in nodesToVisit)
            {
                var childPathes = BuildPathes1(currentPath, child, adjacent, smallNodes, new HashSet<string>(visitedNodes));
                pathes.AddRange(childPathes);
            }

            return pathes;
        }

        private List<string> BuildPathes2(
            string currentPath,
            string node,
            Dictionary<string, HashSet<string>> adjacent,
            HashSet<string> smallNodes,
            string? twiceVisitedCave)
        {
            var newPath = currentPath + $"{node},";
            if (node == "end")
            {
                return new List<string> { newPath };
            }

            var pathes = new List<string>();
            var children = adjacent[node];
            var nodesToVisit = children
                .Where(x => x != "start" 
                    && (!smallNodes.Contains(x) 
                    || !currentPath.Contains(x) || twiceVisitedCave == null))
                .ToList();
            foreach (var child in nodesToVisit)
            {
                string newTwiceVisitedCave = twiceVisitedCave;
                if (twiceVisitedCave == null && smallNodes.Contains(child) && currentPath.Contains(child))
                {
                    newTwiceVisitedCave = child;
                }
                var childPathes = BuildPathes2(newPath, child, adjacent, smallNodes, newTwiceVisitedCave);
                pathes.AddRange(childPathes);
            }

            return pathes;
        }
    }

}
