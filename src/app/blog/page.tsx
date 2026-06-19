import {
  BookOpen,
  Clock,
  ArrowRight,
  Tag,
  Combine,
  Scissors,
  Zap,
  FileText,
  Lock,
  LayoutGrid,
  Wand2,
  Image as ImageIcon,
  Shield,
  PenTool,
  Wrench,
  Briefcase,
  FileSpreadsheet,
  FileDigit,
} from "lucide-react";
import BlogImage from "@/components/BlogImage";

const POSTS = [
  {
    slug: "how-to-extract-text-from-scanned-documents-and-invoices",
    title: "Extract Text from Scanned Documents & Invoices (2026)",
    excerpt:
      "Learn how to extract text from scanned documents, invoices, and PDFs using OCR. Discover the benefits of AllPDFTools for fast image-to-text conversion.",
    label: "Convert",
    icon: FileDigit,
    iconBg: "bg-blue-600",
    readTime: "12 min read",
    date: "Jun 19, 2026",
    featured: false,
    image: "/img/extract-text.png",
  },
  {
    slug: "what-is-ocr-and-how-to-convert-scanned-pdfs-to-text",
    title: "What is OCR? Convert Scanned PDF to Text Guide (2026)",
    excerpt:
      "Discover what OCR PDF technology is and how to convert scanned PDFs into editable text. Learn how OCR works, its benefits, and the best tools.",
    label: "Convert",
    icon: FileDigit,
    iconBg: "bg-emerald-600",
    readTime: "10 min read",
    date: "Jun 19, 2026",
    featured: false,
    image: "/img/what-is-ocr.png",
  },
  {
    slug: "how-to-convert-powerpoint-presentations-into-professional-pdfs",
    title: "How to Convert PowerPoint to PDF Professionally (2026)",
    excerpt:
      "Learn the best ways to convert PowerPoint presentations into professional PDFs. Preserve formatting, high-quality images, and layouts effortlessly.",
    label: "Convert",
    icon: FileText,
    iconBg: "bg-orange-600",
    readTime: "8 min read",
    date: "Jun 18, 2026",
    featured: false,
    image: "/img/powerpoint-to-pdf.png",
  },
  {
    slug: "pdf-to-jpg-vs-screenshot-quality",
    title: "PDF to JPG vs Screenshot: Which Has Better Quality?",
    excerpt:
      "Discover the ultimate quality comparison between PDF to JPG conversion and taking screenshots. Learn which method is best for high-resolution images and print.",
    label: "Convert",
    icon: ImageIcon,
    iconBg: "bg-emerald-600",
    readTime: "8 min read",
    date: "Jun 18, 2026",
    featured: false,
    image: "/img/pdf-to-jpg vs screen short.png",
  },
  {
    slug: "how-to-convert-pdf-tables-into-excel-spreadsheets-accurately",
    title: "How to Convert PDF Tables into Excel Accurately (2026)",
    excerpt:
      "Learn the best methods to convert PDF to Excel accurately. Extract tables, preserve formatting, and automate data entry without losing rows or columns.",
    label: "Convert",
    icon: FileSpreadsheet,
    iconBg: "bg-emerald-600",
    readTime: "8 min read",
    date: "Jun 18, 2026",
    featured: false,
    image: "/img/convertpdftable-excel.png",
  },
  {
    slug: "best-way-to-convert-word-to-pdf-without-formatting-issues",
    title: "Convert Word to PDF Without Formatting Issues (2026 Guide)",
    excerpt:
      "Learn the best ways to convert Word documents to PDF without losing formatting. Fix font changes, broken tables, and image misalignment instantly.",
    label: "Convert",
    icon: FileText,
    iconBg: "bg-indigo-600",
    readTime: "8 min read",
    date: "Jun 18, 2026",
    featured: false,
    image: "/img/convert-word-docu-pdf.png",
  },
  {
    slug: "pdf-to-word-vs-pdf-to-docx-difference",
    title: "PDF to Word vs DOCX: What's the Difference? (2026 Guide)",
    excerpt:
      "Discover the key differences between converting a PDF to Word and PDF to DOCX. Learn which format is best for editing, compatibility, and file size.",
    label: "Convert",
    icon: FileText,
    iconBg: "bg-green-600",
    readTime: "8 min read",
    date: "Jun 18, 2026",
    featured: false,
    image: "/img/pdf-word-docx.png",
  },
  {
    slug: "10-common-pdf-problems-and-how-to-fix-them",
    title: "10 Common PDF Problems and How to Fix Them (2026 Guide)",
    excerpt:
      "Struggling with PDF issues? Discover the top 10 common PDF problems—from large file sizes to files not opening—and learn quick, easy troubleshooting fixes.",
    label: "Troubleshooting",
    icon: Wrench,
    iconBg: "bg-red-500",
    readTime: "10 min read",
    date: "Jun 17, 2026",
    featured: false,
    image: "/img/common-problem.png",
  },
  {
    slug: "merge-vs-split-pdf",
    title: "Merge vs Split PDF: When to Use Each Tool (2026 Guide)",
    excerpt:
      "Confused about PDF document management? Learn the exact differences between Merge vs Split PDF tools, real-world use cases, and how to combine or separate pages.",
    label: "Organize",
    icon: Combine,
    iconBg: "bg-orange-500",
    readTime: "8 min read",
    date: "Jun 17, 2026",
    featured: false,
    image: "/img/merge vs split.png",
  },
  {
    slug: "reduce-pdf-size-without-losing-quality",
    title: "Reduce PDF File Size Without Losing Quality (2026 Guide)",
    excerpt:
      "Learn how to reduce PDF file size without losing quality. Discover the best methods, online PDF compressors, and tips for optimizing PDFs efficiently.",
    label: "Optimize",
    icon: Zap,
    iconBg: "bg-teal-500",
    readTime: "8 min read",
    date: "Jun 17, 2026",
    featured: false,
    image: "/img/reduce-pdf-file-size.png",
  },
  {
    slug: "how-to-merge-pdf",
    title: "How to Merge Multiple PDFs into One File (Free & Easy)",
    excerpt:
      "Learn how to combine multiple PDF files into a single document in seconds using SmartPDFs Pro — no software installation required.",
    label: "Organize",
    icon: Combine,
    iconBg: "bg-orange-500",
    readTime: "3 min read",
    date: "Apr 20, 2026",
    featured: true,
    image: "/img/merge-multiple-pdfs.png",
  },
  {
    slug: "compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality",
    excerpt:
      "Reduce your PDF file size by up to 80% while keeping text sharp and images clear. A complete guide to PDF compression techniques.",
    label: "Optimize",
    icon: Zap,
    iconBg: "bg-green-500",
    readTime: "4 min read",
    date: "Apr 18, 2026",
    featured: true,
    image: "/img/compress-pdf.png",
  },
  {
    slug: "pdf-to-word-conversion-guide",
    title: "Convert PDF to Word: The Complete 2026 Guide",
    excerpt:
      "Everything you need to know about converting PDF files to editable Word documents — including tips for preserving formatting.",
    label: "Convert",
    icon: FileText,
    iconBg: "bg-blue-600",
    readTime: "5 min read",
    date: "Apr 15, 2026",
    featured: false,
    image: "/img/word-pdf.png",
  },
  {
    slug: "protect-pdf-with-password",
    title: "How to Password Protect a PDF File in 3 Simple Steps",
    excerpt:
      "Keep your sensitive documents secure by adding password protection to any PDF. Works on Windows, Mac, and mobile devices.",
    label: "Security",
    icon: Lock,
    iconBg: "bg-red-500",
    readTime: "3 min read",
    date: "Apr 12, 2026",
    featured: false,
    image: "/img/protect-pdf-banner.png",
  },
  {
    slug: "organize-pdf-pages",
    title: "How to Rearrange, Rotate & Delete PDF Pages Online",
    excerpt:
      "Master the Organize PDF tool — drag and drop pages, rotate them, delete unwanted ones, and download a perfectly ordered document.",
    label: "Organize",
    icon: LayoutGrid,
    iconBg: "bg-purple-500",
    readTime: "4 min read",
    date: "Apr 10, 2026",
    featured: false,
    image: "/img/rearrange.png",
  },
  {
    slug: "how-to-crop-aadhar-card",
    title: "How to Crop Aadhar Card for Printing — Free Online Tool",
    excerpt:
      "Crop your e-Aadhar PDF to standard ID card dimensions (86mm × 54mm) and get a print-ready A4 PDF in seconds — 100% private, runs in your browser.",
    label: "Special",
    icon: Wand2,
    iconBg: "bg-red-500",
    readTime: "3 min read",
    date: "Apr 8, 2026",
    featured: false,
    image: "/img/crop-aadhar-card.png",
  },
  {
    slug: "how-to-crop-pdf",
    title: "How to Crop PDF Pages Online — Free & Easy",
    excerpt:
      "Need to trim margins, remove white space, or crop specific areas of your PDF pages? SmartPDFs Pro makes it easy and instant.",
    label: "Special",
    icon: Scissors,
    iconBg: "bg-indigo-500",
    readTime: "3 min read",
    date: "Apr 22, 2026",
    featured: false,
    image: "/img/crop-pdf.png",
  },
  {
    slug: "how-to-crop-meesho-labels",
    title: "How to Crop Meesho Labels with Invoice — Free Online Tool",
    excerpt:
      "Are you a Meesho seller struggling to separate shipping labels from invoices? Learn how to automate this process.",
    label: "Ecommerce",
    icon: Scissors,
    iconBg: "bg-pink-500",
    readTime: "4 min read",
    date: "Apr 25, 2026",
    featured: false,
    image: "/img/mesho-invoice-label.png",
  },
  {
    slug: "how-to-crop-meesho-labels-without-invoice",
    title: "How to Crop Meesho Labels Without Invoice — Free Online Tool",
    excerpt:
      "Need to print ONLY the shipping labels for your Meesho orders without the invoices? Learn how to extract just the labels.",
    label: "Ecommerce",
    icon: Scissors,
    iconBg: "bg-pink-600",
    readTime: "4 min read",
    date: "Apr 26, 2026",
    featured: false,
    image: "/img/mesho-label.png",
  },
  {
    slug: "how-to-crop-flipkart-labels",
    title: "How to Crop Flipkart Labels for Thermal Printing",
    excerpt:
      "Flipkart sellers often receive shipping labels in a format that isn't ready for 4x6 thermal printers. Learn how to automate the cropping process.",
    label: "Ecommerce",
    icon: Scissors,
    iconBg: "bg-blue-500",
    readTime: "4 min read",
    date: "Apr 27, 2026",
    featured: false,
    image: "/img/flipkart-label.png",
  },
  {
    slug: "how-to-crop-amazon-labels",
    title: "How to Crop Amazon Labels for Thermal Printing",
    excerpt:
      "Amazon sellers often receive shipping labels in full-page PDF formats. Learn how to isolate each label and prepare it perfectly for thermal printers.",
    label: "Ecommerce",
    icon: Scissors,
    iconBg: "bg-yellow-500",
    readTime: "4 min read",
    date: "Apr 28, 2026",
    featured: false,
    image: "/img/amazone-label.png",
  },
  {
    slug: "how-to-crop-snapdeal-labels",
    title: "How to Crop Snapdeal Labels for Thermal Printing",
    excerpt:
      "Snapdeal sellers often receive shipping labels in formats that aren't ready for 4x6 thermal printers. Learn how to automate the cropping process.",
    label: "Ecommerce",
    icon: Scissors,
    iconBg: "bg-red-600",
    readTime: "4 min read",
    date: "Apr 29, 2026",
    featured: false,
    image: "/img/snapdeal-label.png",
  },
  {
    slug: "ultimate-image-conversion-guide",
    title: "The Ultimate Guide to Image Conversion — Convert Any Format",
    excerpt:
      "Struggling with incompatible image formats? Learn how to convert HEIC to JPG, PNG to WebP, and more with our all-in-one guide.",
    label: "Image Convert",
    icon: ImageIcon,
    iconBg: "bg-emerald-600",
    readTime: "5 min read",
    date: "Apr 30, 2026",
    featured: false,
    image: "/img/convert-img.png",
  },
  {
    slug: "how-to-redact-pdf",
    title: "How to Redact PDF — Hide Sensitive Information Securely",
    excerpt:
      "Need to share a PDF but want to hide sensitive information like passwords or credit card numbers? Learn how to redact PDFs securely.",
    label: "Security",
    icon: Shield,
    iconBg: "bg-slate-800",
    readTime: "4 min read",
    date: "May 1, 2026",
    featured: false,
    image: "/img/redact-pdf.png",
  },
  {
    slug: "how-to-edit-pdf",
    title: "How to Edit PDF Online — Add Text, Images & Annotations",
    excerpt:
      "Need to fill out a form or correct a typo in a PDF? Learn how to use our online PDF editor to modify your documents easily.",
    label: "Edit",
    icon: FileText,
    iconBg: "bg-indigo-600",
    readTime: "4 min read",
    date: "May 2, 2026",
    featured: false,
    image: "/img/edit-pdf.png",
  },
  {
    slug: "how-to-e-sign-pdf",
    title: "How to E-Sign PDF — Sign Documents Electronically",
    excerpt:
      "Need to sign a contract or agreement? Learn how to add secure electronic signatures to your PDFs in seconds.",
    label: "Sign",
    icon: PenTool,
    iconBg: "bg-violet-600",
    readTime: "4 min read",
    date: "May 3, 2026",
    featured: false,
    image: "/img/e-sign-pdf.png",
  },
  {
    slug: "ultimate-pdf-optimization-guide",
    title: "The Ultimate Guide to PDF Optimization — Size, Speed & Repair",
    excerpt:
      "Are your PDF files too large or corrupted? Learn how to compress, repair, and clean up your PDFs with our all-in-one guide.",
    label: "Optimize",
    icon: Zap,
    iconBg: "bg-amber-500",
    readTime: "5 min read",
    date: "May 4, 2026",
    featured: false,
    image: "/img/pdf-optimization.png",
  },
  {
    slug: "ultimate-guide-to-organizing-pdfs",
    title: "The Ultimate Guide to Organizing PDFs — Merge, Split & Rearrange",
    excerpt:
      "Do you need to combine reports or split a large document? Learn how to use our organization tools to manage your PDFs.",
    label: "Organize",
    icon: LayoutGrid,
    iconBg: "bg-purple-600",
    readTime: "5 min read",
    date: "May 5, 2026",
    featured: false,
    image: "/img/organizing-pdfs.png",
  },
  {
    slug: "ultimate-pdf-editing-guide",
    title: "The Ultimate Guide to Editing, Redacting & Signing PDFs",
    excerpt:
      "Need to fill out a form or hide sensitive data? Learn how to use our editing tools to modify your documents safely.",
    label: "Edit",
    icon: Wand2,
    iconBg: "bg-pink-600",
    readTime: "5 min read",
    date: "May 6, 2026",
    featured: false,
    image: "/img/edit-redact-sign-pdf.png",
  },
  {
    slug: "organize-large-pdf-documents-business",
    title: "How to Organize Large PDF Documents for Business Use",
    excerpt:
      "A comprehensive guide to best practices, file management tips, and essential PDF productivity tools to keep your corporate workflows efficient and secure.",
    label: "Organize",
    icon: Briefcase,
    iconBg: "bg-blue-600",
    readTime: "7 min read",
    date: "Jun 18, 2026",
    featured: false,
    image: "/img/organize-large-pdf.png",
  },
  {
    slug: "pdf-security-guide-protect-unlock-redact",
    title: "PDF Security Guide: Protect, Unlock and Redact Documents",
    excerpt:
      "Learn how to secure, encrypt, password-protect, unlock, and properly redact sensitive PDF documents. A complete 2026 guide to PDF privacy and compliance.",
    label: "Security",
    icon: Shield,
    iconBg: "bg-red-600",
    readTime: "9 min read",
    date: "Jun 18, 2026",
    featured: false,
    image: "/img/mergwpdf & features img.png",
  },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Organize: "Manage your PDF pages, merge files, and split documents.",
  Optimize: "Shrink file sizes and repair corrupted PDFs.",
  Convert: "Convert PDFs to editable formats like Word and Excel.",
  Security: "Protect your files with passwords and redact sensitive info.",
  Special: "Custom tools for specific documents like Aadhar cards.",
  Ecommerce: "Crop shipping labels for Amazon, Meesho, Flipkart, and more.",
  "Image Convert":
    "Convert images between modern formats like WebP, AVIF, and PNG.",
  Edit: "Add text, draw, and annotate your PDFs.",
  Sign: "E-sign documents securely online.",
  Troubleshooting: "Fix common PDF issues, compression problems, and formatting errors.",
};

