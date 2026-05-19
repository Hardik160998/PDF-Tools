import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    // 1. Verify Webhook authenticity
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "supersecurewebhooksecret123";
    const hmac = crypto.createHmac("sha256", webhookSecret);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Webhook validation failed. Expected:", expectedSignature, "Received:", signature);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const eventData = JSON.parse(rawBody);
    const eventType = eventData.event;
    const paymentEntity = eventData.payload.payment?.entity;

    if (!paymentEntity) {
      return NextResponse.json({ success: true, message: "No payment entity, ignored event" });
    }

    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    // Notes parameters sent during order creation
    const userEmail = paymentEntity.notes?.userEmail;
    const planName = paymentEntity.notes?.planName;
    const userId = paymentEntity.notes?.userId;

    // 2. Initialize server-side Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (eventType === "payment.captured") {
      // Log payment capture
      try {
        await supabase
          .from("payments")
          .update({
            status: "captured",
            razorpay_payment_id: paymentId,
            updated_at: new Date().toISOString()
          })
          .eq("razorpay_order_id", orderId);
      } catch (dbErr) {
        console.warn("Webhook: failed to update payment captures in DB:", dbErr);
      }

      // Upgrade profile if not already done
      if (userEmail) {
        try {
          const startDate = new Date();
          const endDate = new Date();
          if (planName?.toLowerCase().includes("yearly")) {
            endDate.setFullYear(startDate.getFullYear() + 1);
          } else {
            endDate.setMonth(startDate.getMonth() + 1);
          }

          await supabase
            .from("users")
            .update({
              plan: planName,
              current_plan: planName,
              subscription_status: "active",
              subscription_start_date: startDate.toISOString(),
              subscription_end_date: endDate.toISOString(),
            })
            .eq("email", userEmail.toLowerCase().trim());
        } catch (dbErr) {
          console.warn("Webhook: failed to update user profile in DB:", dbErr);
        }
      }
    }
    else if (eventType === "payment.failed") {
      try {
        await supabase
          .from("payments")
          .update({
            status: "failed",
            error_code: paymentEntity.error_code || "UNKNOWN",
            error_description: paymentEntity.error_description || "Payment failed",
            updated_at: new Date().toISOString()
          })
          .eq("razorpay_order_id", orderId);
      } catch (dbErr) {
        console.warn("Webhook: failed to update payment failure in DB:", dbErr);
      }
    }

    // Acknowledge receipt to Razorpay
    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error?.message || "Webhook processing error" }, { status: 500 });
  }
}
