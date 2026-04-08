import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useAction } from "convex/react";
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
  const initiateTip = useAction(api.tips.initiateRecipeTip);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const tipSummary = useQuery(
    api.tips.getRecipeTipSummary,
    recipe ? { recipeId: recipe._id } : "skip",
  );

  const [userRating, setUserRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [tipAmount, setTipAmount] = useState(100);
  const [tipPhone, setTipPhone] = useState("");
  const [isTipping, setIsTipping] = useState(false);

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
    } catch {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const isFavorited = await toggleFavorite({ recipeId: recipe._id });
      toast.success(isFavorited ? "Added to favorites!" : "Removed from favorites");
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const handleTip = async () => {
    setIsTipping(true);
    try {
      const result = await initiateTip({
        recipeId: recipe._id,
        amount: tipAmount,
        phoneNumber: tipPhone,
      });
      if (result.status === "pending") {
        toast.success(result.customerMessage);
      } else {
        toast.error("Could not start M-Pesa request. Check your number and Daraja settings.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start tip");
    } finally {
      setIsTipping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-container shadow-lg overflow-hidden">
        {/* Recipe Images */}
        {recipe.imageUrls.length > 0 && (
          <div className="h-52 sm:h-60 w-full overflow-hidden bg-secondary">
            <img
              src={recipe.imageUrls[0].url || ""}
              alt={recipe.title}
              className="h-full w-full object-cover"
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
            <div className="flex items-center gap-2 shrink-0">
              {loggedInUser && loggedInUser._id === recipe.authorId && (
                <Link
                  to={`/recipe/${recipe._id}/edit`}
                  className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-container hover:bg-primary hover:text-white transition-colors"
                >
                  Edit recipe
                </Link>
              )}
            <button
              type="button"
              onClick={() => void handleToggleFavorite()}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            </div>
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
                onRatingChange={(rating) => void handleRating(rating)}
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

      {/* Tip (Daraja STK) — below comments */}
      <div className="mt-8 p-4 bg-white rounded-container shadow-lg border border-accent/20">
        <h3 className="text-lg font-semibold text-primary mb-1">Tip this recipe</h3>
        <p className="text-sm text-text/70 mb-3">
          Send a tip to the chef via Safaricom M-Pesa (STK push).
        </p>
        {loggedInUser ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label className="block text-xs text-text/60 mb-1">Amount (KES)</label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2 rounded-container border border-accent"
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-text/60 mb-1">M-Pesa phone</label>
              <input
                type="tel"
                className="w-full px-3 py-2 rounded-container border border-accent"
                placeholder="07XXXXXXXX or 2547XXXXXXXXX"
                value={tipPhone}
                onChange={(e) => setTipPhone(e.target.value)}
              />
            </div>
            <button
              type="button"
              disabled={isTipping || tipAmount < 1 || !tipPhone.trim()}
              onClick={() => void handleTip()}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover disabled:opacity-50"
            >
              {isTipping ? "Sending…" : "Tip with M-Pesa"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-text/70">Sign in to tip the chef.</p>
        )}
        {tipSummary !== undefined && (
          <p className="text-xs text-text/60 mt-2">
            Tips on this recipe: {tipSummary.totalTips} · KES {tipSummary.totalAmount} total
          </p>
        )}
      </div>
    </div>
  );
}
