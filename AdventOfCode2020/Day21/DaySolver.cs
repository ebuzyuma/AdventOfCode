namespace AdventOfCode2020.Day21
{
    public class DaySolver : SolverBase2
    {
        protected override string DayNo => "21";

        protected override (string part1, string part2) Solve(string[] input)
        {
            var recipes = input.Select(x => x.Split(" (contains "))
                .Select(x => (ingredients: x[0].Split(" ").ToList(), allergies: x[1].TrimEnd(')').Split(", ").ToList()))
                .ToList();

            var noAllergie = new HashSet<string>();


            var allergieToIngredients = new Dictionary<string, List<string>>();

            var recipesToInspect = recipes.ToList();
            while (recipesToInspect.Count > 0)
            {
                recipesToInspect = AddWithSingleAllergie(recipesToInspect, allergieToIngredients).ToList();
                recipesToInspect = ExcludeKnownAllergie(recipesToInspect, allergieToIngredients).ToList();
            }

            // Determine which allergie correspond to which ingredient
            List<KeyValuePair<string, List<string>>> allergiesToInspect = allergieToIngredients.ToList();
            var allergieToIngredient = new Dictionary<string, string>();
            do
            {
                var newList = new List<KeyValuePair<string, List<string>>>();
                foreach (var allergie in allergiesToInspect)
                {
                    var ingredients = allergie.Value.Except(allergieToIngredient.Values).ToList();
                    if (ingredients.Count == 1)
                    {
                        allergieToIngredient.Add(allergie.Key, ingredients[0]);
                    }
                    else
                    {
                        newList.Add(KeyValuePair.Create(allergie.Key, ingredients));
                    }
                }
                allergiesToInspect = newList;
            } while (allergiesToInspect.Count > 0);

            // Part 1
            var count1 = recipes.Sum(r => r.ingredients.Count(i => !allergieToIngredient.Values.Contains(i)));

            // Part 2
            string dangerous = string.Join(",", allergieToIngredient.OrderBy(x => x.Key).Select(x => x.Value));
            
            return (count1.ToString(), dangerous.ToString());
        }

        private IEnumerable<(List<string> ingredients, List<string> allergies)> AddWithSingleAllergie(
            List<(List<string> ingredients, List<string> allergies)> recipes,
            Dictionary<string, List<string>> allergieToIngredients)
        {
            foreach (var recipie in recipes)
            {
                if (recipie.allergies.Count == 1)
                {
                    var allergie = recipie.allergies[0];
                    if (allergieToIngredients.TryGetValue(allergie, out var ingredients))
                    {
                        allergieToIngredients[allergie] = ingredients.Intersect(recipie.ingredients).ToList();
                    }
                    else
                    {
                        allergieToIngredients[allergie] = recipie.ingredients.ToList();
                    }
                }
                else
                {
                    yield return recipie;
                }
            }
        }

        private IEnumerable<(List<string> ingredients, List<string> allergies)> ExcludeKnownAllergie(
            List<(List<string> ingredients, List<string> allergies)> recipes,
            Dictionary<string, List<string>> allergieToIngredients)
        {
            // idea:
            // e.g. from [dairy, fish] allergies substract fish
            // from incredients of [dairy, fish] substract ingredients of fish which does not exist in dairy
            foreach (var recipe in recipes)
            {
                if (recipe.allergies.Any(a => !allergieToIngredients.ContainsKey(a)))
                {
                    // at least one allergies does not have a list of possible ingrediends - exclude is not possible
                    yield return recipe;
                }

                foreach (var allergie in recipe.allergies)
                {
                    var reducedAllergies = recipe.allergies.Where(a => a != allergie).ToList();
                    
                    allergieToIngredients[allergie] = allergieToIngredients[allergie].Intersect(recipe.ingredients).ToList();

                    var ingredientsToRemove = allergieToIngredients[allergie]
                        .Except(reducedAllergies.SelectMany(a => allergieToIngredients[a]))
                        .ToList();
                    var reducedIngredients = recipe.ingredients.Except(ingredientsToRemove).ToList();
                    
                    yield return (reducedIngredients, reducedAllergies);
                }
            }
        }
    }
}
