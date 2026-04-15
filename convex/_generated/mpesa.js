import { action } from "./_generated/server";

export const initiateTip = action({
  args: { 
    phoneNumber: process.env.VITE_CONVEX_URL ? "string" : "any", // expects format: 2547XXXXXXXX
    amount: process.env.VITE_CONVEX_URL ? "number" : "any"
  },
  handler: async (ctx, args) => {
    const consumerKey = process.env.DARAJA_CONSUMER_KEY;
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
    const passkey = process.env.DARAJA_PASSKEY;
    const shortCode = "174379"; // Safaricom Sandbox Test Till

    // 1. Generate Timestamp
    const date = new Date();
    const timestamp = date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    // 2. Generate Password
    const password = btoa(`${shortCode}${passkey}${timestamp}`);

    // 3. Get OAuth Token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenResponse = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` }
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 4. Send the STK Push Request
    const stkResponse = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: args.amount,
        PartyA: args.phoneNumber,
        PartyB: shortCode,
        PhoneNumber: args.phoneNumber,
        CallBackURL: "https://mydomain.com/path", // We will set up a Convex HTTP callback later
        AccountReference: "Cookwise Tip",
        TransactionDesc: "Tipping Recipe Creator"
      })
    });

    const stkData = await stkResponse.json();
    return stkData; // Returns the CheckoutRequestID to the frontend
  },
});