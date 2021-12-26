using System.Linq.Expressions;

namespace AdventOfCode2021.Day24
{
    public class DayResearchWithExpressions : SolverBase2
    {
        protected override string DayNo => "24";

        protected override (string, string) Solve(string[] input)
        {
            var dimensions = new string[] { "w", "x", "y", "z" };
            var parameters = dimensions.ToDictionary(k => k, v => Expression.Parameter(typeof(long), v));
            var transformation = parameters.ToDictionary(
                k => k.Key,
                v => v.Key == "w" ? (Expression)parameters[v.Key] : Expression.Constant(0L));
            var transformations = new List<Dictionary<ParameterExpression, Expression>>();
            var parsed = input.Select(x => x.Split(" ")).ToList();

            var minValues = dimensions.ToDictionary(k => k, v => (long?)null);
            minValues["w"] = 1;
            var maxValues = dimensions.ToDictionary(k => k, v => (long?)null);
            maxValues["w"] = 9;

            foreach (var item in parsed)
            {
                if (item[0] == "inp")
                {
                    for (int i = 0; i < transformation.Count; i++)
                    {
                        var d = dimensions[i];
                        Console.WriteLine($"{d}: {transformation[d]} ({minValues[d]}..{maxValues[d]})");
                    }
                    Console.WriteLine(string.Join(" ", item));
                    Console.WriteLine();

                    // save previous transformation
                    var previous = transformation.ToDictionary(k => parameters[k.Key], v => transformation[v.Key]);
                    transformations.Add(previous);

                    // set new parameters
                    parameters = dimensions.ToDictionary(k => k, v => Expression.Parameter(typeof(long), v));
                    transformation = dimensions.ToDictionary(
                        k => k,
                        v => transformation[v].NodeType == ExpressionType.Constant
                            ? transformation[v]
                            : parameters[v]);
                    continue;
                }

                Apply(item, transformation, minValues, maxValues);
            }

            for (int i = 0; i < transformation.Count; i++)
            {
                var d = dimensions[i];
                Console.WriteLine($"{d}: {transformation[d]} ({minValues[d]}..{maxValues[d]})");
            }
            Console.WriteLine();

            var last = parameters.ToDictionary(k => k.Value, v => transformation[v.Key]);
            transformations.Add(last);

            string result = "";
            var values = new Dictionary<string, long[]>() { { "", new[] { 0L, 0L, 0L, 0L } } };
            for (int i = 1; i < transformations.Count; i++)
            {
                values = Substitute(transformations[i], values);
            }

            return (result, "".ToString());
        }

        private Dictionary<string, long[]> Substitute(
            Dictionary<ParameterExpression, Expression> map,
            Dictionary<string, long[]> values)
        {
            var next = new Dictionary<string, long[]>();
            var parameters = map.Keys.ToList();
            foreach (var pair in values)
            {
                for (int w = 1; w <= 9; w++)
                {
                    pair.Value[0] = w;
                    var nextValues = pair.Value
                        .Select((v, i) => Calculate(map.ElementAt(i).Value, parameters, pair.Value.ToList()))
                        .ToArray();
                    next[$"{pair.Key}{w}"] = nextValues;
                }
            }

            return next;
        }

        private (int digit, List<long> nextValues)  Minimize(
            Dictionary<ParameterExpression, Expression> map,
            List<long> values)
        {
            var parameters = map.Keys.ToList();
            int min = 1;
            long minValue = long.MaxValue;
            for (int w = 1; w <= 9; w++)
            {
                values[0] = w;
                var value = Calculate(map.Last().Value, parameters, values);
                if (value < minValue)
                {
                    min = w;
                    minValue = value;
                }
            }

            values[0] = min;
            var nextValues = values.Select((v, i) => Calculate(map.ElementAt(i).Value, parameters, values))
                .ToList();

            return (min, nextValues);
        }

        private long Calculate(Expression expression, List<ParameterExpression> parameters, List<long> values)
        {
            return Expression.Lambda<Func<long, long, long, long, long>>(expression, parameters)
                .Compile()
                (values[0], values[1], values[2], values[3]);
        }

