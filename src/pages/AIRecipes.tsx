import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Drawer, IconButton, Tooltip } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

interface AIRecipe {
  title: string;
  description?: string;
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
  const [activeRecipeView, setActiveRecipeView] = useState<"suggestions" | "saved">("suggestions");
  const [activeSearchId, setActiveSearchId] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
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
  const addRecipeSearch = useMutation(api.aiRecipeLibrary.addRecipeSearch);

  const recipeSearchHistory = useQuery(api.aiRecipeLibrary.listRecipeSearches, { limit: 30 });
  const savedAiRecipes = useQuery(api.aiRecipeLibrary.listSavedAiRecipes, { limit: 100 });

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsLoading(true);
    try {
      const recipes = await generateSuggestions({ ingredients: ingredients.trim() });
      setSuggestions(recipes);
      setActiveRecipeView("suggestions");
      try {
        const searchId = await addRecipeSearch({
          prompt: ingredients.trim(),
          recipes,
        });
        setActiveSearchId(searchId);
      } catch {
        // Non-fatal (e.g. user not logged in).
        setActiveSearchId(null);
      }
      toast.success("Recipe suggestions generated!");
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      toast.error("Failed to generate meal plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'recipes' as TabType, label: 'Recipe Suggestions' },
    { id: 'substitutions' as TabType, label: 'Ingredient Substitutions' },
    { id: 'tips' as TabType, label: 'Cooking Tips' },
    { id: 'mealplan' as TabType, label: 'Meal Planning' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* History icon (top-right of page) */}
      <div className="absolute right-4 top-4 z-10">
        <Tooltip title="History" placement="left">
          <IconButton
            onClick={() => setIsHistoryOpen(true)}
            size="small"
            sx={{
              border: "1px solid rgba(108, 117, 95, 0.6)",
              color: "primary.main",
              backgroundColor: "background.paper",
            }}
            aria-label="Open history"
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

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
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recipe Suggestions Tab */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-container shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Recipe Suggestions</h2>
            <form onSubmit={(e) => void handleRecipeSubmit(e)} className="space-y-4">
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

          <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveRecipeView("suggestions")}
                className={`px-3 py-2 rounded-container text-sm font-semibold border ${
                  activeRecipeView === "suggestions"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                }`}
              >
                Suggestions
              </button>
              <button
                type="button"
                onClick={() => setActiveRecipeView("saved")}
                className={`px-3 py-2 rounded-container text-sm font-semibold border ${
                  activeRecipeView === "saved"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                }`}
              >
                Saved
              </button>
            </div>

            {activeRecipeView === "saved" ? (
              savedAiRecipes === undefined ? (
                <div className="bg-white rounded-container shadow-lg p-6">
                  <p className="text-sm text-text/70">Loading saved recipes…</p>
                </div>
              ) : savedAiRecipes.length === 0 ? (
                <div className="bg-white rounded-container shadow-lg p-6">
                  <p className="text-sm text-text/70">No saved recipes yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {savedAiRecipes.map((r) => (
                    <AIRecipeCard
                      key={String(r._id)}
                      recipe={{
                        title: r.title,
                        description: r.description,
                        ingredients: r.ingredients,
                        steps: r.steps,
                        prepTime: r.prepTime,
                        servings: r.servings,
                        cuisine: r.cuisine,
                        tags: r.tags,
                      }}
                      sourceSearchId={r.sourceSearchId ? String(r.sourceSearchId) : null}
                    />
                  ))}
                </div>
              )
            ) : suggestions.length === 0 ? (
              <div className="bg-white rounded-container shadow-lg p-6">
                <p className="text-sm text-text/70">Generate suggestions or pick one from history.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {suggestions.map((recipe, index) => (
                  <AIRecipeCard key={index} recipe={recipe} sourceSearchId={activeSearchId} />
                ))}
              </div>
            )}
          </div>

          <Drawer
            anchor="right"
            open={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            PaperProps={{ sx: { width: { xs: "92vw", sm: 420 }, p: 2 } }}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-bold text-primary">History</h3>
              <button
                type="button"
                onClick={() => {
                  setSuggestions([]);
                  setActiveSearchId(null);
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Clear view
              </button>
            </div>

            {recipeSearchHistory === undefined ? (
              <p className="text-sm text-text/70">Loading…</p>
            ) : recipeSearchHistory.length === 0 ? (
              <p className="text-sm text-text/70">No searches yet.</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
                {recipeSearchHistory.map((search) => (
                  <button
                    key={search._id}
                    type="button"
                    onClick={() => {
                      setIngredients(search.prompt);
                      setSuggestions(search.recipes);
                      setActiveRecipeView("suggestions");
                      setActiveSearchId(search._id);
                      setIsHistoryOpen(false);
                    }}
                    className={`w-full text-left rounded-container border px-3 py-2 transition-colors ${
                      String(search._id) === String(activeSearchId)
                        ? "border-primary bg-primary/5"
                        : "border-accent hover:bg-accent/20"
                    }`}
                  >
                    <div className="text-sm font-semibold text-text line-clamp-2">{search.prompt}</div>
                    <div className="text-xs text-text/60 mt-1">
                      {search.recipes.length} suggestion{search.recipes.length === 1 ? "" : "s"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Drawer>
        </div>
      )}

      {/* Ingredient Substitutions Tab */}
      {activeTab === 'substitutions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-container shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Ingredient Substitutions</h2>
            <form onSubmit={(e) => void handleSubstitutionSubmit(e)} className="space-y-4">
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
            <h2 className="text-2xl font-bold text-primary mb-4">Cooking Tips</h2>
            <form onSubmit={(e) => void handleTipsSubmit(e)} className="space-y-4">
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
            <h2 className="text-2xl font-bold text-primary mb-4">Meal Planning</h2>
            <form onSubmit={(e) => void handleMealPlanSubmit(e)} className="space-y-4">
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

function AIRecipeCard({
  recipe,
  sourceSearchId,
}: {
  recipe: AIRecipe;
  sourceSearchId?: any;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleIngredients = isExpanded ? recipe.ingredients : recipe.ingredients.slice(0, 5);
  const visibleSteps = isExpanded ? recipe.steps : recipe.steps.slice(0, 3);
  const toggleSave = useMutation(api.aiRecipeLibrary.toggleSaveAiRecipe);
  const isSaved = useQuery(api.aiRecipeLibrary.isAiRecipeSaved, { recipe });
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="bg-white rounded-container shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-primary mb-2">{recipe.title}</h3>
          <button
            type="button"
            disabled={isSaving || isSaved === undefined}
            onClick={() => {
              setIsSaving(true);
              void toggleSave({
                recipe,
                sourceSearchId: sourceSearchId ?? undefined,
              })
                .then((res) => {
                  toast.success(res.saved ? "Saved recipe" : "Removed from saved");
                })
                .catch(() => toast.error("Could not update saved recipes"))
                .finally(() => setIsSaving(false));
            }}
            className={`shrink-0 px-3 py-2 rounded-container text-sm font-semibold border transition-colors disabled:opacity-50 ${
              isSaved
                ? "bg-primary text-white border-primary hover:bg-primary-hover"
                : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
            }`}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
        <p className="text-text/70 text-sm mb-4">{recipe.description ?? ""}</p>
        
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
            {visibleIngredients.map((ingredient, i) => (
              <li key={i}>• {ingredient}</li>
            ))}
            {!isExpanded && recipe.ingredients.length > 5 && (
              <li>
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="text-primary font-medium hover:underline"
                >
                  + {recipe.ingredients.length - 5} more…
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-text mb-2">Steps:</h4>
          <ol className="text-sm text-text/70 space-y-1">
            {visibleSteps.map((step, i) => (
              <li key={i}>
                {i + 1}. {isExpanded ? step : `${step.substring(0, 60)}...`}
              </li>
            ))}
            {!isExpanded && recipe.steps.length > 3 && (
              <li>
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="text-primary font-medium hover:underline"
                >
                  + {recipe.steps.length - 3} more steps…
                </button>
              </li>
            )}
          </ol>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="text-primary font-semibold hover:underline"
          >
            {isExpanded ? "Show less" : "Show full recipe"}
          </button>
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