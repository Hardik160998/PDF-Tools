"use client";

import { useAuth } from "@/context/AuthContext";
import { Lock, Crown, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CenteredCardSkeleton } from "@/app/tool/[id]/skeletons";

const PREMIUM_TOOL_SKELETON_ACCENTS: Record<string, string> = {
 "meesho-cropper": "#f26522",
 "meshocrop": "#f26522",
 "flipkart-cropper": "#F7941D",
 "amazon-cropper": "#FF9900",
 "snapdeal-cropper": "#E40046",
 "ocr-pdf": "#3b82f6",
 "redact-pdf": "#ef4444",
 "webpage-to-pdf": "#0ea5e9",
};

// Define all eCommerce tools
export const ECOMMERCE_TOOL_IDS = [
 "meesho-cropper",
 "meshocrop",
 "flipkart-cropper",
 "amazon-cropper",
 "snapdeal-cropper"
];

// Define all premium tools by their ID
export const PREMIUM_TOOL_IDS = [
 ...ECOMMERCE_TOOL_IDS,
 "ocr-pdf",
 "redact-pdf",
 "webpage-to-pdf"
];

interface SubscriptionGateProps {
 toolId: string;
 children: React.ReactNode;
}

export default function SubscriptionGate({ toolId, children }: SubscriptionGateProps) {
 const { user, profile, loading } = useAuth();
 const pathname = usePathname();

 // If loading user state, show a clean skeleton loading indicator
 if (loading) {
 const accent = PREMIUM_TOOL_SKELETON_ACCENTS[toolId];
 if (accent) {
 return <CenteredCardSkeleton accent={accent} />;
 }
 return (
 <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
 <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-red-500 animate-spin" />
 <p className="text-sm font-semibold text-slate-400">Verifying license...</p>
 </div>
 );
 }

 const userPlan = profile?.current_plan || profile?.plan || "Basic Plan";
 const isPremium = userPlan.toLowerCase().includes("pro") || userPlan.toLowerCase().includes("premium");
 const isPremiumTool = PREMIUM_TOOL_IDS.includes(toolId);
 const isEcommerceTool = ECOMMERCE_TOOL_IDS.includes(toolId);

 // If this is a Premium tool and the user is NOT premium, check eCommerce credits or show lock screen
 if (isPremiumTool && !isPremium) {
 if (isEcommerceTool && user) {
 const credits = profile?.remaining_credits !== undefined && profile?.remaining_credits !== null
 ? profile.remaining_credits
 : 10;

 if (credits > 0) {
 return <>{children}</>;
 }

 // Credit exhausted state
 return (
 <div className="max-w-4xl mx-auto my-8 p-1 sm:p-2 bg-gradient-to-tr from-amber-500/10 via-red-500/10 to-indigo-500/10 rounded-[32px]">
 <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-[30px] border border-slate-200/50 dark:border-slate-800/80 p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
 {/* Subtle background glow */}
 <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
 <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

 {/* Locked Badge Icon */}
 <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-xl shadow-rose-500/20 mb-8 animate-bounce">
 <Lock size={32} />
 <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-red-500 text-red-500">
 <ShieldAlert size={12} />
 </div>
 </div>

 <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
 Free Credits <span className="text-red-500">Exhausted</span>
 </h2>
 
 <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed mb-8">
 You have used all 10 free credits for eCommerce tools. Upgrade to Pro for unlimited conversions, batch cropping, and ad-free priority speeds!
 </p>

 {/* Call to Actions */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Link
 href="/premium-plans"
 className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold uppercase tracking-wider px-10 py-4.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] gap-2"
 >
 <Crown size={16} className="fill-white" /> UPGRADE TO PREMIUM PLAN
 </Link>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="max-w-4xl mx-auto my-8 p-1 sm:p-2 bg-gradient-to-tr from-amber-500/10 via-red-500/10 to-indigo-500/10 rounded-[32px]">
 <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-[30px] border border-slate-200/50 dark:border-slate-800/80 p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
 {/* Subtle background glow */}
 <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
 <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

 {/* Locked Badge Icon */}
 <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xl shadow-orange-500/20 mb-8 animate-bounce">
 <Lock size={32} />
 <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-amber-500 text-amber-500">
 <Crown size={12} className="fill-amber-500/20" />
 </div>
 </div>

 <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
 Premium Tool <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Locked</span>
 </h2>
 
 <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed mb-8">
 This tool is exclusive to Premium users. Upgrade to unlock all limits, batch processing, and compile PDFs instantly with zero wait time.
 </p>

 {/* Value props list */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-10 text-left">
 {[
 "Unlimited conversions & crop actions",
 "Access all Ecommerce label croppers",
 "100% Ad-Free experience",
 "Priority server-side processing"
 ].map((prop, idx) => (
 <div key={idx} className="flex items-center gap-2.5">
 <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
 <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{prop}</span>
 </div>
 ))}
 </div>

 {/* Call to Actions */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 {!user ? (
 <>
 <Link
 href={`/login?redirect=${encodeURIComponent(pathname)}`}
 className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg transition-all"
 >
 LOG IN TO UNLOCK
 </Link>
 <Link
 href="/premium-plans"
 className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
 >
 VIEW PLANS <ArrowRight size={14} className="ml-1" />
 </Link>
 </>
 ) : (
 <Link
 href="/premium-plans"
 className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold uppercase tracking-wider px-10 py-4.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] gap-2"
 >
 <Crown size={16} className="fill-white" /> UPGRADE TO PREMIUM PLAN
 </Link>
 )}
 </div>
 </div>
 </div>
 );
 }

 // Allow rendering if user is Premium or tool is free/within credits
 return <>{children}</>;
}
