import { BookOpen, Clock, ArrowRight, Tag, Combine, Scissors, Zap, FileText, Lock, LayoutGrid, Wand2 } from 'lucide-react';

const POSTS = [
  {
    slug: 'how-to-merge-pdf',
    title: 'How to Merge Multiple PDFs into One File (Free & Easy)',
    excerpt: 'Learn how to combine multiple PDF files into a single document in seconds using SmartPDFs Plus — no software installation required.',
    category: 'Tutorial',
    categoryColor: 'bg-orange-100 text-orange-700',
    icon: Combine,
    iconBg: 'bg-orange-500',
    readTime: '3 min read',
    date: 'Apr 20, 2026',
    featured: true,
  },
  {
    slug: 'compress-pdf-without-losing-quality',
    title: 'How to Compress a PDF Without Losing Quality',
    excerpt: 'Reduce your PDF file size by up to 80% while keeping text sharp and images clear. A complete guide to PDF compression techniques.',
    category: 'Guide',
    categoryColor: 'bg-green-100 text-green-700',
    icon: Zap,
    iconBg: 'bg-green-500',
    readTime: '4 min read',
    date: 'Apr 18, 2026',
    featured: true,
  },
  {
    slug: 'pdf-to-word-conversion-guide',
    title: 'Convert PDF All Tools: Complete All Tool 2026',
    excerpt: 'Everything you need to know about converting PDF files to editable Word documents — including tips for preserving formatting.',
    category: 'Guide',
    categoryColor: 'bg-blue-100 text-blue-700',
    icon: FileText,
    iconBg: 'bg-blue-600',
    readTime: '5 min read',
    date: 'Apr 15, 2026',
    featured: false,
  },
  {
    slug: 'protect-pdf-with-password',
    title: 'How to Password Protect a PDF File in 3 Simple Steps',
    excerpt: 'Keep your sensitive documents secure by adding password protection to any PDF. Works on Windows, Mac, and mobile devices.',
    category: 'Tutorial',
    categoryColor: 'bg-red-100 text-red-700',
    icon: Lock,
    iconBg: 'bg-red-500',
    readTime: '3 min read',
    date: 'Apr 12, 2026',
    featured: false,
  },
  {
    slug: 'organize-pdf-pages',
    title: 'How to Rearrange, Rotate & Delete PDF Pages Online',
    excerpt: 'Master the Organize PDF tool — drag and drop pages, rotate them, delete unwanted ones, and download a perfectly ordered document.',
    category: 'Tutorial',
    categoryColor: 'bg-purple-100 text-purple-700',
    icon: LayoutGrid,
    iconBg: 'bg-purple-500',
    readTime: '4 min read',
    date: 'Apr 10, 2026',
    featured: false,
  },
  {
    slug: 'how-to-crop-aadhar-card',
    title: 'How to Crop Aadhar Card for Printing — Free Online Tool',
    excerpt: 'Crop your e-Aadhar PDF to standard ID card dimensions (86mm × 54mm) and get a print-ready A4 PDF in seconds — 100% private, runs in your browser.',
    category: 'Tutorial',
    categoryColor: 'bg-red-100 text-red-700',
    icon: Wand2,
    iconBg: 'bg-red-500',
    readTime: '3 min read',
    date: 'Apr 8, 2026',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Tutorial', 'Guide', 'Tips'];

export default function BlogPage() {
  const featured = POSTS.filter(p => p.featured);
  const rest = POSTS.filter(p => !p.featured);

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-black uppercase tracking-widest mb-6">
          <BookOpen size={13} /> SmartPDFs Blog
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          PDF Tips, Guides &<br />
          <span className="text-red-500">How-To Tutorials</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Learn how to get the most out of SmartPDFs Plus with step-by-step guides, tips, and tutorials.
        </p>
      </section>

      {/* Featured posts */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featured.map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              {/* Color banner */}
              <div className={`h-2 ${post.iconBg}`} />
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 ${post.iconBg} rounded-xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                    <post.icon size={18} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${post.categoryColor}`}>
                    {post.category}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 text-base leading-snug mb-2 group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <span className="text-xs font-black text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* All posts */}
      <section className="container mx-auto px-4 pb-20 max-w-5xl">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">All Articles</h2>
        <div className="space-y-3">
          {rest.map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 p-5">
              <div className={`w-11 h-11 ${post.iconBg} rounded-xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                <post.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${post.categoryColor}`}>
                    {post.category}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-sm leading-snug group-hover:text-red-500 transition-colors truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block truncate">{post.excerpt}</p>
              </div>
              <div className="shrink-0 text-right space-y-1">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium justify-end">
                  <Clock size={11} /> {post.readTime}
                </div>
                <p className="text-xs text-slate-400">{post.date}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-red-400 transition-colors shrink-0" />
            </a>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white space-y-4">
          <BookOpen size={32} className="mx-auto text-red-400" />
          <h3 className="text-xl font-black">Want More PDF Tips?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Explore all our free PDF tools and start working smarter with your documents today.
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-red-500/20">
            Try All 22+ Free Tools <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </div>
  );
}
