import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AIRecipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  servings: number;
  cuisine: string;
  tags: string[];
}

export function AIRecipes() {
  const [ingredients, setIngredients] = useState("");
  const [suggestions, setSuggestions] = useState<AIRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const generateSuggestions = useAction(api.ai.generateRecipeSuggestions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsLoading(true);
    try {
      const recipes = await generateSuggestions({ ingredients: ingredients.trim() });
      setSuggestions(recipes);
      toast.success("Recipe suggestions generated!");
    } catch (error) {
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          AI Recipe Suggestions
        </h1>
        <p className="text-lg text-text">
          Tell us what ingredients you have, and we'll suggest amazing recipes!
        </p>
      </div>

      <div className="bg-white rounded-container shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              What ingredients do you have?
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="e.g., chicken breast, rice, broccoli, soy sauce, garlic..."
              required
            />
            <p className="text-sm text-text/70 mt-1">
              List your available ingredients separated by commas
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !ingredients.trim()}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Get Recipe Suggestions"}
            </button>
          </div>
        </form>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">
            Here are your personalized recipe suggestions:
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((recipe, index) => (
              <AIRecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AIRecipeCard({ recipe }: { recipe: AIRecipe }) {
  return (
    <div className="bg-white rounded-container shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{recipe.title}</h3>
        <p className="text-text/70 text-sm mb-4">{recipe.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-text/70 mb-4">
          <span>{recipe.prepTime} min</span>
          <span>•</span>
          <span>{recipe.servings} servings</span>
          <span>•</span>
          <span className="px-2 py-1 bg-accent rounded-full text-xs">
            {recipe.cuisine}
          </span>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-text mb-2">Ingredients:</h4>
          <ul className="text-sm text-text/70 space-y-1">
            {recipe.ingredients.slice(0, 5).map((ingredient, i) => (
              <li key={i}>• {ingredient}</li>
            ))}
            {recipe.ingredients.length > 5 && (
              <li className="text-primary">+ {recipe.ingredients.length - 5} more...</li>
            )}
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-text mb-2">Steps:</h4>
          <ol className="text-sm text-text/70 space-y-1">
            {recipe.steps.slice(0, 3).map((step, i) => (
              <li key={i}>{i + 1}. {step.substring(0, 60)}...</li>
            ))}
            {recipe.steps.length > 3 && (
              <li className="text-primary">+ {recipe.steps.length - 3} more steps...</li>
            )}
          </ol>
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-secondary text-text text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
