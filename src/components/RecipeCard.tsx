import { Link } from "react-router-dom";
import { StarRating } from "./StarRating";

interface Recipe {
  _id: string;
  title: string;
  description?: string;
  cuisine: string;
  prepTime: number;
  servings: number;
  averageRating: number;
  totalRatings: number;
  imageUrls?: Array<{ id: string; url: string | null }>;
  author?: {
    profile?: {
      username: string;
    } | null;
  };
}

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${recipe._id}`} className="group">
      <div className="bg-white rounded-container shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Recipe Image */}
        <div className="aspect-video bg-secondary">
          {recipe.imageUrls?.[0]?.url ? (
            <img
              src={recipe.imageUrls[0].url}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text/50">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 group-hover:text-primary-hover transition-colors">
            {recipe.title}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p className="text-text/70 text-sm mb-3 line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-text/70 mb-3">
            <span>{recipe.prepTime} min</span>
            <span>{recipe.servings} servings</span>
            <span className="px-2 py-1 bg-accent rounded-full text-xs">
              {recipe.cuisine}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <StarRating rating={recipe.averageRating} readonly size="sm" />
              <span className="text-xs text-text/70">
                ({recipe.totalRatings})
              </span>
            </div>
            {recipe.author?.profile?.username && (
              <span className="text-xs text-text/70">
                by {recipe.author.profile.username}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
