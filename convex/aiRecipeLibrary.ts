import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

const aiRecipeValidator = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  ingredients: v.array(v.string()),
  steps: v.array(v.string()),
  prepTime: v.number(),
  servings: v.number(),
  cuisine: v.string(),
  tags: v.array(v.string()),
});

function requireUserId(userId: Id<"users"> | null): Id<"users"> {
  if (!userId) throw new Error("Must be logged in");
  return userId;
}

function fingerprintRecipe(recipe: {
  title: string;
  cuisine: string;
  ingredients: string[];
  steps: string[];
}): string {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  const ingredients = recipe.ingredients.map(normalize).sort().join("|");
  const steps = recipe.steps.map(normalize).join("|");
  return `${normalize(recipe.title)}::${normalize(recipe.cuisine)}::${ingredients}::${steps}`;
}

export const addRecipeSearch = mutation({
  args: {
    prompt: v.string(),
    recipes: v.array(aiRecipeValidator),
  },
  handler: async (ctx, args) => {
    const userId = requireUserId(await getAuthUserId(ctx));
    return await ctx.db.insert("aiRecipeSearches", {
      userId,
      prompt: args.prompt,
      recipes: args.recipes,
    });
  },
});

export const listRecipeSearches = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("aiRecipeSearches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 30);
  },
});

export const deleteRecipeSearch = mutation({
  args: { searchId: v.id("aiRecipeSearches") },
  handler: async (ctx, args) => {
    const userId = requireUserId(await getAuthUserId(ctx));
    const search = await ctx.db.get(args.searchId);
    if (!search || search.userId !== userId) throw new Error("Search not found");

    await ctx.db.delete(args.searchId);
  },
});

export const toggleSaveAiRecipe = mutation({
  args: {
    recipe: aiRecipeValidator,
    sourceSearchId: v.optional(v.id("aiRecipeSearches")),
  },
  handler: async (ctx, args) => {
    const userId = requireUserId(await getAuthUserId(ctx));
    const fingerprint = fingerprintRecipe(args.recipe);

    const existing = await ctx.db
      .query("savedAiRecipes")
      .withIndex("by_user_fingerprint", (q) => q.eq("userId", userId).eq("fingerprint", fingerprint))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false as const };
    }

    const id = await ctx.db.insert("savedAiRecipes", {
      userId,
      fingerprint,
      ...args.recipe,
      sourceSearchId: args.sourceSearchId,
    });
    return { saved: true as const, id };
  },
});

export const listSavedAiRecipes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("savedAiRecipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit ?? 100);
  },
});

export const isAiRecipeSaved = query({
  args: { recipe: aiRecipeValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const fingerprint = fingerprintRecipe(args.recipe);
    const existing = await ctx.db
      .query("savedAiRecipes")
      .withIndex("by_user_fingerprint", (q) => q.eq("userId", userId).eq("fingerprint", fingerprint))
      .unique();
    return !!existing;
  },
});

