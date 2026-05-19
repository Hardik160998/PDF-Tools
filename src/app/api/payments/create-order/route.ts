import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request) {
  try {
    const { userId, planName, amountINR, userEmail } = await request.json();

    if (!userId || !planName || !amountINR) {
      return NextResponse.json({ error: "Missing required parameters (userId, planName, amountINR)" }, { status: 400 });
    }

    // 1. Generate Order via Razorpay API
    const orderOptions = {
      amount: Math.round(amountINR * 100), // convert to paise (INR * 100)
      currency: "INR",
      receipt: `receipt_user_${userId.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        planName,
        userEmail: userEmail || "",
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // 2. Initialize server-side Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Resolve real user ID by email
    let resolvedUserId = userId;
    if (userEmail) {
      try {
        const { data: userRow } = await supabase
          .from("users")
          .select("id")
          .eq("email", userEmail.toLowerCase().trim())
          .single();
        if (userRow?.id) {
          resolvedUserId = userRow.id;
        }
      } catch (err) {
        console.warn("Could not resolve user ID by email in create-order:", err);
      }
    }

    // Validate UUID format of user_id to prevent Postgres type errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const dbUserId = uuidRegex.test(resolvedUserId) ? resolvedUserId : null;

    // 3. Log the pending payment in the database
    try {
      await supabase.from("payments").insert({
        user_id: dbUserId,
        razorpay_order_id: order.id,
        amount: amountINR,
        currency: "INR",
        status: "created",
      });
    } catch (dbErr) {
      console.warn("Could not insert payment row in DB:", dbErr);
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Order Creation Endpoint Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create order" }, { status: 500 });
  }
}
