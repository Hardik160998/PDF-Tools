import {
  Combine, Scissors, FileText, Settings, Lock,
  Stamp, Zap, Type, ImageIcon, Wand2, Crop,
  FileDigit, FileJson, FileSymlink, Unlock,
  Presentation, FileSpreadsheet, Globe, LifeBuoy, PenLine, Layers, GitCompare, EyeOff, Bookmark, ScanText, ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ToolMeta {
  icon: LucideIcon;
  description: string;
}

export const TOOL_META: Record<string, ToolMeta> = {
  "compare-pdf":   { icon: GitCompare, description: "Compare two PDF files side by side and instantly spot which pages changed. 100% private." },
  "extract-pages": { icon: Layers, description: "Pick individual pages or a range and download them as a new PDF. 100% private, runs in your browser." },
  "delete-pages":  { icon: Scissors, description: "Select and permanently remove unwanted pages from your PDF. Fast, private, runs in your browser." },
  "add-blank-page":{ icon: Layers, description: "Insert blank pages at the beginning, end, or after any page in your PDF. Choose size and count." },
  "flatten-pdf":   { icon: Layers, description: "Merge all form fields, annotations and layers into a flat, non-editable PDF. 100% private." },
  "optimize-pdf":  { icon: Zap, description: "Reduce PDF file size by re-compressing pages. Choose Low, Medium or High quality. 100% private." },
  "organize":      { icon: FileSymlink, description: "Sort, add and delete PDF pages. Rotate PDF pages and reorder them at your convenience." },
  "merge":         { icon: Combine, description: "Combine PDFs in the order you want with the easiest PDF merger available." },
  "split":         { icon: Scissors, description: "Separate one page or a whole set for easy conversion into independent PDF files." },
  "compress":      { icon: Zap, description: "Reduce file size while optimizing for maximal PDF quality." },
  "repair-pdf":    { icon: LifeBuoy, description: "Recover data from damaged, corrupted or illegible PDF files." },
  "extract-text":  { icon: Type, description: "Easily convert your PDF files into easy to edit text documents." },
  "ocr-pdf":       { icon: ScanText, description: "Make scanned PDFs selectable and searchable. Add an invisible text layer with OCR — 100% in-browser." },
  "remove-ocr":    { icon: EyeOff, description: "Strip the text layer from a selectable PDF and convert it to a non-selectable image-only file." },
  "pdf-to-xml":    { icon: FileJson, description: "Extract structured data from your PDF into XML machine readable format." },
  "pdf-to-jpg":    { icon: ImageIcon, description: "Convert each PDF page into a JPG or extract all images contained in a PDF." },
  "jpg-to-pdf":    { icon: ImageIcon, description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins." },
  "jpg-to-png":    { icon: ImageIcon, description: "Convert JPG images to lossless PNG format instantly. Preserves quality and enables transparency." },
  "png-to-jpg":    { icon: ImageIcon, description: "Convert PNG images to JPG format for smaller file sizes and universal compatibility." },
  "jpg-to-webp":   { icon: ImageIcon, description: "Convert JPG images to modern WebP format for superior compression and faster web loading." },
  "webp-to-jpg":   { icon: ImageIcon, description: "Convert WebP images to universally compatible JPG format instantly." },
  "png-to-webp":   { icon: ImageIcon, description: "Convert PNG images to WebP for smaller file sizes without visible quality loss." },
  "webp-to-png":   { icon: ImageIcon, description: "Convert WebP images to lossless PNG format for maximum compatibility and editing." },
  "jpg-to-avif":   { icon: ImageIcon, description: "Convert JPG images to next-gen AVIF format for superior compression and modern browser support." },
  "avif-to-jpg":   { icon: ImageIcon, description: "Convert AVIF images to universally compatible JPG format instantly." },
  "png-to-avif":   { icon: ImageIcon, description: "Convert PNG images to AVIF for smaller file sizes with excellent quality retention." },
  "avif-to-png":   { icon: ImageIcon, description: "Convert AVIF images to lossless PNG format for maximum compatibility." },
  "webp-to-avif":  { icon: ImageIcon, description: "Convert WebP images to next-gen AVIF format for even better compression." },
  "avif-to-webp":  { icon: ImageIcon, description: "Convert AVIF images to WebP format for broad browser compatibility." },
  "word-to-pdf":   { icon: FileText, description: "Make DOC and DOCX files easy to read by converting them to PDF." },
  "pdf-to-word":   { icon: FileText, description: "Convert your PDF documents to editable DOCX files with high accuracy." },
  "docx-to-pdf":   { icon: FileText, description: "Convert .doc and .docx files to PDF with fonts, images, and formatting perfectly preserved." },
  "pdf-to-docx":   { icon: FileText, description: "Convert any PDF into a fully editable DOCX file ready to edit in Word or Google Docs." },
  "ppt-to-pdf":    { icon: Presentation, description: "Make PPT and PPTX slideshows easy to view by converting them to PDF." },
  "pdf-to-ppt":    { icon: Presentation, description: "Convert your PDF documents into editable PPTX presentations." },
  "excel-to-pdf":  { icon: FileSpreadsheet, description: "Make EXCEL spreadsheets easy to read by converting them to PDF." },
  "pdf-to-excel":  { icon: FileSpreadsheet, description: "Convert your PDF documents into editable XLSX spreadsheets with table extraction." },
  "html-to-pdf":   { icon: Globe, description: "Convert web pages or HTML files into PDF documents with high fidelity." },
  "webpage-to-pdf":{ icon: Globe, description: "Paste any URL and convert a live webpage to a pixel-perfect PDF instantly." },
  "bookmark-pdf":  { icon: Bookmark, description: "Add a clickable table of contents to any PDF. Create, edit and reorder bookmarks instantly." },
  "watermark":     { icon: Stamp, description: "Stamp an image or text over your PDF in seconds. Choose typography, transparency and position." },
  "page-numbers":  { icon: FileDigit, description: "Add page numbers to PDFs with ease. Choose position, dimensions, typography and size." },
  "metadata":      { icon: Settings, description: "Add, change or remove metadata fields including Author, Title, and Subject." },
  "redact-pdf":    { icon: EyeOff, description: "Permanently hide sensitive text and areas with black boxes. Draw or search to redact." },
  "unlock":        { icon: Unlock, description: "Remove PDF password security, giving you the freedom to use your PDFs as you want." },
  "protect":       { icon: Lock, description: "Encrypt PDF with a password. Manage PDF permissions and access control." },
  "aadhar-crop":   { icon: Wand2, description: "Perfectly crop Aadhar ID cards from e-Aadhar PDF for high quality printing." },
  "crop-pdf":      { icon: Crop, description: "Trim margins and crop any pages of your PDF. Select pages, set margins and download instantly." },
  "meesho-cropper":{ icon: ShoppingBag, description: 'Auto-remove the invoice section below "Total" from Meesho shipping label PDFs. Clean labels in one click.' },
  "meshocrop":     { icon: ShoppingBag, description: "Crop Meesho labels to keep only shipping address, return address & barcodes. Removes TAX INVOICE section." },
  "flipkart-cropper":{ icon: ShoppingBag, description: "Smart OCR crop for Flipkart / E-kart shipping labels. Keeps AWB, QR code & barcode. Removes invoice & billing." },
  "amazon-cropper":{ icon: ShoppingBag, description: "Extract Amazon shipping labels and automatically remove invoice pages. Supports AWB & SKU sorting." },
  "snapdeal-cropper":{ icon: ShoppingBag, description: "Smart border detection to crop Snapdeal shipping labels perfectly. Protects barcodes, address and quantities." },
  "esign":         { icon: PenLine, description: "Draw or type your signature and place it anywhere on a PDF or image. Download the signed file instantly." },
  "edit-pdf":      { icon: PenLine, description: "Highlight, draw, add text and freehand annotations directly on PDFs. Zero uploads, 100% private." },
};

export interface PriorityTool {
  id: string;
  title: string;
  desc: string;
  gradient: string;
  href?: string;
}

export const PRIORITY_TOOLS: PriorityTool[] = [
  { id: "merge",        title: "Merge PDF",    desc: "Combine multiple PDFs into one.",              gradient: "linear-gradient(135deg,#f26522,#c2410c)" },
  { id: "compress",     title: "Compress PDF", desc: "Reduce file size instantly.",                  gradient: "linear-gradient(135deg,#22c55e,#15803d)" },
  { id: "pdf-to-word",  title: "PDF to Word",  desc: "Convert PDF to editable DOCX.",                gradient: "linear-gradient(135deg,#3182ce,#1e3a8a)" },
  { id: "split",        title: "Split PDF",    desc: "Divide PDF into separate files.",              gradient: "linear-gradient(135deg,#f26522,#c2410c)" },
  { id: "edit-pdf",     title: "Edit PDF",     desc: "Annotate, highlight & draw on PDFs.",          gradient: "linear-gradient(135deg,#E8465D,#843286)", href: "/edit" },
  { id: "crop-pdf",     title: "Crop PDF",     desc: "Trim margins from any PDF page.",              gradient: "linear-gradient(135deg,#ef4444,#991b1b)" },
  { id: "protect",      title: "Protect PDF",  desc: "Encrypt PDF with a password.",                 gradient: "linear-gradient(135deg,#e53e3e,#7f1d1d)" },
  { id: "unlock",       title: "Unlock PDF",   desc: "Remove PDF password protection.",              gradient: "linear-gradient(135deg,#e53e3e,#7f1d1d)" },
  { id: "redact-pdf",   title: "Redact PDF",   desc: "Permanently hide sensitive content.",          gradient: "linear-gradient(135deg,#e53e3e,#7f1d1d)" },
  { id: "ocr-pdf",      title: "OCR PDF",      desc: "Make scanned PDFs searchable.",                gradient: "linear-gradient(135deg,#3182ce,#1e3a8a)" },
];

export const CATEGORY_ORDER = ["Organize", "Optimize", "Convert", "Image Convert", "Edit", "Security", "Special", "Ecommerce", "Sign"];
