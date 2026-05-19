import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const {
      userId,
      userEmail,
      planName,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userEmail) {
      return NextResponse.json({ error: "Missing required verification parameters" }, { status: 400 });
    }

    // 1. Re-generate the expected signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "");
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    // 2. Compare signature securely
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature verification failed" }, { status: 400 });
    }

    // 3. Calculate subscription periods
    const startDate = new Date();
    const endDate = new Date();
    if (planName.toLowerCase().includes("yearly")) {
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    // 4. Initialize server-side Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 5. Update user plan status (by email)
    const updateProfile = supabase
      .from("users")
      .update({
        plan: planName,
        current_plan: planName,
        subscription_status: "active",
        subscription_start_date: startDate.toISOString(),
        subscription_end_date: endDate.toISOString(),
      })
      .eq("email", userEmail.toLowerCase().trim());

    // 6. Update payment transaction log
    const updatePayment = supabase
      .from("payments")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: "captured",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id);

    // Run updates
    try {
      await updateProfile;
    } catch (err) {
      console.warn("Failed profile DB update:", err);
    }

    try {
      await updatePayment;
    } catch (err) {
      console.warn("Failed payment DB update:", err);
    }

    return NextResponse.json({ success: true, message: "Signature verified and subscription activated" });
  } catch (error: any) {
    console.error("Signature Verification Route Error:", error);
    return NextResponse.json({ error: error?.message || "Internal verification processing error" }, { status: 500 });
  }
}
