using System.Diagnostics;

namespace AdventOfCode2020.Day23
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "23";

        protected override (string part1, string part2) Solve(string[] input)
        {
            // Part 1
            var circle = input[0];
            for (int i = 0; i < 100; i++)
            {
                circle = Move(circle);
            }

            var onePos = circle.IndexOf('1');
            var part1 = $"{circle}{circle}".Substring(onePos + 1, circle.Length - 1);


            // Part 2
            var numbers = input[0].Select(x => int.Parse(x.ToString())).ToList();
            var max = numbers.Max();
            var expectedMax = 1_000_000;
            numbers.AddRange(Enumerable.Range(max + 1, expectedMax - max));
            var nodes = numbers.Select(x => new Node { Value = x }).ToList();
            var dict = nodes.ToDictionary(k => k.Value);
            for (int i = 0; i < nodes.Count; i++)
            {
                var next = i + 1 == nodes.Count ? nodes[0] : nodes[i + 1];
                nodes[i].Next = next;
                var lower = nodes[i].Value - 1;
                if (lower == 0) lower = nodes.Count;
                nodes[i].NodeWithLowerValue = dict[lower];
            }

            var moves = 10_000_000;
            var current = nodes[0];
            var time = new List<long>();
            for (int i = 0; i < moves; i++)
            {
                current = Move(current, dict);
            }

            while (current.Value != 1) current = current.Next;

            var part2 = current.Next.Value * current.Next.Next.Value;

            return (part1.ToString(), part2.ToString());
        }

        private Node Move(Node current, Dictionary<long, Node> dict)
        {
            var destination = FindDestination(current, dict);

            var pickFirst = current.Next;
            var pickLast = pickFirst.Next.Next;
            current.Next = pickLast.Next;

            pickLast.Next = destination.Next;
            destination.Next = pickFirst;

            return current.Next;
        }

        private Node FindDestination(Node current, Dictionary<long, Node> dict)
        {
            var result = current.NodeWithLowerValue;
            while (result == current || result == current.Next
                || result == current.Next.Next || result == current.Next.Next.Next)
            {
                result = result.NodeWithLowerValue;
            }

            return result;
        }

        private Node FindDestination(Node fromNode, Node toNode, long destinationValue)
        {
            var maxByValueNode = fromNode;
            Node closestByValueNode = null;
            var current = fromNode;
            while (current != toNode)
            {
                if(current.Value == destinationValue)
                {
                    return current;
                }

                if (current.Value > maxByValueNode.Value)
                {
                    maxByValueNode = current;
                }

                var diff = destinationValue - current.Value;
                if (diff > 0 
                    && (closestByValueNode == null || diff < destinationValue - closestByValueNode.Value))
                {
                    closestByValueNode = current;
                }

                current = current.Next;
            }

            if (closestByValueNode != null)
            {
                return closestByValueNode;
            }

            return maxByValueNode;
        }

        private string Move(string cups)
        {
            // double cups for easier circle management
            var cupsDouble = $"{cups}{cups}";
            var current = cups[0];
            
            var pick = cupsDouble.Substring(1, 3);
            
            char destination = (char)(current - 1); 
            var forInspect = cupsDouble.Substring(4, cups.Length - 4);
            var destinationPos = FindDestination(destination, forInspect);
            
            var withPickUp = forInspect.Insert(destinationPos + 1, pick);
            var destinationCircle = withPickUp.PadRight(withPickUp.Length + 1, current);
            
            return destinationCircle;
        }

        private int FindDestination(char current, string cups)
        {
            while (!cups.Contains(current))
            {
                current = current == '0' ? '9' : (char)(current - 1);
            }

            return cups.IndexOf(current);
        }

        private long SolvePart2(string input)
        {
            // Still slow
            var numbers = input.Select(x => int.Parse(x.ToString())).ToList();
            var max = numbers.Max();
            var expectedMax = 1000000;
            numbers.AddRange(Enumerable.Range(max + 1, expectedMax - max));
            var circle = string.Join("_", numbers);
            circle = $"_{circle}_";
            var moves = 10000000;
            for (int i = 0; i < moves; i++)
            {
                circle = MoveWithMultiDigitsNumber(circle);
            }

            var onePos = circle.IndexOf("_1_");
            var split = circle.Substring(onePos + 3).Split("_", 3);
            var part2 = long.Parse(split[0]) * long.Parse(split[1]);

            return part2;
        }

        private string MoveWithMultiDigitsNumber(string cups)
        {
            var split = cups.Split('_', 5, StringSplitOptions.RemoveEmptyEntries);
            long current = long.Parse(split[0]);
            
            var pick = split.Skip(1).Take(3);
            var pickStr = string.Join("_", pick);
            
            var forInspect = $"_{split[4]}";
            long destination = current - 1;
            var destinationPos = FindNextAfterDestination(destination, forInspect);
            
            var withPickUp = forInspect.Insert(destinationPos, $"{pickStr}_");
            var destinationCircle = $"{withPickUp}{current}_";
            
            return destinationCircle;
        }

        private int FindNextAfterDestination(long destination, string cups)
        {
            string current = $"_{destination--}_";
            while (!cups.Contains(current))
            {
                if (destination < 0)
                {
                    var max = cups.Split("_", StringSplitOptions.RemoveEmptyEntries).Select(long.Parse).Max();
                    current = $"_{max}_";
                    break;
                }

                current = $"_{destination--}_";
            }

            var pos = cups.IndexOf(current);
            return pos + current.Length;
        }

        public class Node
        {
            public long Value { get; set; }

            public Node Next { get; set; }

            public Node NodeWithLowerValue { get; set; }

            public override string ToString()
            {
                return Value.ToString();
            }
        }
    }
}
