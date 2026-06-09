"use client";

import { useState, useMemo, useEffect, useLayoutEffect, useRef, startTransition } from 'react';
import SkeletonGrid from '@/components/SkeletonGrid';
import { trackToolClick } from '@/lib/supabase';
import { Lock, ChevronDown, Crown, CheckCircle2, BookOpen } from 'lucide-react';
import { IconMap } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { triggerRazorpayPayment } from '@/lib/razorpay';
import { PREMIUM_TOOL_IDS } from '@/components/SubscriptionGate';
import dynamic from 'next/dynamic';

const PaymentSuccessModal = dynamic(() => import('@/components/PaymentSuccessModal'), { ssr: false });
const BlogImage = dynamic(() => import('@/components/BlogImage'), { ssr: false });
const MarketingSections = dynamic(() => import('@/components/MarketingSections'), { ssr: true });
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
        </>
    );
}

export default function HomeClient({ initialTools, initialCategories }: { initialTools?: any[], initialCategories?: any[] }) {
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
    const toolsGridRef = useRef<HTMLElement>(null);
    const [deferTools, setDeferTools] = useState(true);
    const [renderLimit, setRenderLimit] = useState(12);

    useEffect(() => {
        const timer = setTimeout(() => setDeferTools(false), 200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setRenderLimit(12);
    }, [displayCategory]);

    const { data: allTools, isLoading: toolsLoading } = useAllTools(initialTools);
    const { data: rawCategories } = useDbCategories(initialCategories);



    const dbCategories = useMemo(() => {
        if (!rawCategories) return CATEGORIES;
        const names = Array.from(new Set(rawCategories.map((c: any) => c.name)));
        return ['All', ...names.filter((c: string) => c !== 'All')];
    }, [rawCategories]);

    // Admin sync operations (run once on mount, write-only)
    // REMOVED: Database seeding shouldn't happen on the public client-side. This was causing a huge TBT hit (Lighthouse Performance).

    useEffect(() => {
        if (activeCategory === displayCategory) return;
        const t = setTimeout(() => { setDisplayCategory(activeCategory); }, 150);
        return () => clearTimeout(t);
    }, [activeCategory, displayCategory]);

    const mergedTools = useMemo(() => {
        const source = allTools && allTools.length > 0 ? allTools : null;
        if (!source) {
            return [];
        }
        return source
            .filter(t => t.is_verified)
            .map(t => {
                const iconName = t.icon || TOOL_ICONS[t.tool_key] || 'FileText';
                const IconComponent = IconMap[iconName] || IconMap['FileText'];
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

    const showGridSkeleton = !initialTools;

    const skeletonCount = 36;
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
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md z-10">
                            <Lock size={8} /> Pro
                        </div>
                    )}
                    <div className={`tool-icon-wrapper shadow-xl ${style.shadow}`} style={{ background: style.gradient }}>
                        {tool.icon && <tool.icon size={28} />}
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{tool.title}</h3>
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
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">{tool.title}</h3>
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
        <>
            {/* Category Filter */}
            <div id="tools-grid" className="mt-8 fade-in-up flex justify-center">
                    <div className="hidden md:flex justify-center w-full">
                        <div className="category-nav">
                            {dbCategories.map(cat => (
                                <button key={cat} onClick={() => startTransition(() => setActiveCategory(cat))} className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:hidden w-full px-4 relative z-50">
                        {isMobileMenuOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setIsMobileMenuOpen(false)} />}
                        <button
                            onClick={() => startTransition(() => setIsMobileMenuOpen(!isMobileMenuOpen))}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg focus:outline-none transition-all active:scale-[0.98]"
                        >
                            <span className="text-sm font-medium uppercase tracking-widest text-slate-900 dark:text-white">{activeCategory}</span>
                            <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isMobileMenuOpen && (
                            <div className="absolute top-full left-4 right-4 mt-2 py-2 glass-dropdown mobile-dropdown-shadow rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-[60]">
                                {dbCategories.map(cat => (
                                    <button key={cat} onClick={() => startTransition(() => { setActiveCategory(cat); setIsMobileMenuOpen(false); })}
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
                    <div className="animate-fade-in space-y-8">
                        {displayCategory === 'All' && (
                            <div>
                                <div className="mb-6 flex items-center justify-center gap-4">
                                    <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Most Used Tools</h3>
                                    <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-3">
                                            <Sh className="w-10 h-10 rounded-lg shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <Sh className="h-4 w-3/4 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            {displayCategory === 'All' && (
                                <div className="mb-8 flex items-center justify-center gap-4">
                                    <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">All PDF Tools</h3>
                                    <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                                </div>
                            )}
                            <SkeletonGrid count={skeletonCount} categories={skeletonCategories} />
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in space-y-8">

                        {/* Most Used Tools Section (Only visible when All is selected) */}
                        {displayCategory === 'All' && mergedTools.some(t => t.is_most_used) && (
                            <div>
                                <div className="mb-6 flex items-center justify-center gap-4">
                                    <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Most Used Tools</h3>
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
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">All PDF Tools</h3>
                                    <div className="h-[2px] bg-slate-200 dark:bg-slate-700/80 w-12 rounded-full"></div>
                                </div>
                            )}
                            {deferTools ? (
                                <SkeletonGrid count={8} categories={[]} />
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredTools.slice(0, renderLimit).map(renderToolCard)}
                                    </div>
                                    {renderLimit < filteredTools.length && (
                                        <div className="mt-8 flex justify-center">
                                            <button 
                                                onClick={() => setRenderLimit(100)}
                                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95"
                                            >
                                                Show All {filteredTools.length} PDF Tools
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                )}
            </section>

            <MarketingSections
                activePlan={activePlan}
                handleCheckout={handleCheckout}
                setActiveCategory={setActiveCategory}
                toolsGridRef={toolsGridRef as any}
            />

            <PaymentSuccessModal
                isOpen={successModalOpen}
                onClose={handleSuccessModalClose}
                planName={successModalData.planName}
                paymentId={successModalData.paymentId}
            />
        </div>
    );
}


