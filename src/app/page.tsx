"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import SkeletonGrid from '@/components/SkeletonGrid';
import {
  Combine, Scissors, FileText, Settings, Lock,
  Stamp, Sparkles, Zap, Type, ImageIcon, Wand2,
  FileDigit, FileJson, FileSymlink, Unlock,
  Presentation, FileSpreadsheet, Globe, LifeBuoy, ChevronDown, PenLine
} from 'lucide-react';

const CATEGORIES = ['All', 'Organize', 'Optimize', 'Convert', 'Edit', 'Security', 'Special', 'Sign'];

const CATEGORY_STYLES: Record<string, { gradient: string; shadow: string }> = {
  Organize: { gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'shadow-orange-500/20' },
  Optimize: { gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'shadow-green-500/20' },
  Convert:  { gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'shadow-blue-500/20'  },
  Edit:     { gradient: 'linear-gradient(135deg, #E8465D, #843286)',  shadow: 'shadow-pink-500/20'  },
  Security: { gradient: 'linear-gradient(135deg, #e53e3e, #7f1d1d)', shadow: 'shadow-red-500/20'   },
  Special:  { gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'shadow-red-600/20'   },
  Sign:     { gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', shadow: 'shadow-purple-500/20' },
};

const TOOLS = [
  { id: 'organize',     title: 'Organize PDF',      description: 'Sort, add and delete PDF pages. Rotate PDF pages and reorder them at your convenience.',          category: 'Organize', icon: FileSymlink    },
  { id: 'merge',        title: 'Merge PDF',          description: 'Combine PDFs in the order you want with the easiest PDF merger available.',                       category: 'Organize', icon: Combine        },
  { id: 'split',        title: 'Split PDF',          description: 'Separate one page or a whole set for easy conversion into independent PDF files.',                category: 'Organize', icon: Scissors       },
  { id: 'compress',     title: 'Compress PDF',       description: 'Reduce file size while optimizing for maximal PDF quality.',                                      category: 'Optimize', icon: Zap            },
  { id: 'repair-pdf',   title: 'Repair PDF',         description: 'Recover data from damaged, corrupted or illegible PDF files.',                                    category: 'Optimize', icon: LifeBuoy       },
  { id: 'extract-text', title: 'PDF to Text',        description: 'Easily convert your PDF files into easy to edit text documents.',                                 category: 'Convert',  icon: Type           },
  { id: 'pdf-to-xml',   title: 'PDF to XML',         description: 'Extract structured data from your PDF into XML machine readable format.',                         category: 'Convert',  icon: FileJson       },
  { id: 'pdf-to-jpg',   title: 'PDF to JPG',         description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',                     category: 'Convert',  icon: ImageIcon      },
  { id: 'jpg-to-pdf',   title: 'JPG to PDF',         description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',                    category: 'Convert',  icon: ImageIcon      },
  { id: 'word-to-pdf',  title: 'Word to PDF',        description: 'Make DOC and DOCX files easy to read by converting them to PDF.',                                category: 'Convert',  icon: FileText       },
  { id: 'pdf-to-word',  title: 'PDF to Word',        description: 'Convert your PDF documents to editable DOCX files with high accuracy.',                          category: 'Convert',  icon: FileText       },
  { id: 'ppt-to-pdf',   title: 'PowerPoint to PDF',  description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',                           category: 'Convert',  icon: Presentation   },
  { id: 'pdf-to-ppt',   title: 'PDF to PowerPoint',  description: 'Convert your PDF documents into editable PPTX presentations.',                                   category: 'Convert',  icon: Presentation   },
  { id: 'excel-to-pdf', title: 'Excel to PDF',       description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',                                category: 'Convert',  icon: FileSpreadsheet },
  { id: 'pdf-to-excel', title: 'PDF to Excel',       description: 'Convert your PDF documents into editable XLSX spreadsheets with table extraction.',              category: 'Convert',  icon: FileSpreadsheet },
  { id: 'html-to-pdf',  title: 'HTML to PDF',        description: 'Convert web pages or HTML files into PDF documents with high fidelity.',                         category: 'Convert',  icon: Globe          },
  { id: 'watermark',    title: 'Watermark',          description: 'Stamp an image or text over your PDF in seconds. Choose typography, transparency and position.',  category: 'Edit',     icon: Stamp          },
  { id: 'page-numbers', title: 'Page Numbers',       description: 'Add page numbers to PDFs with ease. Choose position, dimensions, typography and size.',           category: 'Edit',     icon: FileDigit      },
  { id: 'metadata',     title: 'Edit Metadata',      description: 'Add, change or remove metadata fields including Author, Title, and Subject.',                     category: 'Edit',     icon: Settings       },
  { id: 'unlock',       title: 'Unlock PDF',         description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',              category: 'Security', icon: Unlock         },
  { id: 'protect',      title: 'Protect PDF',        description: 'Encrypt PDF with a password. Manage PDF permissions and access control.',                         category: 'Security', icon: Lock           },
  { id: 'aadhar-crop',  title: 'Aadhar Cropper',     description: 'Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.',                    category: 'Special',  icon: Wand2          },
  { id: 'esign',        title: 'E-Sign PDF',          description: 'Draw or type your signature and place it anywhere on a PDF or image. Download the signed file instantly.', category: 'Sign', icon: PenLine },
];

const FEATURE_BG = 'linear-gradient(135deg, #bae6fd4d 0%, #fff0 50%, #fecaca4d 100%)';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayCategory, setDisplayCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  const toolsGridRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || activeCategory === displayCategory) return;
    setIsLoading(true);
    const t = setTimeout(() => { setDisplayCategory(activeCategory); setIsLoading(false); }, 300);
    return () => clearTimeout(t);
  }, [activeCategory, mounted]);

  const filteredTools = useMemo(() =>
    TOOLS.filter(t => displayCategory === 'All' || t.category === displayCategory),
  [displayCategory]);

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

      {/* Hero */}
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
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto pb-4 scrollbar-hide px-4">
            <div className="category-nav mx-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile dropdown */}
          <div className="md:hidden w-full px-4 relative z-50">
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsMobileMenuOpen(false)} />
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg focus:outline-none transition-all active:scale-[0.98]"
            >
              <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                {activeCategory}
              </span>
              <ChevronDown
                size={20}
                className={`text-slate-400 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isMobileMenuOpen && (
              <div className="absolute top-full left-4 right-4 mt-2 py-2 glass-dropdown mobile-dropdown-shadow rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-[60]">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors ${
                      activeCategory === cat
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section ref={toolsGridRef} className="container mx-auto px-4 pb-20">
        {showGridSkeleton ? (
          <SkeletonGrid
            count={skeletonTools.length}
            categories={skeletonTools.map(t => t.category)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredTools.map((tool) => {
              const style = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.Special;
              return (
                <div
                  key={tool.id}
                  className="tool-card-border"
                  style={{ '--cat-gradient': style.gradient } as React.CSSProperties}
                >
                  <a href={tool.id === 'esign' ? '/esign' : `/tool/${tool.id}`} className="tool-card">
                    <div
                      className={`tool-icon-wrapper shadow-xl ${style.shadow}`}
                      style={{ backgroundImage: style.gradient }}
                    >
                      <tool.icon size={28} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        {tool.title}
                      </h3>
                      <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug">
                        {tool.description}
                      </p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TAGLINE SECTION */}
      <section className="py-20 text-center" style={{ background: '#ffffff' }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Keep Your Simple Tasks Simple
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            The first and only PDF software you&apos;ll love. We have all the tools you&apos;ll need to start, manage, and finish your work with digital documents.
          </p>
        </div>
      </section>

      {/* CREATE THE PERFECT DOCUMENT */}
      <section className="py-20" style={{ background: FEATURE_BG }}>
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
                onClick={() => {
                  setActiveCategory('All');
                  toolsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
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
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${100 - i * 8}%` }} />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-black rounded-lg shadow-lg">PDF</span>
                    </div>
                  </div>
                  <div className="absolute -top-6 -right-6 bg-blue-500 text-white px-4 py-2 rounded-xl shadow-xl font-black text-sm z-20 transform rotate-12 animate-bounce" style={{ animationDuration: '3s' }}>
                    DOC
                  </div>
                  <div className="absolute top-1/3 -left-8 bg-orange-500 text-white px-4 py-2 rounded-xl shadow-xl font-black text-sm z-20 transform -rotate-12">
                    PPT
                  </div>
                  <div className="absolute bottom-8 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-xl font-black text-sm z-20 transform rotate-6">
                    XLS
                  </div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                    {[
                      { label: '\u2702\ufe0f', bg: '#ef4444' },
                      { label: '\ud83d\udd12', bg: '#8b5cf6' },
                      { label: '\u26a1', bg: '#f59e0b' },
                      { label: '\ud83d\udd04', bg: '#3b82f6' },
                    ].map((item, i) => (
                      <div key={i} className="w-12 h-12 rounded-xl shadow-2xl flex items-center justify-center text-xl transform hover:scale-110 transition-transform" style={{ backgroundColor: item.bg }}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIGITAL SIGNATURES */}
      <section className="py-16" style={{ background: '#ffffff' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 space-y-5">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Digital Signatures Made Easy
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Fill in forms, e-sign contracts, and close deals in a few simple steps. You can also request e-signatures and track your document every step of the way.
              </p>
              <a href="/esign" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-base hover:gap-3 transition-all">
                Try eSign &#8594;
              </a>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-slate-400 font-medium">eSign &mdash; Document.pdf</span>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${90 - i * 10}%` }} />
                    ))}
                  </div>
                  <div className="mt-6 border-2 border-dashed border-purple-300 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate-400 italic" style={{ fontFamily: 'cursive' }}>esign</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs font-bold bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">&#9997; Signature</span>
                    <span className="text-xs font-bold bg-slate-50 dark:bg-slate-700 text-slate-500 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">AB Initials</span>
                  </div>
                  <button className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">Review &amp; Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK DIRECTLY ON YOUR FILES */}
      <section className="py-16" style={{ background: FEATURE_BG }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 space-y-5">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Work Directly on Your Files
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Do more than just view PDFs. Highlight and add text, images, shapes, and freehand annotations to your documents. Connect to 30+ other tools to enhance your files further.
              </p>
              <a href="/tool/watermark" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Edit a PDF now &#8594;
              </a>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-slate-400 font-medium">Edit &mdash; Document.pdf</span>
                  </div>
                  <div className="flex gap-3 mb-4 flex-wrap">
                    {['Draw', 'Text', 'Shape', 'Image'].map(tool => (
                      <span key={tool} className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800">{tool}</span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full" style={{ width: `${95 - i * 8}%` }} />
                    ))}
                  </div>
                  <div className="mt-4 border-2 border-blue-300 rounded-lg p-2 inline-block">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Hello!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
