using System.Text.RegularExpressions;

namespace AdventOfCode2021.Day18
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "18";

        protected override (string, string) Solve(string[] input)
        {
            // Part 1
            var nodes = input.Select(x => BuildTree(x)).ToList();
            var total = nodes[0];
            for (int i = 1; i < nodes.Count; i++)
            {
                var sum = new AdditionNode();
                sum.Left = total;
                total.Parent = sum;

                sum.Right = nodes[i];
                nodes[i].Parent = sum;
                Reduce(sum);
                total = sum;
            }
            var magnitude = Magnitude(total);

            // Part 2
            var sums = new List<long>();
            for (int i = 0; i < nodes.Count; i++)
            {
                for (int j = i + 1; j < nodes.Count; j++)
                {
                    var sum = new AdditionNode();
                    sum.Left = BuildTree(input[i]);
                    sum.Left.Parent = sum;

                    sum.Right = BuildTree(input[j]);
                    sum.Right.Parent = sum;
                    Reduce(sum);
                    sums.Add(Magnitude(sum));

                    nodes = input.Select(x => BuildTree(x)).ToList();

                    sum = new AdditionNode();
                    sum.Left = BuildTree(input[j]);
                    sum.Left.Parent = sum;

                    sum.Right = BuildTree(input[i]);
                    sum.Right.Parent = sum;
                    Reduce(sum);
                    sums.Add(Magnitude(sum));
                }
            }

            return (magnitude.ToString(), sums.Max().ToString());
        }

        private long Magnitude(Node root)
        {
            if (root is ValueNode value)
            {
                return value.Value;
            }
            else if (root is AdditionNode addition)
            {
                return 3 * Magnitude(addition.Left) + 2 * Magnitude(addition.Right);
            }

            throw new NotImplementedException();
        }

        private void Reduce(AdditionNode root)
        {
            bool hasReduce = true;
            while (hasReduce)
            {
                hasReduce = false;
                var tooNestedPair = TooNestedPair(root);
                if (tooNestedPair != null)
                {
                    Explode(tooNestedPair);
                    hasReduce = true;
                }
                else
                {
                    var bigNumber = GetBigNode(root);
                    if (bigNumber != null)
                    {
                        Split(bigNumber);
                        hasReduce = true;
                    }
                }
            }
        }

        private void Split(ValueNode bigNumber)
        {
            var parent = bigNumber.Parent as AdditionNode;
            var newPair = new AdditionNode { Parent = bigNumber.Parent };
            var by2 = bigNumber.Value / 2.0;
            newPair.Left = new ValueNode { Value = (int)Math.Floor(by2), Parent = newPair };
            newPair.Right = new ValueNode { Value = (int)Math.Ceiling(by2), Parent = newPair };

            if (parent.Left == bigNumber)
            {
                parent.Left = newPair;
            }
            else
            {
                parent.Right = newPair;
            }
        }

        private ValueNode? GetBigNode(Node root)
        {
            if (root is ValueNode value)
            {
                return value.Value >= 10 ? value : null;
            }

            else if (root is AdditionNode addition)
            {
                return GetBigNode(addition.Left) ?? GetBigNode(addition.Right);
            }

            throw new NotImplementedException();
        }

        private void Explode(AdditionNode explode)
        {
            var leftNeighbour = GetLeftNeighbour(explode);
            if (leftNeighbour != null)
            {
                leftNeighbour.Value += ((ValueNode)explode.Left).Value;
            }

            var rightNeighbour = GetRightNeighbour(explode);
            if (rightNeighbour != null)
            {
                rightNeighbour.Value += ((ValueNode)explode.Right).Value;
            }

            var parent = explode.Parent as AdditionNode;
            if (parent.Left == explode)
            {
                parent.Left = new ValueNode { Value = 0, Parent = parent };
            }
            else
            {
                parent.Right = new ValueNode { Value = 0, Parent = parent };
            }
        }

        private ValueNode GetRightNeighbour(AdditionNode node)
        {
            var parent = node.Parent as AdditionNode;
            if (parent == null)
            {
                return null;
            }
            else if (parent.Right == node)
            {
                return GetRightNeighbour(parent);
            }
            else
            {
                var right = parent.Right;
                while (right is AdditionNode additionNode)
                {
                    right = additionNode.Left;
                }

                return (ValueNode)right;
            }
        }

        private ValueNode? GetLeftNeighbour(AdditionNode node)
        {
            var parent = node.Parent as AdditionNode;
            if (parent == null)
            {
                return null;
            }
            else if (parent.Left == node)
            {
                return GetLeftNeighbour(parent);
            }
            else
            {
                var left = parent.Left;
                while (left is AdditionNode additionNode)
                {
                    left = additionNode.Right;
                }

                return (ValueNode)left;
            }
        }

        private AdditionNode? TooNestedPair(Node root, int nestLevel = 0)
        {
            if (root is ValueNode)
            {
                return null;
            }
            else if (root is AdditionNode addition)
            {
                if (nestLevel == 4)
                {
                    return addition;
                }

                return TooNestedPair(addition.Left, nestLevel + 1) ?? TooNestedPair(addition.Right, nestLevel + 1);
            }

            throw new NotImplementedException();
        }

        private Node BuildTree(string number, Node? parent = null)
        {
            if (Regex.IsMatch(number, @"^\d$"))
            {
                return new ValueNode { Value = int.Parse(number), Parent = parent };
            }

            var node = new AdditionNode { Parent = parent };
            (var left, var right) = Split(number);
            node.Left = BuildTree(left, node);
            node.Right = BuildTree(right, node);
            return node;
        }

        private (string left, string right) Split(string number)
        {
            var comaPosition = 0;
            int brackets = 0;
            number = number.Trim().Substring(1, number.Length - 2);
            while (number[comaPosition] != ',' || brackets > 0)
            {
                if (number[comaPosition] == '[') brackets++;
                else if (number[comaPosition] == ']') brackets--;
                comaPosition++;
            }
            var split = (
                number.Substring(0, comaPosition),
                number.Substring(comaPosition + 1));
            return split;
        }

        private abstract class Node
        {
            public Node? Parent { get; set; }
        }

        private class ValueNode : Node
        {
            public int Value { get; set; }

            public override string ToString()
            {
                return Value.ToString();
            }
        }

        private class AdditionNode : Node
        {
            public Node Left { get; set; }

            public Node Right { get; set; }

            public override string ToString()
            {
                return $"[{Left},{Right}]";
            }
        }
    }

}