export default function BlogPage() {
  const featured = POSTS.filter((p) => p.featured);
  const categories = [
    "Organize",
    "Optimize",
    "Convert",
    "Security",
    "Special",
    "Ecommerce",
    "Image Convert",
    "Edit",
    "Sign",
    "Troubleshooting",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold uppercase tracking-widest mb-6">
          <BookOpen size={13} /> SmartPDFs Blog
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
          PDF Tips, Guides &<br />
          <span className="text-red-500">How-To Tutorials</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Learn how to get the most out of SmartPDFs Pro with step-by-step
          guides, tips, and tutorials.
        </p>
      </section>

      {/* Featured posts */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
          Featured Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featured.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative overflow-hidden">
                <BlogImage
                  src={post.image || "/img/word-pdf.png"}
                  alt={post.title}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center z-10">
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-red-500 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center">
                    <BookOpen size={20} className="stroke-[2.5]" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white text-red-600 border-2 border-red-500 shadow-sm">
                    {post.label}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 ${post.iconBg} rounded-lg flex items-center justify-center text-white shrink-0 shadow-md`}
                  >
                    <post.icon size={16} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <span className="text-xs font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Category grouped posts */}
      <section className="container mx-auto px-4 pb-20 max-w-5xl">
        {categories.map((category) => {
          const categoryPosts = POSTS.filter((p) => p.label === category);
          if (categoryPosts.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              <div className="mb-4">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {category}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {CATEGORY_DESCRIPTIONS[category] || ""}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryPosts.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      <BlogImage
                        src={post.image || "/img/word-pdf.png"}
                        alt={post.title}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center z-10">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-red-500 rounded-full p-2.5 shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center">
                          <BookOpen size={16} className="stroke-[2.5]" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white text-red-600 border-2 border-red-500 shadow-sm">
                          {post.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 ${post.iconBg} rounded-md flex items-center justify-center text-white shrink-0 shadow-sm`}
                        >
                          <post.icon size={12} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {post.readTime}
                          </span>
                          <span>{post.date}</span>
                        </div>
                        <span className="text-xs font-bold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {/* Newsletter CTA */}
        <div className="mt-12 bg-red-50 border-2 border-red-500 rounded-3xl p-8 text-center text-slate-900 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300">
          <BookOpen size={32} className="mx-auto text-red-500" />
          <h3 className="text-xl font-bold text-slate-900">
            Want More PDF Tips?
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Explore all our free PDF tools and start working smarter with your
            documents today.
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-red-500/20"
            >
              Try All 22+ Free Tools <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
