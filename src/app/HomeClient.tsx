"use client";

import { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import SkeletonGrid from '@/components/SkeletonGrid';
import BlogImage from '@/components/BlogImage';
import { trackToolClick, insertAvifTools, insertMeeshoTool, insertEcommerceCategory } from '@/lib/supabase';
import { Lock, Sparkles, ChevronDown, Crown, CheckCircle2, BookOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { triggerRazorpayPayment } from '@/lib/razorpay';
import { PREMIUM_TOOL_IDS } from '@/components/SubscriptionGate';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { useAllTools, useDbCategories } from '@/hooks/useTools';
import { CATEGORY_ORDER } from '@/data/tools';
import { TOOL_META_MAP } from '@/data/toolData';
import { TOOL_ICONS } from '@/data/toolIcons';

const CATEGORIES = ['All', 'Organize', 'Optimize', 'Convert', 'Image Convert', 'Edit', 'Security', 'Special', 'Ecommerce', 'Sign'];

const CATEGORY_STYLES: Record<string, { gradient: string; shadow: string }> = {
  Organize: { gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'shadow-orange-500/20' },
  Optimize: { gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'shadow-green-500/20' },
  Convert: { gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'shadow-blue-500/20' },
  Edit: { gradient: 'linear-gradient(135deg, #E8465D, #843286)', shadow: 'shadow-pink-500/20' },
  Security: { gradient: 'linear-gradient(135deg, #e53e3e, #7f1d1d)', shadow: 'shadow-red-500/20' },
  'Image Convert': { gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)', shadow: 'shadow-cyan-500/20' },
  Special: { gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'shadow-red-600/20' },
  Sign: { gradient: 'linear-gradient(135deg, #8b5cf6, #5b21b6)', shadow: 'shadow-purple-500/20' },
  Ecommerce: { gradient: 'linear-gradient(135deg, #f26522, #f59e0b)', shadow: 'shadow-orange-400/20' },
};



/* -- Reusable shimmer bar -- */
function Sh({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}

/* -- Feature section shimmer (text + mock card) -- */
function FeatureSectionShimmer({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 max-w-6xl mx-auto`}>
      <div className="flex-1 space-y-4 w-full">
        <Sh className="h-10 w-3/4" />
        <Sh className="h-10 w-1/2" />
        <Sh className="h-4 w-full" />
        <Sh className="h-4 w-5/6" />
        <Sh className="h-4 w-2/3" />
        <Sh className="h-9 w-36 rounded-full" />
      </div>
      <div className="flex-1 w-full">
        <Sh className="w-full h-56 rounded-2xl" />
      </div>
    </div>
  );
}

export default function HomeClient() {
  const { user, profile, refreshProfile, updateProfilePlan } = useAuth();
  const router = useRouter();
  const userPlan = profile?.current_plan || profile?.plan || "Basic Plan";
  const isPremium = userPlan.toLowerCase().includes("pro") || userPlan.toLowerCase().includes("premium");
  const activePlan = user ? userPlan : null;

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState({ planName: "", paymentId: "" });

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    router.push("/profile");
  };

  const handleCheckout = async (plan: "yearly" | "monthly") => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/premium-plans?plan=${plan}`)}`);
      return;
    }
    const isYearly = plan === "yearly";
    const amountINR = isYearly ? 1699 : 399;
    const planName = isYearly ? "Yearly Pro" : "Monthly Pro";

    await triggerRazorpayPayment({
      userId: user.id,
      planName,
      amountINR,
      userEmail: user.email || "",
      userName: profile?.full_name || user.user_metadata?.full_name || "SmartPDFs Customer",
      onSuccess: async (paymentId) => {
        updateProfilePlan(planName);
        await refreshProfile();
        setSuccessModalData({ planName, paymentId });
        setSuccessModalOpen(true);
      }
    });
  };

  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [displayCategory, setDisplayCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  const toolsGridRef = useRef<HTMLElement>(null);

  const { data: allTools, isLoading: toolsLoading } = useAllTools();
  const { data: rawCategories } = useDbCategories();

  const [cachedToolsExist] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem('REACT_QUERY_CACHE');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const queries: unknown[] = parsed?.clientState?.queries ?? [];
      return queries.some(
        (q) => {
          const query = q as { queryKey?: unknown[]; state?: { data?: unknown[] } };
          return Array.isArray(query.queryKey) &&
            query.queryKey[0] === 'tools' &&
            Array.isArray(query.state?.data) &&
            query.state.data.length > 0;
        }
      );
    } catch {
      return false;
    }
  });

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const dbCategories = useMemo(() => {
    if (!rawCategories) return CATEGORIES;
    const names = Array.from(new Set(rawCategories.map((c: any) => c.name)));
    return ['All', ...names.filter((c: string) => c !== 'All')];
  }, [rawCategories]);

  // Admin sync operations (run once on mount, write-only)
  useEffect(() => {
    insertAvifTools().catch(() => { });
    insertMeeshoTool().catch(() => { });
    insertEcommerceCategory().catch(() => { });
  }, []);

  useEffect(() => {
    if (!mounted || activeCategory === displayCategory) return;
    const t = setTimeout(() => { setDisplayCategory(activeCategory); }, 150);
    return () => clearTimeout(t);
  }, [activeCategory, displayCategory, mounted]);

  const mergedTools = useMemo(() => {
    const source = allTools && allTools.length > 0 ? allTools : null;
    if (!source) {
      return [];
    }
    return source
      .filter(t => t.is_verified)
      .map(t => {
        const iconName = t.icon || TOOL_ICONS[t.tool_key] || 'FileText';
        const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
        return {
          id: t.tool_key,
          title: t.title || t.tool_key,
          category: t.category,
          description: t.description || TOOL_META_MAP[t.tool_key]?.description || 'Easy and secure PDF tool.',
          icon: IconComponent,
          img_convert: t.img_convert,
          is_most_used: t.is_most_used,
        };
      });
  }, [allTools]);

  const filteredTools = useMemo(() => {
    const tools = mergedTools.filter(t => {
      if (displayCategory === 'All') return true;
      if (displayCategory === 'Image Convert') return t.img_convert;
      return t.category === displayCategory;
    });
    if (displayCategory === 'All') {
      tools.sort((a, b) => {
        const indexA = dbCategories.indexOf(a.category);
        const indexB = dbCategories.indexOf(b.category);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
    }
    return tools;
  }, [displayCategory, mergedTools, dbCategories]);

  const showGridSkeleton = !mounted || (!cachedToolsExist && toolsLoading && !allTools);

  const skeletonCount = 8;
  const skeletonCategories = useMemo(() => {
    const cat = activeCategory;
    if (cat === 'All') return mergedTools.slice(0, skeletonCount).map(t => t.category);
    return Array.from({ length: skeletonCount }, () => cat);
  }, [activeCategory, mergedTools]);

  const renderToolCard = (tool: any) => {
    const style = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.Special;
    const isPremiumTool = PREMIUM_TOOL_IDS.includes(tool.id);
    const isLocked = isPremiumTool && !isPremium;
    return (
      <div key={tool.id} className="tool-card-border" style={{ '--cat-gradient': style.gradient } as React.CSSProperties}>
        <Link
          href={tool.id === 'esign' ? '/esign' : tool.id === 'edit-pdf' ? '/edit' : `/tool/${tool.id}`}
          className={`tool-card relative ${isLocked ? 'grayscale-[30%] opacity-90' : ''}`}
          onClick={() => trackToolClick(tool.id)}
        >
          {isLocked && (
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md z-10">
              <Lock size={8} /> Pro
            </div>
          )}
          <div className="relative">
            <div className={`tool-icon-wrapper shadow-xl ${style.shadow}`} style={{ background: style.gradient }}>
              {tool.icon && <tool.icon size={28} />}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-outfit text-lg font-black text-slate-900 dark:text-white tracking-tight">{tool.title}</h3>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug line-clamp-2" title={tool.description}>{tool.description}</p>
          </div>
        </Link>
      </div>
    );
  };

  const renderSmallToolCard = (tool: any) => {
    const style = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.Special;
    const isPremiumTool = PREMIUM_TOOL_IDS.includes(tool.id);
    const isLocked = isPremiumTool && !isPremium;
    return (
      <Link
        key={tool.id}
        href={tool.id === 'esign' ? '/esign' : tool.id === 'edit-pdf' ? '/edit' : `/tool/${tool.id}`}
        className={`bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700/80 transition-all hover:-translate-y-1 flex items-center gap-3 ${isLocked ? 'grayscale-[30%] opacity-90' : ''}`}
        onClick={() => trackToolClick(tool.id)}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md shrink-0 ${style.shadow}`} style={{ background: style.gradient }}>
          {tool.icon && <tool.icon size={18} />}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-outfit text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">{tool.title}</h3>
        </div>
        {isLocked && (
          <div className="shrink-0 text-amber-500">
            <Lock size={12} />
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-mesh-premium" />

      {/* -- HERO -- */}
      <section className="container mx-auto px-4 pt-24 pb-8 text-center relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium uppercase tracking-widest shadow-sm fade-in-up mb-4">
            <Sparkles size={14} className="fill-red-500" />
            100% Free &amp; Secure PDF Tools
          </div>
          <h2 className="font-outfit text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter fade-in-up stagger-1">
            <span className="hero-gradient-text">PDF Tools Simplified.</span>{' '}
            <span className="text-slate-900 dark:text-white">Built for Efficiency.</span>
          </h2>
          <p className="text-xl font-medium text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
            The most powerful web-based PDF platform. Merge, split, compress, and convert documents in seconds with advanced security and premium speed.
          </p>
        </div>

        {/* Category Filter */}
        <div id="tools-grid" className="mt-16 fade-in-up stagger-3 flex justify-center">
          <div className="hidden md:flex justify-center w-full">
            <div className="category-nav">
              {dbCategories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden w-full px-4 relative z-50">
            {isMobileMenuOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setIsMobileMenuOpen(false)} />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg focus:outline-none transition-all active:scale-[0.98]"
            >
              <span className="text-sm font-medium uppercase tracking-widest text-slate-900 dark:text-white">{activeCategory}</span>
              <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMobileMenuOpen && (
              <div className="absolute top-full left-4 right-4 mt-2 py-2 glass-dropdown mobile-dropdown-shadow rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-[60]">
                {dbCategories.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* -- TOOLS GRID -- */}
      <section ref={toolsGridRef} className="container mx-auto px-4 pb-10">

        {showGridSkeleton ? (
          <SkeletonGrid count={skeletonCount} categories={skeletonCategories} />
        ) : (
          <div className="animate-fade-in space-y-8">

            {/* Most Used Tools Section (Only visible when All is selected) */}
            {displayCategory === 'All' && mergedTools.some(t => t.is_most_used) && (
              <div>
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                  <h3 className="font-outfit text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Most Used Tools</h3>
                  <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {mergedTools.filter(t => t.is_most_used).map(renderSmallToolCard)}
                </div>
              </div>
            )}

            {/* All Tools Section */}
            <div>
              {displayCategory === 'All' && mergedTools.some(t => t.is_most_used) && (
                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                  <h3 className="font-outfit text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">All PDF Tools</h3>
                  <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map(renderToolCard)}
              </div>
            </div>

          </div>
        )}
      </section>

      {/* -- PREMIUM TOOL PLANS -- */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 text-xs font-medium uppercase tracking-widest shadow-sm mb-6">
              <Crown size={14} className="fill-amber-500/20" />
              Pricing Plans
            </div>
            <h2 className="font-outfit text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
              Premium Tool <span className="text-red-500">Plans</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Unlock advanced features, higher file size limits, and priority browser processing. Choose the plan that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className={`bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 ${activePlan === "Basic Plan"
              ? "border-2 border-amber-400 ring-1 ring-amber-400/20"
              : "border border-slate-100 dark:border-slate-700/80"
              }`}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-outfit text-xl font-black text-slate-800 dark:text-white">Basic Plan</h3>
                  <p className="text-sm text-slate-400 mt-1">Perfect to get started</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-800 dark:text-white">$0</span>
                  <span className="text-sm font-semibold text-slate-400">/ forever</span>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/60" />
                <ul className="space-y-4">
                  {[
                    "Access to basic PDF tools",
                    "Files up to 50MB limits",
                    "Standard local browser speed",
                    "Ad-supported interface",
                    "No credit card required"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                {activePlan === "Basic Plan" ? (
                  <div className="block w-full py-3 px-6 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 rounded-xl">
                    Active Plan
                  </div>
                ) : activePlan ? (
                  // Hide button for Basic Plan if user is logged in under any paid plan
                  null
                ) : (
                  <Link
                    href="/signup"
                    className="block w-full py-3 px-6 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 rounded-xl transition-all"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>

            {/* Yearly Pro Plan (Featured) */}
            <div className={`relative bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 scale-105 z-10 ${activePlan === "Yearly Pro" || (!activePlan && true)
              ? "border-2 border-amber-400 ring-1 ring-amber-400/20"
              : "border border-slate-100 dark:border-slate-700/80"
              }`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <Crown size={12} className="fill-slate-900" /> Best Value
              </div>
              <div className="space-y-6">
                <div className="pt-2">
                  <h3 className="font-outfit text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    Yearly Pro
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Annual subscription. Best value.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-amber-500 dark:text-amber-400">$19.99</span>
                  <span className="text-sm font-semibold text-slate-400">/ year</span>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/60" />
                <ul className="space-y-4">
                  {[
                    "All premium tools unlocked",
                    "All Ecommerce Label Croppers",
                    "Batch file processing (No caps)",
                    "Files up to 1GB size support",
                    "High-speed browser processing",
                    "100% clean, Ad-free workspace",
                    "Yearly updates & VIP support"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                {activePlan === "Yearly Pro" ? (
                  <div className="block w-full py-3 px-6 text-center text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/35 rounded-xl uppercase tracking-wider">
                    Active Plan
                  </div>
                ) : activePlan === "Monthly Pro" ? (
                  // Hide button for Yearly Pro if user is logged in under Monthly Pro plan
                  null
                ) : (
                  <button
                    onClick={() => handleCheckout("yearly")}
                    className="block w-full py-3 px-6 text-center text-xs font-black text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/20 uppercase tracking-wider animate-pulse hover:animate-none cursor-pointer"
                    style={{ animationDuration: '3s' }}
                  >
                    Unlock Yearly Pro
                  </button>
                )}
              </div>
            </div>

            {/* Monthly Pro Plan */}
            <div className={`bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 ${activePlan === "Monthly Pro"
              ? "border-2 border-amber-400 ring-1 ring-amber-400/20"
              : "border border-slate-100 dark:border-slate-700/80"
              }`}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-outfit text-xl font-black text-slate-800 dark:text-white">Monthly Pro</h3>
                  <p className="text-sm text-slate-400 mt-1">Flexible subscription</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-800 dark:text-white">$4.99</span>
                  <span className="text-sm font-semibold text-slate-400">/ month</span>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/60" />
                <ul className="space-y-4">
                  {[
                    "Access to all tools & croppers",
                    "All Ecommerce Label Croppers",
                    "Files up to 500MB limits",
                    "High-speed browser processing",
                    "Ad-free workspace",
                    "Priority support"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                {activePlan === "Monthly Pro" ? (
                  <div className="block w-full py-3 px-6 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 rounded-xl">
                    Active Plan
                  </div>
                ) : activePlan === "Yearly Pro" ? (
                  // Hide button for Monthly Pro if user is logged in under Yearly Pro plan
                  null
                ) : (
                  <button
                    onClick={() => handleCheckout("monthly")}
                    className="block w-full py-3.5 px-6 text-center text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25 dark:shadow-none uppercase tracking-wider hover:scale-[1.02] cursor-pointer"
                  >
                    Subscribe Monthly
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- TAGLINE -- */}
      {!mounted ? (
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center gap-4">
            <Sh className="h-12 w-3/4" />
            <Sh className="h-12 w-1/2" />
            <Sh className="h-5 w-2/3 mt-2" />
            <Sh className="h-5 w-1/2" />
          </div>
        </section>
      ) : (
        <section className="py-20 text-center bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-outfit text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
              Keep Your Simple Tasks Simple
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              The first and only PDF software you&apos;ll love. We have all the tools you&apos;ll need to start, manage, and finish your work with digital documents.
            </p>
          </div>
        </section>
      )}

      {/* -- CREATE THE PERFECT DOCUMENT -- */}
      {!mounted ? (
        <section className="py-20 bg-slate-50 dark:bg-slate-800/40">
          <div className="container mx-auto px-4">
            <FeatureSectionShimmer />
          </div>
        </section>
      ) : (
        <section className="py-20 bg-slate-50 dark:bg-slate-800/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
              <div className="flex-1 space-y-6">
                <h2 className="font-outfit text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                  Create the Perfect Document
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  File too big? Compress it. Need a specific format? Convert it. Things getting chaotic? Merge and split files, or remove excess pages. We have it all.
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); toolsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-base hover:gap-3 transition-all cursor-pointer"
                >
                  View all PDF tools &#8594;
                </button>
              </div>
              <div className="flex flex-1 justify-center relative mt-12 md:mt-0">
                <div className="relative w-[80%] max-w-lg md:w-full">
                  <div className="relative">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 relative z-10 transform rotate-[-2deg]">
                      <div className="space-y-2 mb-6">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${100 - i * 8}%` }} />)}
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg shadow-lg">PDF</span>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-2 md:-top-6 md:-right-6 bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xl font-medium text-xs md:text-sm z-20 transform rotate-12 animate-bounce" style={{ animationDuration: '3s' }}>DOC</div>
                    <div className="absolute top-1/3 -left-4 md:-left-8 bg-orange-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xl font-medium text-xs md:text-sm z-20 transform -rotate-12">PPT</div>
                    <div className="absolute bottom-6 -right-2 md:bottom-8 md:-right-4 bg-green-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xl font-medium text-xs md:text-sm z-20 transform rotate-6">XLS</div>
                    <div className="absolute -bottom-6 md:-bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-30">
                      {[{ label: 'PDF', bg: '#ef4444' }, { label: 'DOC', bg: '#8b5cf6' }, { label: 'XLS', bg: '#f59e0b' }, { label: 'PPT', bg: '#3b82f6' }].map((item, i) => (
                        <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-2xl flex items-center justify-center text-[9px] md:text-[10px] font-medium text-white transform hover:scale-110 transition-transform" style={{ backgroundColor: item.bg }}>{item.label}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* -- DIGITAL SIGNATURES -- */}
      {!mounted ? (
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <FeatureSectionShimmer reverse />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl mx-auto">
              <div className="flex-1 space-y-5">
                <h2 className="font-outfit text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Digital Signatures Made Easy</h2>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Fill in forms, e-sign contracts, and close deals in a few simple steps. You can also request e-signatures and track your document every step of the way.
                </p>
                <a href="/tool/esign" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-base hover:gap-3 transition-all">Try eSign &#8594;</a>
              </div>
              <div className="hidden md:flex flex-1 justify-center">
                <div className="relative w-full max-w-md">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="ml-2 text-xs text-slate-400 font-medium">eSign &mdash; Document.pdf</span>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${90 - i * 10}%` }} />)}
                    </div>
                    <div className="mt-6 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-4 text-center">
                      <p className="text-2xl font-medium text-slate-400" style={{ fontFamily: 'cursive' }}>esign</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">✍ Signature</span>
                      <span className="text-xs font-medium bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">AB Initials</span>
                    </div>
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-xl">Review &amp; Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* -- WORK DIRECTLY ON YOUR FILES -- */}
      {!mounted ? (
        <section className="py-16 bg-slate-50 dark:bg-slate-800/40">
          <div className="container mx-auto px-4">
            <FeatureSectionShimmer />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-slate-50 dark:bg-slate-800/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
              <div className="flex-1 space-y-5">
                <h2 className="font-outfit text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Work Directly on Your Files</h2>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Do more than just view PDFs. Highlight and add text, freehand annotations, and more — all processed locally in your browser. Zero uploads, 100% private.
                </p>
                <a href="/tool/edit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm uppercase tracking-widest shadow-lg transition-all hover:scale-105 hover:shadow-xl" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
                  Open &amp; Edit a PDF &#8594;
                </a>
              </div>
              <div className="hidden md:flex flex-1 justify-center">
                <div className="relative w-full max-w-md">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="ml-2 text-xs text-slate-400 font-medium">Edit &mdash; Document.pdf</span>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${95 - i * 8}%` }} />)}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="border-2 border-blue-400 rounded-lg px-3 py-1.5">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Hello!</p>
                      </div>
                      <div className="h-6 w-16 rounded" style={{ background: 'rgba(251,191,36,0.35)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* -- LATEST BLOG POSTS -- */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium uppercase tracking-widest shadow-sm mb-6">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              Latest from Blog
            </div>
            <h2 className="font-outfit text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
              Helpful Guides &<br />
              <span className="text-red-500">PDF Tutorials</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Learn how to get the most out of your PDFs with our latest tips, guides, and step-by-step tutorials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {/* Blog Post 1: Aadhar Card */}
            <a href="/blog/how-to-crop-aadhar-card" className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full">
              <div className="relative overflow-hidden">
                <BlogImage src="/img/crop-aadhar-card.png" alt="Crop Aadhar Card" className="group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center z-10">
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-red-500 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center">
                    <BookOpen size={20} className="stroke-[2.5]" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white text-red-600 border-2 border-red-500 shadow-sm">
                    Special
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 8v4M8 12h4" />
                    </svg>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                    How to Crop Aadhar Card for Printing — Free Online Tool
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Crop your e-Aadhar PDF to standard ID card dimensions (86mm × 54mm) and get a print-ready A4 PDF in seconds — 100% private, runs in your browser.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      3 min read
                    </span>
                    <span>Apr 8, 2026</span>
                  </div>
                  <span className="text-xs font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Blog Post 2: Convert PDF */}
            <a href="/blog/pdf-to-word-conversion-guide" className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full">
              <div className="relative overflow-hidden">
                <BlogImage src="/img/convert-pdf-all-tool.png" alt="Convert PDF All Tools" className="group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center z-10">
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-red-500 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center">
                    <BookOpen size={20} className="stroke-[2.5]" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white text-red-600 border-2 border-red-500 shadow-sm">
                    Convert
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    Convert PDF All Tools: Complete Guide for 2026
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Master all PDF conversion tools in one comprehensive guide. Learn how to convert PDFs to Word, Excel, PowerPoint, JPG, and more with professional tips and best practices.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      5 min read
                    </span>
                    <span>Apr 15, 2026</span>
                  </div>
                  <span className="text-xs font-bold text-blue-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* View All Blog Posts Button */}
          <div className="text-center">
            <a href="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:bg-slate-700 dark:hover:bg-slate-100">
              View All Blog Posts
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* -- WHY CHOOSE SMART PDFs? -- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="block font-outfit text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter text-center mb-6 md:mb-16">
            Why Choose Smart PDFs?
          </h2>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* People Trust Us */}
            <div className="why-card-blue flex flex-col gap-4 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <circle cx="24" cy="20" r="10" fill="white" fillOpacity="0.9" />
                  <circle cx="40" cy="18" r="8" fill="white" fillOpacity="0.6" />
                  <ellipse cx="24" cy="46" rx="16" ry="10" fill="white" fillOpacity="0.9" />
                  <ellipse cx="40" cy="44" rx="13" ry="8" fill="white" fillOpacity="0.6" />
                </svg>
                <span className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md shadow">1M+</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">People Trust Us</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Millions of users rely on Smart PDFs every day to simplify their work with digital documents — fast, free, and fully private.
              </p>
            </div>

            {/* Top-Rated */}
            <div className="why-card-yellow flex flex-col gap-4 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="36" width="10" height="20" rx="2" fill="white" fillOpacity="0.7" />
                  <rect x="22" y="24" width="10" height="32" rx="2" fill="white" fillOpacity="0.85" />
                  <rect x="36" y="14" width="10" height="42" rx="2" fill="white" />
                  <path d="M8 34 L22 22 L36 12 L50 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M46 8 L52 8 L52 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900">Top-Rated PDF Tools</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart PDFs is consistently rated among the best free PDF platforms for speed, reliability, and ease of use by our growing community.
              </p>
            </div>

            {/* Works Everywhere */}
            <div className="why-card-green flex flex-col gap-4 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}>
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <rect x="6" y="10" width="52" height="36" rx="6" fill="white" fillOpacity="0.3" />
                  <rect x="10" y="14" width="44" height="28" rx="3" fill="white" fillOpacity="0.6" />
                  <rect x="22" y="46" width="20" height="4" rx="2" fill="white" fillOpacity="0.8" />
                  <rect x="16" y="50" width="32" height="3" rx="1.5" fill="white" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Works on Any Device</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fully responsive on desktop, tablet, and mobile. No app or installation needed — just open your browser and get to work.
              </p>
            </div>

            {/* 24/7 Available */}
            <div className="why-card-indigo flex flex-col gap-4 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="12" width="30" height="36" rx="4" fill="white" fillOpacity="0.4" />
                  <rect x="12" y="16" width="22" height="4" rx="2" fill="white" fillOpacity="0.8" />
                  <rect x="12" y="24" width="16" height="3" rx="1.5" fill="white" fillOpacity="0.7" />
                  <rect x="12" y="30" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.7" />
                  <circle cx="44" cy="44" r="14" fill="white" fillOpacity="0.25" />
                  <text x="44" y="49" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">24/7</text>
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900">Always Available</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart PDFs is available around the clock. Process your documents any time, any day — no downtime, no waiting.
              </p>
            </div>

            {/* 256-bit Encryption */}
            <div className="why-card-purple flex flex-col gap-4 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <rect x="14" y="8" width="36" height="28" rx="5" fill="white" fillOpacity="0.3" />
                  <rect x="20" y="14" width="24" height="16" rx="3" fill="white" fillOpacity="0.5" />
                  <rect x="10" y="32" width="44" height="24" rx="5" fill="white" fillOpacity="0.25" />
                  <circle cx="32" cy="44" r="5" fill="white" fillOpacity="0.9" />
                  <rect x="30" y="44" width="4" height="6" rx="1" fill="white" fillOpacity="0.4" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[9px] font-medium text-slate-900 px-1.5 py-0.5 rounded shadow">256-bit</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">256-Bit TLS Encryption</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We use 256-bit TLS encryption to keep your data safe during transfer. Your files are processed securely and never stored on our servers.
              </p>
            </div>

            {/* Privacy First */}
            <div className="why-card-red flex flex-col gap-4 rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f43f5e, #be123c)' }}>
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <path d="M32 14 L44 20 L44 34 C44 42 32 50 32 50 C32 50 20 42 20 34 L20 20 Z" fill="white" fillOpacity="0.35" />
                  <path d="M32 18 L41 23 L41 34 C41 40 32 47 32 47 C32 47 23 40 23 34 L23 23 Z" fill="white" fillOpacity="0.6" />
                  <path d="M27 32 L30 35 L37 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900">Privacy First</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your safety is our priority. All PDF processing happens locally in your browser — your files never leave your device. Zero uploads, 100% private.
              </p>
            </div>

          </div>
        </div>
      </section>

      <PaymentSuccessModal
        isOpen={successModalOpen}
        onClose={handleSuccessModalClose}
        planName={successModalData.planName}
        paymentId={successModalData.paymentId}
      />
    </div>
  );
}


