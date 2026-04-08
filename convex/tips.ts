import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, httpAction, query } from "./_generated/server";

/** Safaricom Daraja sandbox test Till (Lipa na M-Pesa Online). Override in prod with `DARAJA_SHORTCODE`. */
const DARAJA_SANDBOX_SHORTCODE = "174379";

function darajaBaseUrl(): string {
  const raw = process.env.DARAJA_BASE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "https://sandbox.safaricom.co.ke";
}

function normalizePhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  throw new Error("Enter a valid Kenyan Safaricom number (e.g. 07XXXXXXXX).");
}

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

/** Convex actions run without Node's `Buffer`; use Web-standard base64. */
function toBase64(asciiString: string): string {
  return btoa(asciiString);
}

export const getRecipeTipSummary = query({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const tips = await ctx.db
      .query("recipeTips")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    const successful = tips.filter((t) => t.status === "success");
    const totalAmount = successful.reduce((sum, t) => sum + t.amount, 0);
    return { totalTips: successful.length, totalAmount };
  },
});

export const initiateRecipeTip = action({
  args: {
    recipeId: v.id("recipes"),
    amount: v.number(),
    phoneNumber: v.string(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    tipId: string;
    checkoutRequestId?: string;
    customerMessage: string;
    status: "pending" | "failed";
  }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You must be signed in to tip.");

    if (args.amount < 1) throw new Error("Tip amount must be at least KES 1.");

    const recipe = await ctx.runQuery(api.recipes.getRecipe, { id: args.recipeId });
    if (!recipe) throw new Error("Recipe not found.");
    if (recipe.authorId === userId) throw new Error("You cannot tip your own recipe.");

    const consumerKey = process.env.DARAJA_CONSUMER_KEY;
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
    const shortcode =
      process.env.DARAJA_SHORTCODE?.trim() || DARAJA_SANDBOX_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;
    const base = darajaBaseUrl();
    const callbackUrl =
      process.env.DARAJA_CALLBACK_URL?.trim() ||
      `${process.env.CONVEX_SITE_URL}/daraja/callback`;

    if (!consumerKey || !consumerSecret) {
      throw new Error(
        "Daraja is not configured: set DARAJA_CONSUMER_KEY and DARAJA_CONSUMER_SECRET on your Convex deployment.",
      );
    }
    if (!passkey?.trim()) {
      throw new Error(
        "Daraja is not configured: set DARAJA_PASSKEY on your Convex deployment (sandbox passkey from Safaricom developer portal).",
      );
    }

    const passkeyTrimmed = passkey.trim();

    const normalizedPhone = normalizePhoneNumber(args.phoneNumber);
    const timestamp = getTimestamp();
    const password = toBase64(`${shortcode}${passkeyTrimmed}${timestamp}`);
    const amount = Math.round(args.amount);

    const authUrl = `${base}/oauth/v1/generate?grant_type=client_credentials`;
    const stkUrl = `${base}/mpesa/stkpush/v1/processrequest`;

    const authHeader = toBase64(`${consumerKey}:${consumerSecret}`);
    const tokenResponse = await fetch(authUrl, {
      method: "GET",
      headers: { Authorization: `Basic ${authHeader}` },
    });
    if (!tokenResponse.ok) {
      const body = await tokenResponse.text();
      throw new Error(`Daraja auth failed: ${body}`);
    }
    const tokenJson = (await tokenResponse.json()) as { access_token?: string };
    const accessToken = tokenJson.access_token;
    if (!accessToken) throw new Error("Daraja did not return an access token.");

    const stkResponse = await fetch(stkUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: normalizedPhone,
        PartyB: shortcode,
        PhoneNumber: normalizedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `Cookwise-${args.recipeId}`,
        TransactionDesc: "Cookwise tip",
      }),
    });

    const stkBody = (await stkResponse.json()) as Record<string, unknown>;
    const rc = stkBody.ResponseCode;
    const ok = rc === "0" || rc === 0;

    const tipId: string = await ctx.runMutation(internal.tipsInternal.recordTipRequest, {
      recipeId: args.recipeId,
      tipperId: userId,
      authorId: recipe.authorId,
      amount,
      phoneNumber: normalizedPhone,
      status: ok ? "pending" : "failed",
      checkoutRequestId: stkBody.CheckoutRequestID as string | undefined,
      merchantRequestId: stkBody.MerchantRequestID as string | undefined,
      responseCode:
        typeof rc === "string" || typeof rc === "number" ? String(rc) : undefined,
      responseDescription: stkBody.ResponseDescription as string | undefined,
    });

    return {
      tipId,
      checkoutRequestId: stkBody.CheckoutRequestID as string | undefined,
      customerMessage:
        (stkBody.CustomerMessage as string | undefined) ||
        (ok ? "Check your phone to complete the M-Pesa payment." : "Could not start M-Pesa request."),
      status: ok ? "pending" : "failed",
    };
  },
});

export const darajaCallback = httpAction(async (ctx, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const b = body as {
    Body?: {
      stkCallback?: {
        CheckoutRequestID?: string;
        ResultCode?: number;
        ResultDesc?: string;
        CallbackMetadata?: { Item?: Array<{ Name: string; Value?: string | number }> };
      };
    };
  };

  const callback = b.Body?.stkCallback;
  const checkoutRequestId = callback?.CheckoutRequestID;
  if (!checkoutRequestId) {
    return new Response("Missing CheckoutRequestID", { status: 400 });
  }

  const items = callback.CallbackMetadata?.Item ?? [];
  const receipt = items.find((i) => i.Name === "MpesaReceiptNumber");
  const success = callback.ResultCode === 0;

  await ctx.runMutation(internal.tipsInternal.updateTipStatusFromCallback, {
    checkoutRequestId,
    status: success ? "success" : "failed",
    mpesaReceiptNumber: receipt?.Value !== undefined ? String(receipt.Value) : undefined,
    responseDescription: callback.ResultDesc,
  });

  return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
