import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Comments } from "../components/Comments";
import { StarRating } from "../components/StarRating";

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = useQuery(api.recipes.getRecipe, { id: id as any });
  const rateRecipe = useMutation(api.recipes.rateRecipe);
  const toggleFavorite = useMutation(api.recipes.toggleFavorite);
  
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  if (recipe === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-text">Recipe not found</h1>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleRating = async (rating: number) => {
    setIsSubmittingRating(true);
    try {
      await rateRecipe({ recipeId: recipe._id, rating });
      setUserRating(rating);
      toast.success("Rating submitted!");
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const isFavorited = await toggleFavorite({ recipeId: recipe._id });
      toast.success(isFavorited ? "Added to favorites!" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-container shadow-lg overflow-hidden">
        {/* Recipe Images */}
        {recipe.imageUrls.length > 0 && (
          <div className="aspect-video bg-secondary">
            <img
              src={recipe.imageUrls[0].url || ""}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{recipe.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-text/70">
                <span>By {recipe.author?.profile?.username}</span>
                <span>•</span>
                <span>{recipe.prepTime} minutes</span>
                <span>•</span>
                <span>{recipe.servings} servings</span>
                <span>•</span>
                <span className="px-2 py-1 bg-accent rounded-full text-xs">
                  {recipe.cuisine}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-text mb-6">{recipe.description}</p>
          )}

          {/* Rating */}
          <div className="mb-6 p-4 bg-secondary/30 rounded-container">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <StarRating rating={recipe.averageRating} readonly />
                  <span className="text-sm text-text/70">
                    ({recipe.totalRatings} ratings)
                  </span>
                </div>
                <p className="text-sm text-text/70">Rate this recipe:</p>
              </div>
              <StarRating
                rating={userRating}
                onRatingChange={handleRating}
                disabled={isSubmittingRating}
              />
            </div>
          </div>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent text-text text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-text">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <Comments recipeId={recipe._id} />
      </div>
    </div>
  );
}
