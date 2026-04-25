"use client";

import { useState, useMemo } from 'react';
import { 
  Combine, 
  Scissors, 
  FileText, 
  Settings, 
  Lock, 
  FileCode,
  Stamp,
  Hash,
  Sparkles,
  Zap,
  LayoutGrid,
  FileCheck,
  Type,
  ImageIcon,
  Wand2,
  FileDigit,
  FileJson,
  FileSymlink,
  Unlock,
  Presentation,
  FileSpreadsheet,
  Globe,
  LifeBuoy,
  ChevronDown
} from 'lucide-react';const CATEGORIES = ['All', 'Organize', 'Optimize', 'Convert', 'Edit', 'Security', 'Special'];

const CATEGORY_STYLES: Record<string, { gradient: string, shadow: string, hover: string }> = {
  'Organize': { gradient: 'linear-gradient(135deg, #f26522, #c2410c)', shadow: 'shadow-orange-500/20', hover: 'hover:shadow-orange-500/40' },
  'Optimize': { gradient: 'linear-gradient(135deg, #22c55e, #15803d)', shadow: 'shadow-green-500/20', hover: 'hover:shadow-green-500/40' },
  'Convert': { gradient: 'linear-gradient(135deg, #3182ce, #1e3a8a)', shadow: 'shadow-blue-500/20', hover: 'hover:shadow-blue-500/40' },
  'Edit': { gradient: 'linear-gradient(135deg, #E8465D, #843286)', shadow: 'shadow-pink-500/20', hover: 'hover:shadow-pink-500/40' },
  'Security': { gradient: 'linear-gradient(135deg, #e53e3e, #7f1d1d)', shadow: 'shadow-red-500/20', hover: 'hover:shadow-red-500/40' },
  'Special': { gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', shadow: 'shadow-red-600/20', hover: 'hover:shadow-red-600/40' },
};

const TOOLS = [
  // Organize
  { id: 'organize', title: 'Organize PDF', description: 'Sort, add and delete PDF pages. Rotate PDF pages and reorder them at your convenience.', category: 'Organize', icon: FileSymlink },
  { id: 'merge', title: 'Merge PDF', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', category: 'Organize', icon: Combine },
  { id: 'split', title: 'Split PDF', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', category: 'Organize', icon: Scissors },
  
  // Optimize
  { id: 'compress', title: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', category: 'Optimize', icon: Zap },
  { id: 'repair-pdf', title: 'Repair PDF', description: 'Recover data from damaged, corrupted or illegible PDF files.', category: 'Optimize', icon: LifeBuoy },
  
  // Convert
  { id: 'extract-text', title: 'PDF to Text', description: 'Easily convert your PDF files into easy to edit text documents.', category: 'Convert', icon: Type },
  { id: 'pdf-to-xml', title: 'PDF to XML', description: 'Extract structured data from your PDF into XML machine readable format.', category: 'Convert', icon: FileJson },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', category: 'Convert', icon: ImageIcon },
  { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', category: 'Convert', icon: ImageIcon },
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', category: 'Convert', icon: FileText },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDF documents to editable DOCX files with high accuracy.', category: 'Convert', icon: FileText },
  { id: 'ppt-to-pdf', title: 'PowerPoint to PDF', description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', category: 'Convert', icon: Presentation },
  { id: 'pdf-to-ppt', title: 'PDF to PowerPoint', description: 'Convert your PDF documents into editable PPTX presentations.', category: 'Convert', icon: Presentation },
  { id: 'excel-to-pdf', title: 'Excel to PDF', description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', category: 'Convert', icon: FileSpreadsheet },
  { id: 'pdf-to-excel', title: 'PDF to Excel', description: 'Convert your PDF documents into editable XLSX spreadsheets with table extraction.', category: 'Convert', icon: FileSpreadsheet },
  { id: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert web pages or HTML files into PDF documents with high fidelity.', category: 'Convert', icon: Globe },

  // Edit
  { id: 'watermark', title: 'Watermark', description: 'Stamp an image or text over your PDF in seconds. Choose typography, transparency and position.', category: 'Edit', icon: Stamp },
  { id: 'page-numbers', title: 'Page Numbers', description: 'Add page numbers to PDFs with ease. Choose position, dimensions, typography and size.', category: 'Edit', icon: FileDigit },
  { id: 'metadata', title: 'Edit Metadata', description: 'Add, change or remove metadata fields including Author, Title, and Subject.', category: 'Edit', icon: Settings },
  
  // Security
  { id: 'unlock', title: 'Unlock PDF', description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', category: 'Security', icon: Unlock },
  { id: 'protect', title: 'Protect PDF', description: 'Encrypt PDF with a password. Manage PDF permissions and access control.', category: 'Security', icon: Lock },
  
  // Special
  { id: 'aadhar-crop', title: 'Aadhar Cropper', description: 'Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing.', category: 'Special', icon: Wand2 },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(t => {
      const matchCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen relative overflow-hidden">
      {/* Premium Background Layer */}
      <div className="bg-mesh-premium" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest shadow-sm fade-in-up mb-4">
            <Sparkles size={14} className="fill-red-500" />
            100% Free & Secure PDF Tools
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter fade-in-up stagger-1">
             <span className="hero-gradient-text">PDF Tools Simplified.</span>{' '}
             <span className="text-slate-900 dark:text-white">Built for Efficiency.</span>
          </h2>
          
          <p className="text-xl font-medium text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
            The most powerful web-based PDF platform. Merge, split, compress, and convert documents in seconds with advanced security and premium speed.
          </p>
        </div>

        {/* Integrated Control Center (Categories) */}
        <div className="mt-16 fade-in-up stagger-3 flex justify-center">
          {/* Desktop Navigation */}
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

          {/* Mobile Dropdown Navigation */}
          <div className="md:hidden w-full px-4 relative z-50">
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
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
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsMobileMenuOpen(false);
                    }}
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
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredTools.map((tool) => {
            const style = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Special'];
            return (
              <a 
                key={tool.id} 
                href={`/tool/${tool.id}`} 
                className={`tool-card group ${style.hover}`}
              >
                <div 
                  className={`tool-icon-wrapper shadow-xl ${style.shadow}`} 
                  style={{ backgroundImage: style.gradient }}
                >
                  <tool.icon size={28} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-red-500 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug">
                    {tool.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Advertisement Slot */}
      <div className="container mx-auto px-4 pb-20">
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-12 border border-slate-100 dark:border-slate-800 text-center text-slate-400 opacity-50 border-dashed">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Advertisement Zone</p>
            <div className="h-24 flex items-center justify-center font-bold text-xl italic italic">
              Premium Native Display Ad Placement
            </div>
         </div>
      </div>
    </div>
  );
}
