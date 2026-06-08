import { HelpCircle, Shield, Zap, FileText, Settings } from 'lucide-react';

export const CATEGORIES = [
  {
    id: "general",
    label: "General",
    icon: HelpCircle,
    color: "bg-blue-500",
    faqs: [
      {
        q: "What is SmartPDFs Plus?",
        a: "SmartPDFs Plus is a free, browser-based PDF toolkit with 22+ tools. You can merge, split, compress, convert, organize, watermark, protect, and repair PDF files — all without installing any software or creating an account.",
      },
      {
        q: "Is SmartPDFs Plus completely free?",
        a: "Yes! All client-side tools (Merge, Split, Compress, Organize, Watermark, Page Numbers, Edit Metadata, PDF to JPG, JPG to PDF, PDF to Text, PDF to XML, Unlock, Protect, Aadhar Cropper) are 100% free with no sign-up required. Server-side tools (Word/Excel/PowerPoint conversions, Repair PDF) are also free but require an internet connection.",
      },
      {
        q: "Do I need to create an account?",
        a: "No account is needed for any tool. Just open the tool page, upload your file, and download the result. It's that simple.",
      },
      {
        q: "What browsers are supported?",
        a: "SmartPDFs Plus works on all modern browsers — Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend Chrome or Edge for the best performance. Internet Explorer is not supported.",
      },
      {
        q: "Can I use SmartPDFs Plus on mobile?",
        a: "Yes! SmartPDFs Plus is fully responsive and optimized for mobile. All tools work on iOS (Safari, Chrome) and Android (Chrome, Firefox). The Organize PDF tool even supports touch drag-and-drop for reordering pages.",
      },
      {
        q: "Are my PDF files secure on SmartPDFPro?",
        a: "Absolutely. All uploaded files are processed securely and automatically deleted after processing to protect user privacy.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: Shield,
    color: "bg-green-500",
    faqs: [
      {
        q: "Are my files safe and private?",
        a: "Absolutely. Client-side tools (Merge, Split, Compress, Organize, Watermark, etc.) process your files entirely in your browser using JavaScript — your files never leave your device and are never uploaded to any server.",
      },
      {
        q: "Which tools upload files to a server?",
        a: "Only server-side tools require file upload: Word to PDF, PDF to Word, Excel to PDF, PDF to Excel, PowerPoint to PDF, PDF to PowerPoint, HTML to PDF, and Repair PDF. These use ConvertAPI for processing. Files are transmitted over encrypted HTTPS and deleted immediately after processing.",
      },
      {
        q: "Do you store or read my PDF files?",
        a: "No. For client-side tools, files never leave your browser. For server-side tools, files are processed and automatically deleted within 1 hour. We do not read, analyze, or retain any file content.",
      },
      {
        q: "Is the Aadhar PDF safe to upload?",
        a: "Yes. The Aadhar Cropper tool is 100% client-side — your Aadhar PDF is processed entirely in your browser and never uploaded to any server. Your personal data stays on your device.",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools & Features",
    icon: Zap,
    color: "bg-orange-500",
    faqs: [
      {
        q: "How do I merge multiple PDFs?",
        a: 'Go to Merge PDF → click "Select PDF Files" to upload multiple files → drag to reorder them if needed → click "Merge PDF" → download the combined file. You can add as many files as you want.',
      },
      {
        q: "How do I split a PDF into parts?",
        a: 'Go to Split PDF → upload your PDF → choose "Divide in Parts" (split into 2, 3, or 4 equal parts) or "Extract All Pages" (each page becomes a separate PDF) → click "Split PDF" → download the ZIP file containing all parts.',
      },
      {
        q: "How does the Organize PDF tool work?",
        a: 'Go to Organize PDF → upload one or more PDFs → thumbnails of all pages appear → drag and drop pages to reorder them → use the rotate button on each page to rotate 90° → delete unwanted pages → click "Organize PDF" to download the reorganized document.',
      },
      {
        q: "Can I compress a PDF without losing quality?",
        a: "Our Compress PDF tool uses object stream optimization and metadata stripping to reduce file size. Results vary by file — text-heavy PDFs compress well, while image-heavy PDFs may see smaller reductions. The visual quality of content is preserved.",
      },
      {
        q: "How do I add a watermark to a PDF?",
        a: 'Go to Watermark → upload your PDF → choose "Text" (type your watermark text like "CONFIDENTIAL") or "Image" (upload a logo PNG/JPG) → click "Apply Watermark" → download the watermarked PDF. The watermark is centered on every page.',
      },
      {
        q: "How do I convert Word/Excel/PowerPoint to PDF?",
        a: 'Go to the respective tool (e.g., Word to PDF) → upload your file → click "Convert" → download the PDF. These tools require an internet connection as they use our cloud conversion service. Supported formats: .docx, .xlsx, .pptx, .html.',
      },
      {
        q: "What is the Aadhar Cropper tool?",
        a: "The Aadhar Cropper is a specialized tool for Indian users. Upload your e-Aadhar PDF → crop the front side of the card → crop the back side → download a print-ready A4 PDF with both sides formatted to standard ID card dimensions (86mm × 54mm). Everything runs in your browser — completely private.",
      },
      {
        q: "How do I unlock a password-protected PDF?",
        a: 'Go to Unlock PDF → upload your encrypted PDF → enter the current password → click "Unlock PDF" → download the unlocked version. Note: You must know the password — this tool removes protection from PDFs you own.',
      },
      {
        q: "Can I export labels as PNG files?",
        a: "Yes, SmartPDFPro supports PNG export for shipping labels and ecommerce workflows.",
      },
      {
        q: "Is signup required to use SmartPDFPro?",
        a: "No, most SmartPDFPro tools work instantly without registration or login.",
      },
      {
        q: "Can SmartPDFPro unlock password-protected PDFs?",
        a: "Yes, SmartPDFPro provides secure PDF unlock and protection tools.",
      },
      {
        q: "What file formats can SmartPDFPro convert?",
        a: "SmartPDFPro supports PDF, Word, Excel, JPG, PNG, PowerPoint, and multiple image conversion formats.",
      },
      {
        q: "Is SmartPDFPro suitable for students and businesses?",
        a: "Yes, SmartPDFPro is ideal for students, teachers, office professionals, ecommerce sellers, and businesses.",
      },
      {
        q: "Why choose SmartPDFPro over other PDF tools?",
        a: "SmartPDFPro combines powerful PDF utilities with ecommerce warehouse automation tools in one fast, secure, and easy-to-use platform.",
      },
    ],
  },
  {
    id: "files",
    label: "File Formats & Limits",
    icon: FileText,
    color: "bg-purple-500",
    faqs: [
      {
        q: "What file formats does SmartPDFs support?",
        a: "Input: PDF, DOCX, XLSX, PPTX, HTML, JPG, PNG, JPEG. Output: PDF, DOCX, XLSX, PPTX, JPG, TXT, XML, ZIP. The primary format is PDF — most tools work with PDF as both input and output.",
      },
      {
        q: "Is there a file size limit?",
        a: "Client-side tools: No hard limit — depends on your device's RAM. Most modern devices handle PDFs up to 200–500MB easily. Server-side tools (Office conversions, Repair): 100MB per file limit.",
      },
      {
        q: "How many files can I process at once?",
        a: "Merge PDF: Unlimited files. Organize PDF: Unlimited files (all pages shown as thumbnails). Repair PDF: Multiple files at once. Split PDF: One file at a time. JPG to PDF: Multiple images at once.",
      },
      {
        q: "Can I process password-protected PDFs?",
        a: "Most tools require the PDF to be unlocked first. Use the Unlock PDF tool to remove the password, then use any other tool. The Unlock PDF tool itself accepts encrypted PDFs — just provide the password.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    icon: Settings,
    color: "bg-slate-600",
    faqs: [
      {
        q: "What technology powers SmartPDFs Plus?",
        a: "SmartPDFs Plus is built with Next.js 16, React, and TypeScript. Client-side PDF processing uses pdf-lib (for creating/editing PDFs) and PDF.js (for rendering/reading PDFs). Office conversions use ConvertAPI. The UI is styled with Tailwind CSS.",
      },
      {
        q: "Why does the page show a loading skeleton?",
        a: "Each tool page loads its JavaScript bundle on demand (lazy loading). The skeleton/shimmer animation shows while the tool is loading — this keeps the initial page load fast. It typically takes less than 1 second.",
      },
      {
        q: "The tool is not working. What should I do?",
        a: "Try these steps: 1) Refresh the page. 2) Try a different browser (Chrome recommended). 3) Check if your PDF is password-protected (unlock it first). 4) For large files, try a smaller file first. 5) If the issue persists, contact us at smartpdfpro@gmail.com.",
      },
      {
        q: "Does SmartPDFs work offline?",
        a: "Client-side tools (Merge, Split, Compress, Organize, Watermark, etc.) work offline once the page is loaded — no internet needed for processing. Server-side tools (Office conversions, Repair) require an active internet connection.",
      },
    ],
  },
];