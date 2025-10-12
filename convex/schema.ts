import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  recipes: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    ingredients: v.array(v.string()),
    steps: v.array(v.string()),
    images: v.array(v.id("_storage")),
    cuisine: v.string(),
    tags: v.array(v.string()),
    prepTime: v.number(), // in minutes
    servings: v.number(),
    authorId: v.id("users"),
    isApproved: v.boolean(),
    averageRating: v.number(),
    totalRatings: v.number(),
    version: v.number(),
    originalRecipeId: v.optional(v.id("recipes")),
  })
    .index("by_author", ["authorId"])
    .index("by_cuisine", ["cuisine"])
    .index("by_approved", ["isApproved"])
    .searchIndex("search_recipes", {
      searchField: "title",
      filterFields: ["cuisine", "isApproved"],
    }),

  recipeVersions: defineTable({
    recipeId: v.id("recipes"),
    version: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    ingredients: v.array(v.string()),
    steps: v.array(v.string()),
    images: v.array(v.id("_storage")),
    cuisine: v.string(),
    tags: v.array(v.string()),
    prepTime: v.number(),
    servings: v.number(),
    editedBy: v.id("users"),
  }).index("by_recipe", ["recipeId"]),

  ratings: defineTable({
    recipeId: v.id("recipes"),
    userId: v.id("users"),
    rating: v.number(), // 1-5 stars
  })
    .index("by_recipe", ["recipeId"])
    .index("by_user_recipe", ["userId", "recipeId"]),

  comments: defineTable({
    recipeId: v.id("recipes"),
    userId: v.id("users"),
    content: v.string(),
    parentCommentId: v.optional(v.id("comments")),
  })
    .index("by_recipe", ["recipeId"])
    .index("by_parent", ["parentCommentId"]),

  favorites: defineTable({
    userId: v.id("users"),
    recipeId: v.id("recipes"),
  })
    .index("by_user", ["userId"])
    .index("by_recipe", ["recipeId"])
    .index("by_user_recipe", ["userId", "recipeId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(), // "comment", "rating", "follow", "recipe_approved"
    message: v.string(),
    isRead: v.boolean(),
    relatedRecipeId: v.optional(v.id("recipes")),
    relatedUserId: v.optional(v.id("users")),
  }).index("by_user", ["userId"]),

  userProfiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
    isAdmin: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_username", ["username"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
