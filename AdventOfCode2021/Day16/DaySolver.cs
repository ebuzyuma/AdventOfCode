namespace AdventOfCode2021.Day16
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "16";

        protected override (string, string) Solve(string[] input)
        {
            var map = new Dictionary<char, string>
            {
                ['0'] = "0000",
                ['1'] = "0001",
                ['2'] = "0010",
                ['3'] = "0011",
                ['4'] = "0100",
                ['5'] = "0101",
                ['6'] = "0110",
                ['7'] = "0111",
                ['8'] = "1000",
                ['9'] = "1001",
                ['A'] = "1010",
                ['B'] = "1011",
                ['C'] = "1100",
                ['D'] = "1101",
                ['E'] = "1110",
                ['F'] = "1111",
            };

            var bits = string.Join("", input[0].Select(x => map[x]));

            int i = 0;
            var packet = ParsePacket(bits, ref i);

            // Part 1
            var versionsSum = SumVersions(packet);

            // Part 2
            var sum = Calculate(packet);

            return (versionsSum.ToString(), sum.ToString());
        }

        private Packet ParsePacket(string bits, ref int i)
        {
            var packet = new Packet();
            packet.Version = GetNumber(bits.Substring(i, 3));
            i += 3;

            packet.Type = GetNumber(bits.Substring(i, 3));
            i += 3;

            if (packet.Type == 4)
            {
                string binaryStr = "";
                bool isLastGroup;
                do
                {
                    isLastGroup = bits[i] == '0';
                    binaryStr += bits.Substring(i + 1, 4);
                    i += 5;
                } while (!isLastGroup);

                packet.Number = GetNumber(binaryStr);
            }
            else
            {
                var lengthType = bits[i];
                i++;

                if (lengthType == '0')
                {
                    var totalLength = GetNumber(bits.Substring(i, 15));
                    i += 15;
                    var subPacketEnd = i + totalLength;
                    while (i < subPacketEnd)
                    {
                        var subPacket = ParsePacket(bits, ref i);
                        packet.SubPackets.Add(subPacket);
                    }
                }
                else
                {
                    var subPackets = GetNumber(bits.Substring(i, 11));
                    i += 11;
                    for (int j = 0; j < subPackets; j++)
                    {
                        var subPacket = ParsePacket(bits, ref i);
                        packet.SubPackets.Add(subPacket);
                    }
                }
            }

            return packet;
        }

        private double SumVersions(Packet packet)
        {
            var subPackets = packet.SubPackets.Sum(x => SumVersions(x));
            return subPackets + packet.Version;
        }

        private long Calculate(Packet packet)
        {
            if (packet.Type == 4)
            {
                return packet.Number;
            }

            var subPackets = packet.SubPackets.Select(x => Calculate(x)).ToList();
            var result = packet.Type switch
            {
                0 => subPackets.Sum(),
                1 => subPackets.Aggregate(1l, (s, x) => s * x),
                2 => subPackets.Min(),
                3 => subPackets.Max(),
                4 => packet.Number,
                5 => subPackets[0] > subPackets[1] ? 1 : 0,
                6 => subPackets[0] < subPackets[1] ? 1 : 0,
                7 => subPackets[0] == subPackets[1] ? 1 : 0,
                _ => throw new InvalidOperationException(),
            };
            return result;
        }

        private long GetNumber(string bits)
        {
            long result = 0;
            long multiplier = 1;
            for (int i = bits.Length - 1; i >= 0; i--)
            {
                result += multiplier * (bits[i] == '1' ? 1 : 0);
                multiplier *= 2;
            }

            return result;
        }

        public class Packet
        {
            public long Version { get; set; }

            public long Type { get; set; }

            public long Number { get; set; }

            public List<Packet> SubPackets { get; set; } = new List<Packet>();
        }
    }

}
