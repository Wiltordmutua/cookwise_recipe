import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RecipeCard } from "../components/RecipeCard";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  
  const recipes = useQuery(api.recipes.getRecipes, {
    searchTerm: searchTerm || undefined,
    cuisine: selectedCuisine || undefined,
  });

  const cuisines = [
    "Italian", "Mexican", "Asian", "American", "Mediterranean", 
    "Indian", "French", "African", "Other"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Search Recipes</h1>
        <p className="text-lg text-text">
          Find the perfect recipe for your next meal
        </p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-container shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Search by title or ingredients
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Search recipes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Filter by cuisine
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            >
              <option value="">All cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {recipes === undefined ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-text mb-2">No recipes found</h3>
          <p className="text-text/70">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-text/70">
              Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
