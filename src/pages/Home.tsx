import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RecipeCard } from "../components/RecipeCard";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "../SignInForm";

export function Home() {
  const recipes = useQuery(api.recipes.getRecipes, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Authenticated>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Discover Amazing Recipes
          </h1>
          <p className="text-lg text-text">
            Explore recipes shared by our community of passionate cooks
          </p>
        </div>

        {recipes === undefined ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-text mb-2">No recipes yet</h3>
            <p className="text-text/70">Be the first to share a recipe!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </Authenticated>

      <Unauthenticated>
        <div className="max-w-md mx-auto text-center py-12">
          <h1 className="text-5xl font-bold text-primary mb-4">Welcome to Cookwise</h1>
          <p className="text-xl text-text mb-8">
            Join our community of passionate cooks and discover amazing recipes
          </p>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
