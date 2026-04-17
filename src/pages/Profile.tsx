import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RecipeCard } from "../components/RecipeCard";
import { toast } from "sonner";
import { Badge, Drawer, IconButton } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

type SavedAiRecipe = {
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  servings: number;
  cuisine: string;
  tags: string[];
};

function SavedAiRecipeCard({ recipe }: { recipe: SavedAiRecipe }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleIngredients = isExpanded ? recipe.ingredients : recipe.ingredients.slice(0, 5);
  const visibleSteps = isExpanded ? recipe.steps : recipe.steps.slice(0, 3);

  return (
    <div className="bg-white rounded-container shadow-lg overflow-hidden border border-accent/40">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-primary">{recipe.title}</h3>
            {recipe.description && <p className="text-text/70 text-sm mt-1">{recipe.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="shrink-0 text-sm font-semibold text-primary hover:underline"
          >
            {isExpanded ? "Show less" : "Show full"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-text/70">
          <div className="rounded-container bg-accent/20 px-2 py-1">{recipe.prepTime} min</div>
          <div className="rounded-container bg-accent/20 px-2 py-1">{recipe.servings} servings</div>
          <div className="rounded-container bg-accent/20 px-2 py-1">{recipe.cuisine}</div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-text mb-2">Ingredients</h4>
          <ul className="text-sm text-text/70 space-y-1">
            {visibleIngredients.map((ing, i) => (
              <li key={i}>• {ing}</li>
            ))}
            {!isExpanded && recipe.ingredients.length > 5 && (
              <li className="text-primary">+ {recipe.ingredients.length - 5} more…</li>
            )}
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-text mb-2">Steps</h4>
          <ol className="text-sm text-text/70 space-y-1">
            {visibleSteps.map((step, i) => (
              <li key={i}>
                {i + 1}. {isExpanded ? step : `${step.substring(0, 60)}...`}
              </li>
            ))}
            {!isExpanded && recipe.steps.length > 3 && (
              <li className="text-primary">+ {recipe.steps.length - 3} more…</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

export function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const userProfile = useQuery(api.users.getUserProfile, { userId: userId as any });
  const currentUser = useQuery(api.auth.loggedInUser);
  const followUser = useMutation(api.users.followUser);
  const favoriteRecipes = useQuery(api.recipes.listFavoriteRecipes, { limit: 100 });
  const savedAiRecipes = useQuery(api.aiRecipeLibrary.listSavedAiRecipes, { limit: 100 });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const handleFollow = async () => {
    if (!userId) return;
    
    try {
      const isFollowing = await followUser({ userId: userId as any });
      toast.success(isFollowing ? "Following user!" : "Unfollowed user");
    } catch {
      toast.error("Failed to update follow status");
    }
  };

  if (userProfile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-text">User not found</h1>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-container shadow-lg p-6 mb-8">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-3xl font-bold text-primary">
            {userProfile.profile?.avatarUrl ? (
              <img
                src={userProfile.profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              userProfile.profile?.username?.[0]?.toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-primary">{userProfile.profile?.username}</h1>
                {isOwnProfile && (
                  <IconButton
                    onClick={() => setIsFavoritesOpen(true)}
                    aria-label="Open favorites"
                    size="small"
                    sx={{
                      border: "1px solid rgba(108, 117, 95, 0.45)",
                      ml: 0.5,
                    }}
                  >
                    <Badge
                      color="error"
                      badgeContent={(favoriteRecipes?.length ?? 0) + (savedAiRecipes?.length ?? 0)}
                      max={99}
                    >
                      <StarOutlineIcon sx={{ color: "text.secondary" }} fontSize="small" />
                    </Badge>
                  </IconButton>
                )}
              </div>
              {!isOwnProfile && currentUser && (
                <button
                  onClick={() => void handleFollow()}
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors"
                >
                  Follow
                </button>
              )}
            </div>

            <div className="flex items-center space-x-6 text-text/70 mb-4">
              <span>{userProfile.recipes.length} recipes</span>
              <span>{userProfile.followerCount} followers</span>
              <span>{userProfile.followingCount} following</span>
            </div>

            {userProfile.profile?.bio && (
              <p className="text-text">{userProfile.profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      <Drawer
        anchor="right"
        open={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        PaperProps={{ sx: { width: { xs: "92vw", sm: 520 }, p: 2 } }}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-primary">Favorites</h2>
          <button
            type="button"
            onClick={() => setIsFavoritesOpen(false)}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-text mb-3">Community recipes</h3>
            {favoriteRecipes === undefined ? (
              <p className="text-sm text-text/70">Loading…</p>
            ) : favoriteRecipes.length === 0 ? (
              <p className="text-sm text-text/70">No favorited community recipes yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteRecipes.map((recipe: any) => {
                  const mapped = {
                    id: String(recipe._id),
                    title: recipe.title,
                    description: recipe.description,
                    imageUrl: recipe.imageUrls?.[0]?.url || "",
                    prepTime: recipe.prepTime,
                    servings: recipe.servings,
                    cuisine: recipe.cuisine,
                    tags: recipe.tags || [],
                    rating: recipe.averageRating ?? 0,
                    totalRatings: recipe.totalRatings ?? 0,
                    author: {
                      username: recipe.author?.profile?.username || "User",
                      avatar: "",
                    },
                    isFavorite: true,
                  };

                  return (
                    <div key={recipe._id} className="h-[460px]">
                      <RecipeCard
                        recipe={mapped as any}
                        onClick={(id) => navigate(`/recipe/${id}`)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-text mb-3">AI saved recipes</h3>
            {savedAiRecipes === undefined ? (
              <p className="text-sm text-text/70">Loading…</p>
            ) : savedAiRecipes.length === 0 ? (
              <p className="text-sm text-text/70">No saved AI recipes yet.</p>
            ) : (
              <div className="space-y-4">
                {savedAiRecipes.map((r: any) => (
                  <SavedAiRecipeCard
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* User's Recipes */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">
          {isOwnProfile ? "Your Recipes" : `${userProfile.profile?.username}'s Recipes`}
        </h2>

        {userProfile.recipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-text mb-2">No recipes yet</h3>
            <p className="text-text/70">
              {isOwnProfile ? "Start sharing your favorite recipes!" : "This user hasn't shared any recipes yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userProfile.recipes.map((recipe: any) => {
              const mapped = {
                id: String(recipe._id),
                title: recipe.title,
                description: recipe.description,
                imageUrl: recipe.imageUrls?.[0]?.url || "",
                prepTime: recipe.prepTime,
                servings: recipe.servings,
                cuisine: recipe.cuisine,
                tags: recipe.tags || [],
                rating: recipe.averageRating ?? 0,
                totalRatings: recipe.totalRatings ?? 0,
                author: {
                  username: userProfile.profile?.username || "User",
                  avatar: "",
                },
                isFavorite: recipe.isFavorite ?? false,
              };

              return (
                <div key={recipe._id} className="h-[460px]">
                  <RecipeCard recipe={mapped as any} onClick={(id) => navigate(`/recipe/${id}`)} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
