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
    
    // 1. Verify user token securely with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || !user.email) {
      return NextResponse.json({ error: "Invalid auth session" }, { status: 401 });
    }

    // 2. Fetch user profile from database
    const { data: profile, error: dbError } = await supabase
      .from("users")
      .select("plan, current_plan, daily_usage_count, last_usage_reset")
      .eq("email", user.email.toLowerCase().trim())
      .maybeSingle();

    if (dbError) {
      console.error("Database fetch error in usage handler:", dbError);
    }

    const userPlan = profile?.current_plan || profile?.plan || "Basic Plan";
    const isPremium = userPlan.toLowerCase().includes("pro") || userPlan.toLowerCase().includes("premium");

    if (isPremium) {
      return NextResponse.json({ allowed: true, unlimited: true });
    }

    // 3. Handle Basic plan limits
    const now = new Date();
    const lastReset = profile?.last_usage_reset ? new Date(profile.last_usage_reset) : new Date(0);
    const msDiff = now.getTime() - lastReset.getTime();
    const hoursDiff = msDiff / (1000 * 60 * 60);

    let currentCount = profile?.daily_usage_count || 0;

    if (hoursDiff >= 24) {
      // Reset usage window
      currentCount = 1;
      await supabase
        .from("users")
        .update({
          daily_usage_count: 1,
          last_usage_reset: now.toISOString()
        })
        .eq("email", user.email.toLowerCase().trim());
      
      return NextResponse.json({ allowed: true, count: 1, limit: 3 });
    }

    if (currentCount >= 3) {
      return NextResponse.json({
        allowed: false,
        error: "Daily free conversion limit (3 actions/day) reached. Upgrade to Pro for unlimited usage."
      }, { status: 403 });
    }

    // Increment count
    const nextCount = currentCount + 1;
    await supabase
      .from("users")
      .update({
        daily_usage_count: nextCount
      })
      .eq("email", user.email.toLowerCase().trim());

    return NextResponse.json({ allowed: true, count: nextCount, limit: 3 });

  } catch (error: any) {
    console.error("Usage limit increment handler exception:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