        private void Apply(
            string[] command,
            Dictionary<string, Expression> variables,
            Dictionary<string, long?> minValues,
            Dictionary<string, long?> maxValues)
        {
            var operation = command[0];
            if (operation == "inp")
            {
                return;
            }

            var isRightVariable = variables.ContainsKey(command[2]);
            var right = isRightVariable
                ? variables[command[2]]
                : Expression.Constant(long.Parse(command[2]), typeof(long));
            var rightValue = GetValue(right);

            var left = variables[command[1]];
            var leftValue = GetValue(left);

            if (leftValue != null && rightValue != null)
            {
                var value = Apply(command[0], leftValue.Value, rightValue.Value);
                variables[command[1]] = Expression.Constant(value);
                minValues[command[1]] = value;
                maxValues[command[1]] = value;
                return;
            }
            if (operation == "add")
            {
                if (leftValue == 0)
                {
                    variables[command[1]] = right;
                }
                else if (rightValue != 0)
                {
                    variables[command[1]] = Expression.Add(left, right);
                }
                minValues[command[1]] += isRightVariable ? minValues[command[2]] : long.Parse(command[2]);
                maxValues[command[1]] += isRightVariable ? maxValues[command[2]] : long.Parse(command[2]);

            }
            else if (operation == "mul")
            {
                if (leftValue == 1)
                {
                    variables[command[1]] = right;
                }
                else if (rightValue != 1)
                {
                    if (rightValue == 0)
                    {
                        variables[command[1]] = Expression.Constant(0L);
                        minValues[command[1]] = 0;
                        maxValues[command[1]] = 0;
                    }
                    else
                    {
                        variables[command[1]] = Expression.Multiply(left, right);
                    }
                }

                minValues[command[1]] *= isRightVariable ? minValues[command[2]] : long.Parse(command[2]);
                maxValues[command[1]] *= isRightVariable ? maxValues[command[2]] : long.Parse(command[2]);
                if (minValues[command[1]] > maxValues[command[1]])
                {
                    (minValues[command[1]], maxValues[command[1]]) = (maxValues[command[1]], minValues[command[1]]);
                }
            }
            else if (operation == "div")
            {
                if (rightValue != 1)
                {
                    if (leftValue == 0)
                    {
                        variables[command[1]] = Expression.Constant(0L);
                        minValues[command[1]] = 0;
                        maxValues[command[1]] = 0;
                    }
                    else
                    {
                        variables[command[1]] = Expression.Divide(left, right);
                    }

                    minValues[command[1]] /= isRightVariable ? minValues[command[2]] : long.Parse(command[2]);
                    maxValues[command[1]] /= isRightVariable ? maxValues[command[2]] : long.Parse(command[2]);
                    if (minValues[command[1]] > maxValues[command[1]])
                    {
                        (minValues[command[1]], maxValues[command[1]]) = (maxValues[command[1]], minValues[command[1]]);
                    }
                }
            }
            else if (operation == "mod")
            {
                if (leftValue == 0)
                {
                    variables[command[1]] = Expression.Constant(0L);
                    minValues[command[1]] = 0L;
                    maxValues[command[1]] = 0L;
                }
                else
                {
                    variables[command[1]] = Expression.Modulo(left, right);
                    minValues[command[1]] = 0L;
                    maxValues[command[1]] = (isRightVariable ? maxValues[command[2]] : long.Parse(command[2])) - 1;
                }
            }
            else if (operation == "eql")
            {
                var rightMin = isRightVariable ? minValues[command[2]] : long.Parse(command[2]);
                var rightMax = isRightVariable ? maxValues[command[2]] : long.Parse(command[2]);
                var leftMin = minValues[command[1]];
                var leftMax = maxValues[command[1]];
                var highestMostStart = rightMin > leftMin ? rightMin : leftMin;
                var lowestMostEnd = rightMax < leftMax ? rightMax : leftMax;
                if (highestMostStart > lowestMostEnd)
                {
                    variables[command[1]] = Expression.Constant(0L);
                    minValues[command[1]] = 0L;
                    maxValues[command[1]] = 0L;
                }
                else
                {
                    variables[command[1]] = Expression.Condition(Expression.Equal(left, right), Expression.Constant(1L), Expression.Constant(0L));
                    minValues[command[1]] = 0L;
                    maxValues[command[1]] = 1L;
                }
            }
        }

        private long Apply(string command, long leftValue, long rightValue)
        {
            return command switch
            {
                "add" => leftValue + rightValue,
                "mul" => leftValue * rightValue,
                "div" => leftValue / rightValue,
                "mod" => leftValue % rightValue,
                "eql" => leftValue == rightValue ? 1 : 0,
                _ => throw new NotImplementedException(),
            };
        }

        private bool TryGetValue(Expression exp, out long value)
        {
            value = long.MinValue;
            if (exp.NodeType != ExpressionType.Constant)
            {
                return false;
            }
            value = (long)((ConstantExpression)exp).Value;
            return true;
        }

        private long? GetValue(Expression exp)
        {
            if (exp.NodeType != ExpressionType.Constant)
            {
                return null;
            }
            var value = (long)((ConstantExpression)exp).Value;
            return value;
        }

        private bool IsZero(Expression exp)
        {
            return TryGetValue(exp, out var value) && value == 0;
        }
    }

}
