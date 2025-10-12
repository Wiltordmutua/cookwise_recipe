import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createRecipe = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    ingredients: v.array(v.string()),
    steps: v.array(v.string()),
    images: v.array(v.id("_storage")),
    cuisine: v.string(),
    tags: v.array(v.string()),
    prepTime: v.number(),
    servings: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create recipe");
    }

    const recipeId = await ctx.db.insert("recipes", {
      ...args,
      authorId: userId,
      isApproved: true, // Auto-approve recipes for demo
      averageRating: 0,
      totalRatings: 0,
      version: 1,
    });

    // Create initial version
    await ctx.db.insert("recipeVersions", {
      recipeId,
      version: 1,
      ...args,
      editedBy: userId,
    });

    return recipeId;
  },
});

export const getRecipes = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    cuisine: v.optional(v.string()),
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let recipes;
    
    if (args.searchTerm) {
      recipes = await ctx.db
        .query("recipes")
        .withSearchIndex("search_recipes", (q) =>
          q.search("title", args.searchTerm!)
            .eq("isApproved", true)
        )
        .take(args.limit || 20);
    } else {
      recipes = await ctx.db
        .query("recipes")
        .withIndex("by_approved", (q) => q.eq("isApproved", true))
        .order("desc")
        .take(args.limit || 20);
    }
    
    // Get recipe details with author info and images
    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => {
        const author = await ctx.db.get(recipe.authorId);
        const authorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", recipe.authorId))
          .unique();
        
        const imageUrls = await Promise.all(
          recipe.images.map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return { id: imageId, url };
          })
        );

        return {
          ...recipe,
          author: {
            ...author,
            profile: authorProfile,
          },
          imageUrls,
        };
      })
    );

    return recipesWithDetails;
  },
});

export const getRecipe = query({
  args: { id: v.id("recipes") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.id);
    if (!recipe) return null;

    const author = await ctx.db.get(recipe.authorId);
    const authorProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", recipe.authorId))
      .unique();

    const imageUrls = await Promise.all(
      recipe.images.map(async (imageId) => {
        const url = await ctx.storage.getUrl(imageId);
        return { id: imageId, url };
      })
    );

    return {
      ...recipe,
      author: {
        ...author,
        profile: authorProfile,
      },
      imageUrls,
    };
  },
});

export const rateRecipe = mutation({
  args: {
    recipeId: v.id("recipes"),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to rate recipe");
    }

    // Check if user already rated this recipe
    const existingRating = await ctx.db
      .query("ratings")
      .withIndex("by_user_recipe", (q) => 
        q.eq("userId", userId).eq("recipeId", args.recipeId)
      )
      .unique();

    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, { rating: args.rating });
    } else {
      // Create new rating
      await ctx.db.insert("ratings", {
        recipeId: args.recipeId,
        userId,
        rating: args.rating,
      });
    }

    // Recalculate average rating
    const allRatings = await ctx.db
      .query("ratings")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();

    const totalRatings = allRatings.length;
    const averageRating = totalRatings > 0 
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    await ctx.db.patch(args.recipeId, {
      averageRating,
      totalRatings,
    });

    // Create notification for recipe author
    const recipe = await ctx.db.get(args.recipeId);
    if (recipe && recipe.authorId !== userId) {
      await ctx.db.insert("notifications", {
        userId: recipe.authorId,
        type: "rating",
        message: `Someone rated your recipe "${recipe.title}"`,
        isRead: false,
        relatedRecipeId: args.recipeId,
        relatedUserId: userId,
      });
    }
  },
});

export const toggleFavorite = mutation({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to favorite recipe");
    }

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_recipe", (q) => 
        q.eq("userId", userId).eq("recipeId", args.recipeId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("favorites", {
        userId,
        recipeId: args.recipeId,
      });
      return true;
    }
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
