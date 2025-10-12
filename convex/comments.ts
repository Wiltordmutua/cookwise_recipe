import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getComments = query({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .order("desc")
      .collect();

    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.userId);
        const authorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", comment.userId))
          .unique();

        return {
          ...comment,
          author: {
            ...author,
            profile: authorProfile,
          },
        };
      })
    );

    return commentsWithAuthors;
  },
});

export const addComment = mutation({
  args: {
    recipeId: v.id("recipes"),
    content: v.string(),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to comment");
    }

    const commentId = await ctx.db.insert("comments", {
      recipeId: args.recipeId,
      userId,
      content: args.content,
      parentCommentId: args.parentCommentId,
    });

    // Create notification for recipe author
    const recipe = await ctx.db.get(args.recipeId);
    if (recipe && recipe.authorId !== userId) {
      await ctx.db.insert("notifications", {
        userId: recipe.authorId,
        type: "comment",
        message: `Someone commented on your recipe "${recipe.title}"`,
        isRead: false,
        relatedRecipeId: args.recipeId,
        relatedUserId: userId,
      });
    }

    return commentId;
  },
});
