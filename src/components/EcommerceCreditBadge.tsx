"use client";

import { useAuth } from "@/context/AuthContext";
import { Sparkles, Crown } from "lucide-react";
import Link from "next/link";

export default function EcommerceCreditBadge() {
 const { user, profile } = useAuth();

 if (!user) return null;

 const userPlan = profile?.current_plan || profile?.plan || "Basic Plan";
 const isPremium = userPlan.toLowerCase().includes("pro") || userPlan.toLowerCase().includes("premium");

 const credits = profile?.remaining_credits !== undefined && profile?.remaining_credits !== null
 ? profile.remaining_credits
 : 10;

 return (
 <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
 <div className="flex items-center gap-3">
 <div className={`p-2.5 rounded-xl ${isPremium ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-red-50 dark:bg-red-950/20 text-red-500'}`}>
 {isPremium ? <Crown size={20} className="fill-amber-500/10" /> : <Sparkles size={20} />}
 </div>
 <div className="text-left">
 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">eCommerce Label Cropper Credits</p>
 <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
 {isPremium ? (
 <span className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5">
 <span className="text-amber-500 font-bold flex items-center gap-1">
 Unlimited Credits <Crown size={14} className="fill-amber-500/25" />
 </span>
 {profile?.subscription_end_date && (
 <>
 <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
 <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
 Valid till {new Date(profile.subscription_end_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
 </span>
 </>
 )}
 </span>
 ) : (
 <span>
 Remaining: <span className="text-red-500 font-bold text-base">{credits}</span> / 10 free credits
 </span>
 )}
 </p>
 </div>
 </div>
 {!isPremium && (
 <Link
 href="/premium-plans"
 className="w-full sm:w-auto inline-flex items-center justify-center bg-[#f26522] hover:bg-[#d4541a] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all whitespace-nowrap"
 >
 Upgrade to Premium
 </Link>
 )}
 </div>
 );
}
