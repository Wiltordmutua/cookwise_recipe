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

interface IngredientSubstitution {
  name: string;
  ratio: string;
  explanation: string;
  notes: string;
}

interface CookingTip {
  title: string;
  explanation: string;
  importance: string;
}

interface MealPlanDay {
  name: string;
  description: string;
  prepTime: number;
  keyIngredients: string[];
}

type TabType = 'recipes' | 'substitutions' | 'tips' | 'mealplan';

export function AIRecipes() {
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  
  // Recipe generation state
  const [ingredients, setIngredients] = useState("");
  const [suggestions, setSuggestions] = useState<AIRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ingredient substitution state
  const [substitutionIngredient, setSubstitutionIngredient] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [substitutions, setSubstitutions] = useState<IngredientSubstitution[]>([]);
  
  // Cooking tips state
  const [recipeType, setRecipeType] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [tips, setTips] = useState<CookingTip[]>([]);
  
  // Meal planning state
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState("");
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>([]);
  
  const generateSuggestions = useAction(api.ai.generateRecipeSuggestions);
  const generateSubstitutions = useAction(api.ai.generateIngredientSubstitutions);
  const generateCookingTips = useAction(api.ai.generateCookingTips);
  const generateMealPlan = useAction(api.ai.generateMealPlan);

  const handleRecipeSubmit = async (e: React.FormEvent) => {
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

  const handleSubstitutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!substitutionIngredient.trim()) return;

    setIsLoading(true);
    try {
      const subs = await generateSubstitutions({ 
        ingredient: substitutionIngredient.trim(),
        dietaryRestrictions: dietaryRestrictions.trim() || undefined
      });
      setSubstitutions(subs);
      toast.success("Ingredient substitutions generated!");
    } catch (error) {
      toast.error("Failed to generate substitutions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTipsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeType.trim()) return;

    setIsLoading(true);
    try {
      const cookingTips = await generateCookingTips({ 
        recipeType: recipeType.trim(),
        skillLevel: skillLevel.trim() || undefined
      });
      setTips(cookingTips);
      toast.success("Cooking tips generated!");
    } catch (error) {
      toast.error("Failed to generate cooking tips. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietaryPreferences.trim()) return;

    setIsLoading(true);
    try {
      const plan = await generateMealPlan({ 
        dietaryPreferences: dietaryPreferences.trim(),
        days: days,
        budget: budget.trim() || undefined
      });
      setMealPlan(plan);
      toast.success("Meal plan generated!");
    } catch (error) {
      toast.error("Failed to generate meal plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'recipes' as TabType, label: 'Recipe Suggestions', icon: '🍳' },
    { id: 'substitutions' as TabType, label: 'Ingredient Substitutions', icon: '🔄' },
    { id: 'tips' as TabType, label: 'Cooking Tips', icon: '💡' },
    { id: 'mealplan' as TabType, label: 'Meal Planning', icon: '📅' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          AI-Powered Cooking Assistant
        </h1>
        <p className="text-lg text-text">
          Get personalized recipe suggestions, ingredient substitutions, cooking tips, and meal plans powered by Groq AI!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-container font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recipe Suggestions Tab */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-container shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">🍳 Recipe Suggestions</h2>
            <form onSubmit={handleRecipeSubmit} className="space-y-4">
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
              <h3 className="text-2xl font-bold text-primary">
                Here are your personalized recipe suggestions:
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((recipe, index) => (
                  <AIRecipeCard key={index} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ingredient Substitutions Tab */}
      {activeTab === 'substitutions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-container shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">🔄 Ingredient Substitutions</h2>
            <form onSubmit={handleSubstitutionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What ingredient do you need to substitute?
                </label>
                <input
                  type="text"
                  value={substitutionIngredient}
                  onChange={(e) => setSubstitutionIngredient(e.target.value)}
                  className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="e.g., butter, eggs, milk..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Dietary restrictions (optional)
                </label>
                <input
                  type="text"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="e.g., vegan, gluten-free, dairy-free..."
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !substitutionIngredient.trim()}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Finding Substitutions..." : "Get Substitution Ideas"}
                </button>
              </div>
            </form>
          </div>

          {substitutions.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">
                Substitution Options for {substitutionIngredient}:
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                {substitutions.map((sub, index) => (
                  <div key={index} className="bg-white rounded-container shadow-lg p-6">
                    <h4 className="text-xl font-bold text-primary mb-2">{sub.name}</h4>
                    <p className="text-sm text-accent mb-2">Ratio: {sub.ratio}</p>
                    <p className="text-text/80 mb-3">{sub.explanation}</p>
                    {sub.notes && (
                      <p className="text-sm text-text/60 italic">Note: {sub.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cooking Tips Tab */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          <div className="bg-white rounded-container shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">💡 Cooking Tips</h2>
            <form onSubmit={handleTipsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What type of cooking do you need tips for?
                </label>
                <input
                  type="text"
                  value={recipeType}
                  onChange={(e) => setRecipeType(e.target.value)}
                  className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="e.g., baking, grilling, pasta making, stir-frying..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Skill level (optional)
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                >
                  <option value="">Any level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !recipeType.trim()}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Generating Tips..." : "Get Cooking Tips"}
                </button>
              </div>
            </form>
          </div>

          {tips.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">
                Cooking Tips for {recipeType}:
              </h3>
              
              <div className="grid gap-4">
                {tips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-container shadow-lg p-6">
                    <h4 className="text-xl font-bold text-primary mb-3">{tip.title}</h4>
                    <p className="text-text/80 mb-3">{tip.explanation}</p>
                    <p className="text-sm text-accent font-medium">Why it matters: {tip.importance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meal Planning Tab */}
      {activeTab === 'mealplan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-container shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">📅 Meal Planning</h2>
            <form onSubmit={handleMealPlanSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Dietary preferences
                  </label>
                  <input
                    type="text"
                    value={dietaryPreferences}
                    onChange={(e) => setDietaryPreferences(e.target.value)}
                    className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="e.g., vegetarian, keto, Mediterranean..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Number of days
                  </label>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  >
                    <option value={3}>3 days</option>
                    <option value={5}>5 days</option>
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Budget range (optional)
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                >
                  <option value="">Any budget</option>
                  <option value="budget-friendly">Budget-friendly</option>
                  <option value="moderate">Moderate</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !dietaryPreferences.trim()}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Meal Plan..." : "Generate Meal Plan"}
                </button>
              </div>
            </form>
          </div>

          {mealPlan.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">
                Your {days}-day meal plan:
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mealPlan.map((meal, index) => (
                  <div key={index} className="bg-white rounded-container shadow-lg p-6">
                    <h4 className="text-xl font-bold text-primary mb-2">{meal.name}</h4>
                    <p className="text-text/80 mb-3">{meal.description}</p>
                    <p className="text-sm text-accent mb-3">Prep time: {meal.prepTime} minutes</p>
                    <div>
                      <h5 className="font-semibold text-text mb-2">Key ingredients:</h5>
                      <ul className="text-sm text-text/70 space-y-1">
                        {meal.keyIngredients.map((ingredient, i) => (
                          <li key={i}>• {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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