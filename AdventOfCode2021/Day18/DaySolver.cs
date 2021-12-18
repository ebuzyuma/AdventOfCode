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
                total = Sum(total, nodes[i]);
            }

            // Part 2
            var sums = new List<long>();
            for (int i = 0; i < input.Length; i++)
            {
                for (int j = i + 1; j < input.Length; j++)
                {
                    // Build tree every time to create a copy
                    var leftRightSum = Sum(BuildTree(input[i]), BuildTree(input[j]));
                    sums.Add(leftRightSum.Magnitude);

                    var rightLeftSum = Sum(BuildTree(input[j]), BuildTree(input[i]));
                    sums.Add(rightLeftSum.Magnitude);
                }
            }

            return (total.Magnitude.ToString(), sums.Max().ToString());
        }

        private Node Sum(Node left, Node right)
        {
            var sum = new AdditionNode(left, right);
            Reduce(sum);
            return sum;
        }

        private void Reduce(AdditionNode root)
        {
            while (TryExplode(root) || TrySplit(root));
        }

        private bool TrySplit(Node root)
        {
            var splitNode = GetSplitNode(root, 10);
            if (splitNode != null)
            {
                Split(splitNode);
                return true;
            }

            return false;
        }

        private void Split(ValueNode node)
        {
            var devidedBy2 = node.Value / 2.0;
            var left = new ValueNode((int)Math.Floor(devidedBy2));
            var right = new ValueNode((int)Math.Ceiling(devidedBy2));
            var newPair = new AdditionNode(left, right, node.Parent);

            var parent = (AdditionNode)node.Parent;
            if (parent.Left == node)
            {
                parent.Left = newPair;
            }
            else
            {
                parent.Right = newPair;
            }
        }

        private ValueNode? GetSplitNode(Node root, int minValue)
        {
            if (root is ValueNode value)
            {
                return value.Value >= minValue ? value : null;
            }

            else if (root is AdditionNode addition)
            {
                return GetSplitNode(addition.Left, minValue) ?? GetSplitNode(addition.Right, minValue);
            }

            throw new NotImplementedException();
        }

        private bool TryExplode(Node root)
        {
            var tooNestedPair = NestedPair(root, 4);
            if (tooNestedPair != null)
            {
                Explode(tooNestedPair);
                return true;
            }

            return false;
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
                parent.Left = new ValueNode(0, parent);
            }
            else
            {
                parent.Right = new ValueNode(0, parent);
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

        private AdditionNode? NestedPair(Node root, int maxNesting, int nestLevel = 0)
        {
            if (root is ValueNode)
            {
                return null;
            }
            else if (root is AdditionNode addition)
            {
                if (nestLevel == maxNesting)
                {
                    return addition;
                }

                return NestedPair(addition.Left, maxNesting, nestLevel + 1) 
                    ?? NestedPair(addition.Right, maxNesting, nestLevel + 1);
            }

            throw new NotImplementedException();
        }

        private Node BuildTree(string number)
        {
            if (Regex.IsMatch(number, @"^\d$"))
            {
                return new ValueNode(int.Parse(number));
            }

            (var leftStr, var rightStr) = Split(number);
            var left = BuildTree(leftStr);
            var right = BuildTree(rightStr);
            var node = new AdditionNode(left, right);
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
            public Node Parent { get; set; }

            public abstract long Magnitude { get; }
        }

        private class ValueNode : Node
        {
            public int Value { get; set; }

            public override long Magnitude => Value;

            public ValueNode(int value, Node? parent = null)
            {
                Value = value;
                Parent = parent;
            }

            public override string ToString()
            {
                return Value.ToString();
            }
        }

        private class AdditionNode : Node
        {
            public Node Left { get; set; }

            public Node Right { get; set; }

            public override long Magnitude => 3 * Left.Magnitude + 2 * Right.Magnitude;

            public AdditionNode(Node left, Node right, Node parent = null)
            {
                Parent = parent;
                Left = left;
                left.Parent = this;
                Right = right;
                right.Parent = this;
            }

            public override string ToString()
            {
                return $"[{Left},{Right}]";
            }
        }
    }

}
