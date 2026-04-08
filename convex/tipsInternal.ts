import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const recordTipRequest = internalMutation({
  args: {
    recipeId: v.id("recipes"),
    tipperId: v.id("users"),
    authorId: v.id("users"),
    amount: v.number(),
    phoneNumber: v.string(),
    status: v.union(v.literal("pending"), v.literal("failed")),
    checkoutRequestId: v.optional(v.string()),
    merchantRequestId: v.optional(v.string()),
    responseCode: v.optional(v.string()),
    responseDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("recipeTips", args);
  },
});

export const updateTipStatusFromCallback = internalMutation({
  args: {
    checkoutRequestId: v.string(),
    status: v.union(v.literal("success"), v.literal("failed")),
    mpesaReceiptNumber: v.optional(v.string()),
    responseDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tip = await ctx.db
      .query("recipeTips")
      .withIndex("by_checkout_request_id", (q) =>
        q.eq("checkoutRequestId", args.checkoutRequestId),
      )
      .unique();
    if (!tip) return;
    await ctx.db.patch(tip._id, {
      status: args.status,
      mpesaReceiptNumber: args.mpesaReceiptNumber,
      responseDescription: args.responseDescription,
    });
  },
});
