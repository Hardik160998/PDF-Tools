"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import SkeletonGrid from '@/components/SkeletonGrid';
import { trackToolClick, getVerifiedToolKeys, getImgConvertTools, getCategories, insertAvifTools } from '@/lib/supabase';
import {
  Combine, Scissors, FileText, Settings, Lock,
  Stamp, Sparkles, Zap, Type, ImageIcon, Wand2,
  FileDigit, FileJson, FileSymlink, Unlock,
  Presentation, FileSpreadsheet, Globe, LifeBuoy, ChevronDown, PenLine, Layers, GitCompare, EyeOff, Bookmark
} from 'lucide-react';

const CATEGORIES = ['All', 'Organize', 'Optimize', 'Convert', 'Image Convert', 'Edit', 'Security', 'Special', 'Sign'];

const CATEGORY_STYLES: Record<string, { gradient: string; shadow: string }> = {
  Organize: { gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'shadow-orange-500/20' },
  Optimize: { gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'shadow-green-500/20' },
  Convert:  { gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'shadow-blue-500/20'  },
  Edit:     { gradient: 'linear-gradient(135deg, #E8465D, #843286)',  shadow: 'shadow-pink-500/20'  },
  Security: { gradient: 'linear-gradient(135deg, #e53e3e, #7f1d1d)', shadow: 'shadow-red-500/20'   },
  'Image Convert': { gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)', shadow: 'shadow-cyan-500/20' },
  Special:  { gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'shadow-red-600/20'   },
  Sign:     { gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', shadow: 'shadow-purple-500/20' },
};

const TOOLS = [
  { id: 'compare-pdf', title: 'Compare PDF', description: 'Compare two PDF files side by side and instantly spot which pages changed. 100% private.', category: 'Organize', icon: GitCompare },
  { id: 'extract-pages', title: 'Extract PDF Pages', description: 'Pick individual pages or a range and download them as a new PDF. 100% private, runs in your browser.', category: 'Organize', icon: Layers },
  { id: 'delete-pages', title: 'Delete PDF Pages', description: 'Select and permanently remove unwanted pages from your PDF. Fast, private, runs in your browser.', category: 'Organize', icon: Scissors },
  { id: 'organize',     title: 'Organize PDF',      description: 'Sort, add and delete PDF pages. Rotate PDF pages and reorder them at your convenience.',          category: 'Organize', icon: FileSymlink    },
  { id: 'merge',        title: 'Merge PDF',          description: 'Combine PDFs in the order you want with the easiest PDF merger available.',                       category: 'Organize', icon: Combine        },
  { id: 'split',        title: 'Split PDF',          description: 'Separate one page or a whole set for easy conversion into independent PDF files.',                category: 'Organize', icon: Scissors       },
  { id: 'compress',     title: 'Compress PDF',       description: 'Reduce file size while optimizing for maximal PDF quality.',                                      category: 'Optimize', icon: Zap            },
  { id: 'repair-pdf',   title: 'Repair PDF',         description: 'Recover data from damaged, corrupted or illegible PDF files.',                                    category: 'Optimize', icon: LifeBuoy       },
  { id: 'extract-text', title: 'PDF to Text',        description: 'Easily convert your PDF files into easy to edit text documents.',                                 category: 'Convert',  icon: Type           },
  { id: 'pdf-to-xml',   title: 'PDF to XML',         description: 'Extract structured data from your PDF into XML machine readable format.',                         category: 'Convert',  icon: FileJson       },
  { id: 'pdf-to-jpg',   title: 'PDF to JPG',         description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',                     category: 'Convert',  icon: ImageIcon      },
  { id: 'jpg-to-pdf',   title: 'JPG to PDF',         description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',                    category: 'Convert',  icon: ImageIcon      },
  { id: 'jpg-to-png',   title: 'JPG to PNG',   description: 'Convert JPG images to lossless PNG format instantly. Preserves quality and enables transparency.',  category: 'Image Convert',  icon: ImageIcon      },
  { id: 'png-to-jpg',   title: 'PNG to JPG',   description: 'Convert PNG images to JPG format for smaller file sizes and universal compatibility.',               category: 'Image Convert',  icon: ImageIcon      },
  { id: 'jpg-to-webp',  title: 'JPG to WebP',  description: 'Convert JPG images to modern WebP format for superior compression and faster web loading.',          category: 'Image Convert',  icon: ImageIcon      },
  { id: 'webp-to-jpg',  title: 'WebP to JPG',  description: 'Convert WebP images to universally compatible JPG format instantly.',                                 category: 'Image Convert',  icon: ImageIcon      },
  { id: 'png-to-webp',  title: 'PNG to WebP',  description: 'Convert PNG images to WebP for smaller file sizes without visible quality loss.',                     category: 'Image Convert',  icon: ImageIcon      },
  { id: 'webp-to-png',  title: 'WebP to PNG',  description: 'Convert WebP images to lossless PNG format for maximum compatibility and editing.',                    category: 'Image Convert',  icon: ImageIcon      },
  { id: 'jpg-to-avif',  title: 'JPG to AVIF',  description: 'Convert JPG images to next-gen AVIF format for superior compression and modern browser support.',       category: 'Image Convert',  icon: ImageIcon      },
  { id: 'avif-to-jpg',  title: 'AVIF to JPG',  description: 'Convert AVIF images to universally compatible JPG format instantly.',                                   category: 'Image Convert',  icon: ImageIcon      },
  { id: 'png-to-avif',  title: 'PNG to AVIF',  description: 'Convert PNG images to AVIF for smaller file sizes with excellent quality retention.',                    category: 'Image Convert',  icon: ImageIcon      },
  { id: 'avif-to-png',  title: 'AVIF to PNG',  description: 'Convert AVIF images to lossless PNG format for maximum compatibility.',                                  category: 'Image Convert',  icon: ImageIcon      },
  { id: 'webp-to-avif', title: 'WebP to AVIF', description: 'Convert WebP images to next-gen AVIF format for even better compression.',                               category: 'Image Convert',  icon: ImageIcon      },
  { id: 'avif-to-webp', title: 'AVIF to WebP', description: 'Convert AVIF images to WebP format for broad browser compatibility.',                                    category: 'Image Convert',  icon: ImageIcon      },
  { id: 'word-to-pdf',  title: 'Word to PDF',        description: 'Make DOC and DOCX files easy to read by converting them to PDF.',                                category: 'Convert',  icon: FileText       },
  { id: 'pdf-to-word',  title: 'PDF to Word',        description: 'Convert your PDF documents to editable DOCX files with high accuracy.',                          category: 'Convert',  icon: FileText       },
  { id: 'docx-to-pdf',  title: 'DOCX to PDF',        description: 'Convert .doc and .docx files to PDF with fonts, images, and formatting perfectly preserved.',      category: 'Convert',  icon: FileText       },
  { id: 'pdf-to-docx',  title: 'PDF to DOCX',        description: 'Convert any PDF into a fully editable DOCX file ready to edit in Word or Google Docs.',            category: 'Convert',  icon: FileText       },
  { id: 'ppt-to-pdf',   title: 'PowerPoint to PDF',  description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',                           category: 'Convert',  icon: Presentation   },
  { id: 'pdf-to-ppt',   title: 'PDF to PowerPoint',  description: 'Convert your PDF documents into editable PPTX presentations.',                                   category: 'Convert',  icon: Presentation   },
  { id: 'excel-to-pdf', title: 'Excel to PDF',       description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',                                category: 'Convert',  icon: FileSpreadsheet },
  { id: 'pdf-to-excel', title: 'PDF to Excel',       description: 'Convert your PDF documents into editable XLSX spreadsheets with table extraction.',              category: 'Convert',  icon: FileSpreadsheet },
  { id: 'html-to-pdf',  title: 'HTML to PDF',        description: 'Convert web pages or HTML files into PDF documents with high fidelity.',                         category: 'Convert',  icon: Globe          },
  { id: 'webpage-to-pdf', title: 'Webpage to PDF',     description: 'Paste any URL and convert a live webpage to a pixel-perfect PDF instantly.',      category: 'Convert',  icon: Globe          },
  { id: 'bookmark-pdf', title: 'Bookmark PDF',      description: 'Add a clickable table of contents to any PDF. Create, edit and reorder bookmarks instantly.',    category: 'Edit',     icon: Bookmark       },
  { id: 'watermark',    title: 'Watermark',          description: 'Stamp an image or text over your PDF in seconds. Choose typography, transparency and position.',  category: 'Edit',     icon: Stamp          },
  { id: 'page-numbers', title: 'Page Numbers',       description: 'Add page numbers to PDFs with ease. Choose position, dimensions, typography and size.',           category: 'Edit',     icon: FileDigit      },
  { id: 'metadata',     title: 'Edit Metadata',      description: 'Add, change or remove metadata fields including Author, Title, and Subject.',                     category: 'Edit',     icon: Settings       },
  { id: 'redact-pdf',   title: 'Redact PDF',         description: 'Permanently hide sensitive text and areas with black boxes. Draw or search to redact.',          category: 'Security', icon: EyeOff         },
  { id: 'unlock',       title: 'Unlock PDF',         description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',              category: 'Security', icon: Unlock         },
  { id: 'protect',      title: 'Protect PDF',        description: 'Encrypt PDF with a password. Manage PDF permissions and access control.',                         category: 'Security', icon: Lock           },
  { id: 'aadhar-crop',  title: 'Aadhar Cropper',     description: 'Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.',                    category: 'Special',  icon: Wand2          },
  { id: 'esign',        title: 'E-Sign PDF',         description: 'Draw or type your signature and place it anywhere on a PDF or image. Download the signed file instantly.', category: 'Sign', icon: PenLine },
  { id: 'edit-pdf',     title: 'Edit PDF',           description: 'Highlight, draw, add text and freehand annotations directly on PDFs. Zero uploads, 100% private.', category: 'Edit', icon: PenLine },
];

/* ── Reusable shimmer bar ── */
function Sh({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}

/* ── Feature section shimmer (text + mock card) ── */
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

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayCategory, setDisplayCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [verifiedKeys, setVerifiedKeys] = useState<string[]>([]);
  const [imgConvertKeys, setImgConvertKeys] = useState<string[]>(['jpg-to-png', 'png-to-jpg', 'jpg-to-webp', 'webp-to-jpg', 'png-to-webp', 'webp-to-png', 'jpg-to-avif', 'avif-to-jpg', 'png-to-avif', 'avif-to-png', 'webp-to-avif', 'avif-to-webp']);
  const [dbCategories, setDbCategories] = useState<string[]>(CATEGORIES);
  const toolsGridRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getVerifiedToolKeys().then(setVerifiedKeys);
    getImgConvertTools().then(setImgConvertKeys);
    getCategories().then(cats => {
      const ordered = CATEGORIES.filter(c => c === 'All' || cats.includes(c));
      const extra = cats.filter((c: string) => !CATEGORIES.includes(c));
      setDbCategories([...ordered, ...extra]);
    });
    insertAvifTools().then(err => { if (err) console.error('insertAvifTools error:', err); });
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || activeCategory === displayCategory) return;
    setIsLoading(true);
    const t = setTimeout(() => { setDisplayCategory(activeCategory); setIsLoading(false); }, 300);
    return () => clearTimeout(t);
  }, [activeCategory, mounted]);

  const filteredTools = useMemo(() =>
    TOOLS.filter(t => {
      const isVerified = verifiedKeys.includes(t.id);
      if (displayCategory === 'All') return isVerified;
      if (displayCategory === 'Image Convert') return isVerified && imgConvertKeys.includes(t.id);
      return isVerified && t.category === displayCategory;
    }),
  [displayCategory, verifiedKeys, imgConvertKeys]);

  const showGridSkeleton = !mounted || isLoading;

  const skeletonTools = useMemo(() => {
    if (!mounted) return TOOLS;
    const cat = activeCategory;
    if (cat === 'All') return TOOLS.slice(0, 8);
    return Array.from({ length: 8 }, () => ({ category: cat }));
  }, [activeCategory, mounted]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-mesh-premium" />

      {/* ── HERO ── */}
      <section className="container mx-auto px-4 py-24 text-center relative z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest shadow-sm fade-in-up mb-4">
              <Sparkles size={14} className="fill-red-500" />
              100% Free &amp; Secure PDF Tools
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter fade-in-up stagger-1">
              <span className="hero-gradient-text">PDF Tools Simplified.</span>{' '}
              <span className="text-slate-900 dark:text-white">Built for Efficiency.</span>
            </h2>
            <p className="text-xl font-medium text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
              The most powerful web-based PDF platform. Merge, split, compress, and convert documents in seconds with advanced security and premium speed.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mt-16 fade-in-up stagger-3 flex justify-center">
            <div className="hidden md:block overflow-x-auto pb-4 scrollbar-hide px-4">
              <div className="category-nav mx-auto">
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
                <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{activeCategory}</span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileMenuOpen && (
                <div className="absolute top-full left-4 right-4 mt-2 py-2 glass-dropdown mobile-dropdown-shadow rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-[60]">
                  {dbCategories.map(cat => (
                    <button key={cat} onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

      {/* ── TOOLS GRID ── */}
      <section ref={toolsGridRef} className="container mx-auto px-4 pb-20">
        {showGridSkeleton ? (
          <SkeletonGrid count={skeletonTools.length} categories={skeletonTools.map(t => t.category)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredTools.map((tool) => {
              const style = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.Special;
              return (
                <div key={tool.id} className="tool-card-border" style={{ '--cat-gradient': style.gradient } as React.CSSProperties}>
                  <a
                      href={tool.id === 'esign' ? '/esign' : tool.id === 'edit-pdf' ? '/edit' : `/tool/${tool.id}`}
                      className="tool-card"
                      onClick={() => trackToolClick(tool.id)}
                    >
                    <div className={`tool-icon-wrapper shadow-xl ${style.shadow}`} style={{ backgroundImage: style.gradient }}>
                      <tool.icon size={28} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{tool.title}</h3>
                      <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug">{tool.description}</p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── TAGLINE ── */}
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
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Keep Your Simple Tasks Simple
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              The first and only PDF software you&apos;ll love. We have all the tools you&apos;ll need to start, manage, and finish your work with digital documents.
            </p>
          </div>
        </section>
      )}

      {/* ── CREATE THE PERFECT DOCUMENT ── */}
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
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Create the Perfect Document
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  File too big? Compress it. Need a specific format? Convert it. Things getting chaotic? Merge and split files, or remove excess pages. We have it all.
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); toolsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base hover:gap-3 transition-all cursor-pointer"
                >
                  View all PDF tools &#8594;
                </button>
              </div>
              <div className="flex-1 flex justify-center relative">
                <div className="relative w-full max-w-lg">
                  <div className="relative">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 relative z-10 transform rotate-[-2deg]">
                      <div className="space-y-2 mb-6">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${100 - i * 8}%` }} />)}
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-black rounded-lg shadow-lg">PDF</span>
                      </div>
                    </div>
                    <div className="absolute -top-6 -right-6 bg-blue-500 text-white px-4 py-2 rounded-xl shadow-xl font-black text-sm z-20 transform rotate-12 animate-bounce" style={{ animationDuration: '3s' }}>DOC</div>
                    <div className="absolute top-1/3 -left-8 bg-orange-500 text-white px-4 py-2 rounded-xl shadow-xl font-black text-sm z-20 transform -rotate-12">PPT</div>
                    <div className="absolute bottom-8 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-xl font-black text-sm z-20 transform rotate-6">XLS</div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                      {[{ label: '✂️', bg: '#ef4444' }, { label: '🔒', bg: '#8b5cf6' }, { label: '⚡', bg: '#f59e0b' }, { label: '🔄', bg: '#3b82f6' }].map((item, i) => (
                        <div key={i} className="w-12 h-12 rounded-xl shadow-2xl flex items-center justify-center text-xl transform hover:scale-110 transition-transform" style={{ backgroundColor: item.bg }}>{item.label}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── DIGITAL SIGNATURES ── */}
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
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Digital Signatures Made Easy</h2>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Fill in forms, e-sign contracts, and close deals in a few simple steps. You can also request e-signatures and track your document every step of the way.
                </p>
                <a href="/esign" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-base hover:gap-3 transition-all">Try eSign &#8594;</a>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="ml-2 text-xs text-slate-400 font-medium">eSign &mdash; Document.pdf</span>
                    </div>
                    <div className="space-y-2">
                      {[1,2,3].map(i => <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${90 - i * 10}%` }} />)}
                    </div>
                    <div className="mt-6 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-slate-400 italic" style={{ fontFamily: 'cursive' }}>esign</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="text-xs font-bold bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">✏️ Signature</span>
                      <span className="text-xs font-bold bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">AB Initials</span>
                    </div>
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">Review &amp; Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

       {/* ── WORK DIRECTLY ON YOUR FILES ── */}
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
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Work Directly on Your Files</h2>
                 <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                   Do more than just view PDFs. Highlight and add text, freehand annotations, and more — all processed locally in your browser. Zero uploads, 100% private.
                 </p>
                 <a href="/edit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-black text-sm uppercase tracking-widest shadow-lg transition-all hover:scale-105 hover:shadow-xl" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
                   Open &amp; Edit a PDF &#8594;
                 </a>
               </div>
               <div className="flex-1 flex justify-center">
                 <div className="relative w-full max-w-md">
                   <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                     <div className="flex items-center gap-2 mb-4">
                       <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
                       <span className="ml-2 text-xs text-slate-400 font-medium">Edit &mdash; Document.pdf</span>
                     </div>
                     <div className="space-y-2">
                       {[1,2,3,4].map(i => <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${95 - i * 8}%` }} />)}
                     </div>
                     <div className="mt-4 flex items-center gap-2">
                       <div className="border-2 border-blue-400 rounded-lg px-3 py-1.5">
                         <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Hello!</p>
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

       {/* ── LATEST BLOG POSTS ── */}
       <section className="py-20 bg-white dark:bg-slate-900">
         <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest shadow-sm mb-6">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
               Latest from Blog
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
               Helpful Guides &<br />
               <span className="text-red-500">PDF Tutorials</span>
             </h2>
             <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
               Learn how to get the most out of your PDFs with our latest tips, guides, and step-by-step tutorials.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
             {/* Blog Post 1: Aadhar Card */}
             <a href="/blog/how-to-crop-aadhar-card" className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
               <div className="h-2 bg-red-500" />
               <div className="p-6 flex flex-col flex-1 gap-4">
                 <div className="flex items-start justify-between gap-3">
                   <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                       <circle cx="12" cy="12" r="3" />
                       <path d="M12 8v4M8 12h4" />
                     </svg>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                     Tutorial
                   </span>
                 </div>
                 <div className="flex-1">
                   <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                     How to Crop Aadhar Card for Printing — Free Online Tool
                   </h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                     Crop your e-Aadhar PDF to standard ID card dimensions (86mm × 54mm) and get a print-ready A4 PDF in seconds — 100% private, runs in your browser.
                   </p>
                 </div>
                 <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
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
                   <span className="text-xs font-black text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                     Read <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                   </span>
                 </div>
               </div>
             </a>

             {/* Blog Post 2: Convert PDF */}
             <a href="/blog/pdf-to-word-conversion-guide" className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
               <div className="h-2 bg-blue-500" />
               <div className="p-6 flex flex-col flex-1 gap-4">
                 <div className="flex items-start justify-between gap-3">
                   <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                       <polyline points="14 2 14 8 20 8" />
                       <line x1="16" y1="13" x2="8" y2="13" />
                       <line x1="16" y1="17" x2="8" y2="17" />
                       <polyline points="10 9 9 9 8 9" />
                     </svg>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                     Guide
                   </span>
                 </div>
                 <div className="flex-1">
                   <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                     Convert PDF All Tools: Complete Guide for 2026
                   </h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                     Master all PDF conversion tools in one comprehensive guide. Learn how to convert PDFs to Word, Excel, PowerPoint, JPG, and more with professional tips and best practices.
                   </p>
                 </div>
                 <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
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
                   <span className="text-xs font-black text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                     Read <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                   </span>
                 </div>
               </div>
             </a>
           </div>

           {/* View All Blog Posts Button */}
           <div className="text-center">
             <a href="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:bg-slate-700 dark:hover:bg-slate-100">
               View All Blog Posts
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M5 12h14M12 5l7 7-7 7" />
               </svg>
             </a>
           </div>
         </div>
       </section>

      {/* ── WHY CHOOSE SMART PDFs? ── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight text-center mb-16">
            Why Choose Smart PDFs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-14">

            {/* People Trust Us */}
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 flex items-center justify-center relative">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="24" cy="20" r="10" fill="#bfdbfe" />
                  <circle cx="40" cy="18" r="8" fill="#93c5fd" />
                  <ellipse cx="24" cy="46" rx="16" ry="10" fill="#bfdbfe" />
                  <ellipse cx="40" cy="44" rx="13" ry="8" fill="#93c5fd" />
                </svg>
                <span className="absolute bottom-0 left-0 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">1M+ users</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">People Trust Us</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Millions of users rely on Smart PDFs every day to simplify their work with digital documents — fast, free, and fully private.
              </p>
            </div>

            {/* Businesses Trust Us */}
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="36" width="10" height="20" rx="2" fill="#fde68a" />
                  <rect x="22" y="24" width="10" height="32" rx="2" fill="#fbbf24" />
                  <rect x="36" y="14" width="10" height="42" rx="2" fill="#f59e0b" />
                  <path d="M8 34 L22 22 L36 12 L50 8" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M46 8 L52 8 L52 14" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {[0,1,2,3,4].map(i => (
                    <path key={i} d={`M${10 + i * 10} 58 L${14 + i * 10} 54`} stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                  ))}
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Top-Rated PDF Tools</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Smart PDFs is consistently rated among the best free PDF platforms for speed, reliability, and ease of use by our growing community.
              </p>
            </div>

            {/* Works Everywhere */}
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 flex items-center justify-center relative">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="6" y="10" width="52" height="36" rx="6" fill="#e0e7ff" />
                  <rect x="10" y="14" width="44" height="28" rx="3" fill="#c7d2fe" />
                  <rect x="22" y="46" width="20" height="4" rx="2" fill="#a5b4fc" />
                  <rect x="16" y="50" width="32" height="3" rx="1.5" fill="#818cf8" />
                </svg>
                <span className="absolute top-1 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Works on Any Device</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Fully responsive on desktop, tablet, and mobile. No app or installation needed — just open your browser and get to work.
              </p>
            </div>

            {/* 24/7 Available */}
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 flex items-center justify-center relative">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="12" width="30" height="36" rx="4" fill="#bfdbfe" />
                  <rect x="12" y="16" width="22" height="4" rx="2" fill="#93c5fd" />
                  <rect x="12" y="24" width="16" height="3" rx="1.5" fill="#93c5fd" />
                  <rect x="12" y="30" width="20" height="3" rx="1.5" fill="#93c5fd" />
                  <circle cx="44" cy="44" r="14" fill="#1d4ed8" />
                  <text x="44" y="49" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">24/7</text>
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Always Available</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Smart PDFs is available around the clock. Process your documents any time, any day — no downtime, no waiting.
              </p>
            </div>

            {/* 256-bit Encryption */}
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 flex items-center justify-center relative">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="14" y="8" width="36" height="28" rx="5" fill="#dbeafe" />
                  <rect x="20" y="14" width="24" height="16" rx="3" fill="#93c5fd" />
                  <rect x="10" y="32" width="44" height="24" rx="5" fill="#3b82f6" />
                  <circle cx="32" cy="44" r="5" fill="white" />
                  <rect x="30" y="44" width="4" height="6" rx="1" fill="#3b82f6" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-[9px] font-black text-slate-900 px-1.5 py-0.5 rounded shadow">256-bit</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">256-Bit TLS Encryption</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We use 256-bit TLS encryption to keep your data safe during transfer. Your files are processed securely and never stored on our servers.
              </p>
            </div>

            {/* Privacy & Security */}
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="6 4" />
                  <circle cx="32" cy="32" r="20" fill="#f1f5f9" />
                  <path d="M32 14 L44 20 L44 34 C44 42 32 50 32 50 C32 50 20 42 20 34 L20 20 Z" fill="#64748b" />
                  <path d="M32 18 L41 23 L41 34 C41 40 32 47 32 47 C32 47 23 40 23 34 L23 23 Z" fill="#94a3b8" />
                  <path d="M27 32 L30 35 L37 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="32" y="62" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold">PRIVACY FIRST</text>
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Privacy First</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Your safety is our priority. All PDF processing happens locally in your browser — your files never leave your device. Zero uploads, 100% private.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
