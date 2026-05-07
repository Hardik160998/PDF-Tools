"use client";

import { usePathname } from "next/navigation";

const ALL_TOOLS: Record<string, { label: string; color: string }> = {
  "/tool/merge":            { label: "Merge PDF",                          color: "#f26522" },
  "/tool/split":            { label: "Split PDF",                          color: "#f26522" },
  "/tool/compress":         { label: "Compress PDF",                       color: "#22c55e" },
  "/tool/organize":         { label: "Organize PDF",                       color: "#f26522" },
  "/tool/extract-pages":    { label: "Extract PDF Pages",                  color: "#f26522" },
  "/tool/delete-pages":     { label: "Delete PDF Pages",                   color: "#f26522" },
  "/tool/add-blank-page":   { label: "Add Blank Page",                     color: "#f26522" },
  "/tool/compare-pdf":      { label: "Compare PDF",                        color: "#f26522" },
  "/tool/optimize-pdf":     { label: "Optimize PDF",                       color: "#22c55e" },
  "/tool/repair-pdf":       { label: "Repair PDF",                         color: "#22c55e" },
  "/tool/extract-text":     { label: "PDF to Text",                        color: "#3182ce" },
  "/tool/ocr-pdf":          { label: "OCR PDF",                            color: "#3182ce" },
  "/tool/pdf-to-xml":       { label: "PDF to XML",                         color: "#3182ce" },
  "/tool/pdf-to-jpg":       { label: "PDF to JPG",                         color: "#3182ce" },
  "/tool/jpg-to-pdf":       { label: "JPG to PDF",                         color: "#3182ce" },
  "/tool/word-to-pdf":      { label: "Word to PDF",                        color: "#3182ce" },
  "/tool/pdf-to-word":      { label: "PDF to Word",                        color: "#3182ce" },
  "/tool/docx-to-pdf":      { label: "DOCX to PDF",                        color: "#3182ce" },
  "/tool/pdf-to-docx":      { label: "PDF to DOCX",                        color: "#3182ce" },
  "/tool/ppt-to-pdf":       { label: "PowerPoint to PDF",                  color: "#3182ce" },
  "/tool/pdf-to-ppt":       { label: "PDF to PowerPoint",                  color: "#3182ce" },
  "/tool/excel-to-pdf":     { label: "Excel to PDF",                       color: "#3182ce" },
  "/tool/pdf-to-excel":     { label: "PDF to Excel",                       color: "#3182ce" },
  "/tool/html-to-pdf":      { label: "HTML to PDF",                        color: "#3182ce" },
  "/tool/webpage-to-pdf":   { label: "Webpage to PDF",                     color: "#3182ce" },
  "/tool/jpg-to-png":       { label: "JPG to PNG",                         color: "#06b6d4" },
  "/tool/png-to-jpg":       { label: "PNG to JPG",                         color: "#06b6d4" },
  "/tool/jpg-to-webp":      { label: "JPG to WebP",                        color: "#06b6d4" },
  "/tool/webp-to-jpg":      { label: "WebP to JPG",                        color: "#06b6d4" },
  "/tool/png-to-webp":      { label: "PNG to WebP",                        color: "#06b6d4" },
  "/tool/webp-to-png":      { label: "WebP to PNG",                        color: "#06b6d4" },
  "/tool/jpg-to-avif":      { label: "JPG to AVIF",                        color: "#06b6d4" },
  "/tool/avif-to-jpg":      { label: "AVIF to JPG",                        color: "#06b6d4" },
  "/tool/png-to-avif":      { label: "PNG to AVIF",                        color: "#06b6d4" },
  "/tool/avif-to-png":      { label: "AVIF to PNG",                        color: "#06b6d4" },
  "/tool/webp-to-avif":     { label: "WebP to AVIF",                       color: "#06b6d4" },
  "/tool/avif-to-webp":     { label: "AVIF to WebP",                       color: "#06b6d4" },
  "/tool/watermark":        { label: "Watermark PDF",                      color: "#E8465D" },
  "/tool/page-numbers":     { label: "Page Numbers",                       color: "#E8465D" },
  "/tool/metadata":         { label: "Edit Metadata",                      color: "#E8465D" },
  "/tool/flatten-pdf":      { label: "Flatten PDF",                        color: "#E8465D" },
  "/tool/remove-ocr":       { label: "Remove OCR",                         color: "#E8465D" },
  "/tool/bookmark-pdf":     { label: "Bookmark PDF",                       color: "#E8465D" },
  "/tool/redact-pdf":       { label: "Redact PDF",                         color: "#e53e3e" },
  "/tool/unlock":           { label: "Unlock PDF",                         color: "#e53e3e" },
  "/tool/protect":          { label: "Protect PDF",                        color: "#e53e3e" },
  "/tool/aadhar-crop":      { label: "Aadhar Cropper",                     color: "#ef4444" },
  "/tool/crop-pdf":         { label: "Crop PDF",                           color: "#ef4444" },
  "/tool/meesho-cropper":   { label: "Meesho Label with Invoice Cropper",  color: "#f26522" },
  "/tool/meshocrop":        { label: "Meesho Crop Label (without invoice)", color: "#f26522" },
  "/tool/flipkart-cropper": { label: "Flipkart Label Cropper",             color: "#F7941D" },
  "/esign":                 { label: "E-Sign PDF",                         color: "#8b5cf6" },
  "/edit":                  { label: "Edit PDF",                           color: "#E8465D" },
};

export default function ActiveToolNav() {
  const pathname = usePathname();
  const tool = ALL_TOOLS[pathname];
  if (!tool) return null;

  return (
    <span
      className="active-tool-nav-pill"
      style={{ color: tool.color, borderColor: tool.color, background: `${tool.color}12` }}
    >
      {tool.label}
    </span>
  );
}
