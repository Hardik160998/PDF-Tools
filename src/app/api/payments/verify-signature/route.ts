import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import crypto from "crypto";

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

 // 4. Initialize server-side Supabase client (service role bypasses RLS)
 const supabase = createServerSupabase();

 // 5. Update user plan status (by email)
 try {
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
 } catch (err) {
 console.warn("Failed profile DB update:", err);
 }

 // 6. Update payment transaction log
 try {
 await supabase
 .from("payments")
 .update({
 razorpay_payment_id,
 razorpay_signature,
 status: "captured",
 updated_at: new Date().toISOString(),
 })
 .eq("razorpay_order_id", razorpay_order_id);
 } catch (err) {
 console.warn("Failed payment DB update:", err);
 }

 // 7. Insert subscription record
 if (userId) {
 const { error: subError } = await supabase
 .from("subscriptions")
 .insert({
 user_id: userId,
 plan_id: planName,
 status: "active",
 current_start: startDate.toISOString(),
 current_end: endDate.toISOString(),
 razorpay_subscription_id: razorpay_payment_id,
 updated_at: new Date().toISOString(),
 });
 
 if (subError) {
 console.error("Failed subscription insert DB Error:", subError);
 }
 }

 return NextResponse.json({ success: true, message: "Signature verified and subscription activated" });
 } catch (error: any) {
 console.error("Signature Verification Route Error:", error);
 return NextResponse.json({ error: error?.message || "Internal verification processing error" }, { status: 500 });
 }
}
