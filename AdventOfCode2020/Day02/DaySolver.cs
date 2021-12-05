namespace AdventOfCode2020.Day02
{
    public class DaySolver : SolverBase
    {
        protected override string DayNo => "02";

        protected override string Solve(string[] input)
        {
            int valid = 0;

            foreach (string record in input)
            {
                var split = record.Split(": ");
                string password = split[1];
                var policy = split[0].Split(' ');
                char requiredLetter = policy[1][0];
                var numbers = policy[0].Split('-');
                int min = int.Parse(numbers[0]);
                int max = int.Parse(numbers[1]);

                // part 1
                //var count = password.Count(c => c == requiredLetter[0]);
                //if (count >= min && count <= max)
                //{
                //    valid++;
                //}

                if ((password.Length >= min && password[min - 1] == requiredLetter)
                    ^ (password.Length >= max && password[max - 1] == requiredLetter))
                {
                    valid++;
                }
            }


            return valid.ToString();
        }
    }
}
