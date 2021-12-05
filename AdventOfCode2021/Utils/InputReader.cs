namespace AdventOfCode2021.Utils
{
    public static class InputReader
    {
        public static async Task<int[]> ReadIntArrayAsync(string file)
        {
            var data = await File.ReadAllLinesAsync(file);
            return data.Select(s => int.Parse(s)).ToArray();
        }

        public static async Task<string[]> ReadStringArrayAsync(string file)
        {
            return await File.ReadAllLinesAsync(file);
        }
    }
}
