namespace AdventOfCode2020.Day25
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "25";

        protected override (string part1, string part2) Solve(string[] input)
        {
            var cardPublicKey = long.Parse(input[0]);
            var doorPublicKey = long.Parse(input[1]);
            var handshakeSubject = 7L;
            var baseValue = 20201227L;
            var cardLoopSize = FindLoopSize(cardPublicKey, handshakeSubject, baseValue);
            var doorLoopSize = FindLoopSize(doorPublicKey, handshakeSubject, baseValue);

            var cardEncriptionKey = Transform(doorPublicKey, baseValue, cardLoopSize);
            var doorEncriptionKey = Transform(cardPublicKey, baseValue, doorLoopSize);

            return (cardEncriptionKey.ToString(), doorEncriptionKey.ToString());
        }

        private long FindLoopSize(long publicKey, long subject, long baseValue)
        {
            long result = 1;
            long loopSize = 0;
            while (result != publicKey)
            {
                loopSize++;
                result *= subject;
                result %= baseValue;
            }

            return loopSize;
        }

        private long Transform(long subject, long baseValue, long loopSize)
        {
            long result = 1;
            for (int i = 0; i < loopSize; i++)
            {
                result *= subject;
                result %= baseValue;
            }

            return result;
        }
    }
}
