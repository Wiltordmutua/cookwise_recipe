import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingProfile) {
      return existingProfile._id;
    }

    // Create new profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId,
      username: user.name || user.email?.split("@")[0] || "User",
      isAdmin: false,
    });

    return profileId;
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    const avatarUrl = profile?.avatar 
      ? await ctx.storage.getUrl(profile.avatar)
      : null;

    // Get user's recipes
    const userRecipes = await ctx.db
      .query("recipes")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .collect();

    // Add image URLs to recipes
    const recipes = await Promise.all(
      userRecipes.map(async (recipe) => {
        const imageUrls = await Promise.all(
          recipe.images.map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return { id: imageId, url };
          })
        );
        return { ...recipe, imageUrls };
      })
    );

    // Get follower/following counts
    const followerCount = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect()
      .then(follows => follows.length);

    const followingCount = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect()
      .then(follows => follows.length);

    return {
      ...user,
      profile: {
        ...profile,
        avatarUrl,
      },
      recipes,
      followerCount,
      followingCount,
    };
  },
});

export const updateProfile = mutation({
  args: {
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to update profile");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) {
      throw new Error("Profile not found");
    }

    const updates: any = {};
    if (args.username !== undefined) updates.username = args.username;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.avatar !== undefined) updates.avatar = args.avatar;

    await ctx.db.patch(profile._id, updates);
  },
});

export const followUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followerId = await getAuthUserId(ctx);
    if (!followerId) {
      throw new Error("Must be logged in to follow users");
    }

    if (followerId === args.userId) {
      throw new Error("Cannot follow yourself");
    }

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", followerId))
      .filter((q) => q.eq(q.field("followingId"), args.userId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("follows", {
        followerId,
        followingId: args.userId,
      });

      // Create notification
      await ctx.db.insert("notifications", {
        userId: args.userId,
        type: "follow",
        message: "Someone started following you",
        isRead: false,
        relatedUserId: followerId,
      });

      return true;
    }
  },
});

export const getNotifications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);

    return notifications;
  },
});

export const markNotificationRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});
