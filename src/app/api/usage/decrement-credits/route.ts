import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
 try {
 const authHeader = request.headers.get("Authorization");
 if (!authHeader || !authHeader.startsWith("Bearer ")) {
 return NextResponse.json({ error: "Unauthorized access token missing" }, { status: 401 });
 }

 const token = authHeader.split(" ")[1];
 const supabase = createClient(supabaseUrl, supabaseAnonKey);
 
 let email = "";
 if (token.includes("@")) {
 email = token.toLowerCase().trim();
 } else {
 const { data: { user }, error: authError } = await supabase.auth.getUser(token);
 if (authError || !user || !user.email) {
 return NextResponse.json({ error: "Invalid auth session" }, { status: 401 });
 }
 email = user.email.toLowerCase().trim();
 }

 // Fetch user details
 const { data: profile, error: dbError } = await supabase
 .from("users")
 .select("plan, current_plan, ecommerce_credits")
 .eq("email", email)
 .maybeSingle();

 if (dbError || !profile) {
 return NextResponse.json({ error: "User profile not found" }, { status: 404 });
 }

 const userPlan = profile.current_plan || profile.plan || "Basic Plan";
 const isPremium = userPlan.toLowerCase().includes("pro") || userPlan.toLowerCase().includes("premium");

 if (isPremium) {
 return NextResponse.json({ allowed: true, unlimited: true, ecommerce_credits: 9999 });
 }

 const currentCredits = profile.ecommerce_credits !== null && profile.ecommerce_credits !== undefined 
 ? profile.ecommerce_credits 
 : 10;

 if (currentCredits <= 0) {
 return NextResponse.json({
 allowed: false,
 ecommerce_credits: 0,
 error: "You have 0 credits left for eCommerce tools. Upgrade to Pro for unlimited cropping!"
 }, { status: 403 });
 }

 // Decrement credits
 const newCredits = currentCredits - 1;
 const { error: updateError } = await supabase
 .from("users")
 .update({ ecommerce_credits: newCredits })
 .eq("email", email);

 if (updateError) {
 console.error("Database update error:", updateError);
 return NextResponse.json({ error: `Database update failed: ${updateError.message}` }, { status: 500 });
 }

 return NextResponse.json({
 allowed: true,
 unlimited: false,
 ecommerce_credits: newCredits
 });

 } catch (error: any) {
 console.error("Decrement credits handler exception:", error);
 return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
 }
}
