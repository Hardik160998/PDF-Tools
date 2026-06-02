/**
 * Centralized Tool Metadata Configuration
 * Used for SEO: title, description, keywords, FAQ, and JSON-LD schemas.
 * Domain: https://smartpdfpro.com
 */

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolMeta {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  faqs: ToolFAQ[];
}

const BASE_URL = 'https://smartpdfpro.com';

export const TOOL_META_MAP: Record<string, ToolMeta> = {
  // ── Organize ──────────────────────────────────────────────────────────────
  merge: {
    slug: 'merge',
    title: 'Merge PDF',
    description: 'Merge multiple PDF files into one PDF online for free. Combine PDFs in seconds with no quality loss.',
    keywords: 'merge pdf, combine pdf, join pdf, merge pdf online free, pdf merger',
    faqs: [
      { question: 'Is there a file size limit for merging?', answer: 'No hard limit — processing happens locally in your browser. Very large files may slow down on low-RAM devices.' },
      { question: 'Can I merge password-protected PDFs?', answer: 'Yes, but you must unlock them first. The tool will prompt you if a file is locked.' },
      { question: 'Will merging reduce quality?', answer: 'No. Files are combined without re-encoding images or stripping data.' },
      { question: 'Do I need to install software?', answer: 'No. The merge tool works entirely in your browser.' },
      { question: 'Are my files secure?', answer: 'Yes. Merging happens locally — your files never touch our servers.' },
    ],
  },
  split: {
    slug: 'split',
    title: 'Split PDF',
    description: 'Split a PDF into multiple files online for free. Extract individual pages or page ranges instantly.',
    keywords: 'split pdf, split pdf online, extract pages from pdf, pdf splitter',
    faqs: [
      { question: 'Can I split by page range?', answer: 'Yes. You can define custom ranges such as 1-3, 5, 7-9.' },
      { question: 'Does splitting affect quality?', answer: 'No. Pages are extracted as-is without any re-compression.' },
      { question: 'Are my files uploaded to a server?', answer: 'No. All splitting happens client-side in your browser.' },
    ],
  },
  organize: {
    slug: 'organize',
    title: 'Organize PDF Pages',
    description: 'Reorder, rotate, and delete PDF pages online for free. Drag and drop to rearrange your PDF.',
    keywords: 'organize pdf, reorder pdf pages, rearrange pdf, pdf page organizer',
    faqs: [
      { question: 'Can I rearrange pages by dragging?', answer: 'Yes. Drag and drop thumbnails to reorder pages.' },
      { question: 'Can I delete specific pages?', answer: 'Yes. Select any page and remove it before saving.' },
      { question: 'Is there a page limit?', answer: 'No hard limit. Large PDFs may load slower depending on your device.' },
    ],
  },
  'delete-pages': {
    slug: 'delete-pages',
    title: 'Delete PDF Pages',
    description: 'Delete specific pages from a PDF online for free. Remove unwanted pages instantly in your browser.',
    keywords: 'delete pdf pages, remove pages from pdf, pdf page remover',
    faqs: [
      { question: 'Can I delete multiple pages at once?', answer: 'Yes. Select all pages you want removed and delete them in one action.' },
      { question: 'Will the file lose quality?', answer: 'No. Remaining pages are kept in their original quality.' },
    ],
  },
  'extract-pages': {
    slug: 'extract-pages',
    title: 'Extract PDF Pages',
    description: 'Extract specific pages from a PDF and save them as a new PDF file online for free.',
    keywords: 'extract pdf pages, extract pages from pdf, pdf page extractor',
    faqs: [
      { question: 'Can I extract a range of pages?', answer: 'Yes. Specify individual pages or a continuous range.' },
      { question: 'Is the extracted file high quality?', answer: 'Yes. Pages are extracted without any re-compression.' },
    ],
  },
  'add-blank-page': {
    slug: 'add-blank-page',
    title: 'Add Blank Page to PDF',
    description: 'Add blank pages to any position in your PDF online for free. Insert pages before or after any page.',
    keywords: 'add blank page to pdf, insert page in pdf, add page to pdf',
    faqs: [
      { question: 'Can I insert a page in the middle?', answer: 'Yes. Choose any position to insert a blank page.' },
      { question: 'Does it work on all PDFs?', answer: 'Yes. It works on any valid PDF file.' },
    ],
  },

  // ── Optimize ──────────────────────────────────────────────────────────────
  compress: {
    slug: 'compress',
    title: 'Compress PDF',
    description: 'Compress PDF files online for free. Reduce PDF file size without losing quality.',
    keywords: 'compress pdf, reduce pdf size, pdf compressor, shrink pdf',
    faqs: [
      { question: 'How much can I reduce the file size?', answer: 'Depending on content, compression can reduce file size by 20–80%.' },
      { question: 'Will the quality be affected?', answer: 'Minor quality adjustments may occur on image-heavy PDFs, but text remains sharp.' },
      { question: 'Is it free?', answer: 'Yes, the compress tool is completely free with no watermarks.' },
    ],
  },
  'optimize-pdf': {
    slug: 'optimize-pdf',
    title: 'Optimize PDF',
    description: 'Optimize your PDF for web and print online for free. Reduce size and improve load times.',
    keywords: 'optimize pdf, pdf optimizer, reduce pdf size for web',
    faqs: [
      { question: 'What is the difference between compress and optimize?', answer: 'Compression focuses on file size reduction, while optimization also improves web loading performance.' },
    ],
  },
  'repair-pdf': {
    slug: 'repair-pdf',
    title: 'Repair PDF',
    description: 'Repair corrupted or damaged PDF files online for free. Fix broken PDFs instantly in your browser.',
    keywords: 'repair pdf, fix corrupted pdf, pdf repair tool, restore pdf',
    faqs: [
      { question: 'Can it fix all corrupted PDFs?', answer: 'It can fix most common corruption issues. Severely damaged files may not be fully recoverable.' },
      { question: 'Is my data safe?', answer: 'Yes. Repair processing is done locally in your browser.' },
    ],
  },

  // ── Convert ───────────────────────────────────────────────────────────────
  'pdf-to-word': {
    slug: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF to Word document online for free. Turn PDF into editable DOCX without losing formatting.',
    keywords: 'pdf to word, pdf to docx, convert pdf to word, pdf converter',
    faqs: [
      { question: 'Will formatting be preserved?', answer: 'Yes. The converter maintains the original layout, fonts, and structure.' },
      { question: 'Does it work with scanned PDFs?', answer: 'For scanned PDFs, use our OCR PDF tool first to extract text.' },
    ],
  },
  'pdf-to-docx': {
    slug: 'pdf-to-docx',
    title: 'PDF to DOCX',
    description: 'Convert PDF to DOCX format online for free. Get an editable Word document from any PDF.',
    keywords: 'pdf to docx, convert pdf to docx, pdf to word docx',
    faqs: [
      { question: 'What is the difference between DOC and DOCX?', answer: 'DOCX is the modern Word format. It is smaller and more compatible with current software.' },
    ],
  },
  'word-to-pdf': {
    slug: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF online for free. Turn DOCX files into PDF in seconds.',
    keywords: 'word to pdf, docx to pdf, convert word to pdf, word document converter',
    faqs: [
      { question: 'Does it preserve fonts and images?', answer: 'Yes. The resulting PDF preserves all formatting, images, and fonts from your Word document.' },
    ],
  },
  'docx-to-pdf': {
    slug: 'docx-to-pdf',
    title: 'DOCX to PDF',
    description: 'Convert DOCX to PDF online for free. Upload a Word document and download a perfect PDF.',
    keywords: 'docx to pdf, word to pdf, convert docx to pdf',
    faqs: [
      { question: 'Can I convert multiple DOCX files?', answer: 'Currently one file at a time is supported.' },
    ],
  },
  'excel-to-pdf': {
    slug: 'excel-to-pdf',
    title: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF online for free. Turn XLSX files into shareable PDFs.',
    keywords: 'excel to pdf, xlsx to pdf, convert excel to pdf, spreadsheet to pdf',
    faqs: [
      { question: 'Will all sheets be included?', answer: 'Yes. All sheets in the workbook are included in the PDF output.' },
    ],
  },
  'pdf-to-excel': {
    slug: 'pdf-to-excel',
    title: 'PDF to Excel',
    description: 'Convert PDF tables to Excel spreadsheet online for free. Extract data into editable XLSX.',
    keywords: 'pdf to excel, pdf to xlsx, convert pdf to excel, pdf table extractor',
    faqs: [
      { question: 'Can it extract complex tables?', answer: 'Yes. The tool can handle multi-column tables and merged cells.' },
    ],
  },
  'ppt-to-pdf': {
    slug: 'ppt-to-pdf',
    title: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF online for free. Turn PPTX into a shareable PDF.',
    keywords: 'ppt to pdf, powerpoint to pdf, convert pptx to pdf',
    faqs: [
      { question: 'Are animations preserved?', answer: 'Animations are not preserved in PDF. Slides are converted as static pages.' },
    ],
  },
  'pdf-to-ppt': {
    slug: 'pdf-to-ppt',
    title: 'PDF to PPT',
    description: 'Convert PDF to PowerPoint presentation online for free. Turn PDF pages into editable slides.',
    keywords: 'pdf to ppt, pdf to powerpoint, convert pdf to pptx',
    faqs: [
      { question: 'Can I edit the slides after conversion?', answer: 'Yes. The resulting PPTX file can be fully edited in PowerPoint or Google Slides.' },
    ],
  },
  'html-to-pdf': {
    slug: 'html-to-pdf',
    title: 'HTML to PDF',
    description: 'Convert HTML files or web pages to PDF online for free. Save any webpage as a PDF document.',
    keywords: 'html to pdf, webpage to pdf, convert html to pdf, web page pdf',
    faqs: [
      { question: 'Can I convert a live URL?', answer: 'Yes. Paste any public URL and the tool will capture it as a PDF.' },
    ],
  },
  'webpage-to-pdf': {
    slug: 'webpage-to-pdf',
    title: 'Webpage to PDF',
    description: 'Convert any webpage to PDF online for free. Enter a URL and download the page as a PDF file.',
    keywords: 'webpage to pdf, url to pdf, save webpage as pdf, web to pdf converter',
    faqs: [
      { question: 'Does it capture images and styles?', answer: 'Yes. The converter captures the full visual rendering of the page.' },
    ],
  },
  'pdf-to-jpg': {
    slug: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert PDF pages to JPG images online for free. Export every page as a high-quality JPEG.',
    keywords: 'pdf to jpg, pdf to jpeg, convert pdf to image, pdf to jpg converter',
    faqs: [
      { question: 'Can I convert all pages at once?', answer: 'Yes. All pages are converted and bundled into a ZIP for download.' },
      { question: 'What resolution are the images?', answer: 'Images are exported at 150 DPI by default for a good balance of quality and size.' },
    ],
  },
  'jpg-to-pdf': {
    slug: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Convert JPG images to PDF online for free. Combine multiple JPG files into one PDF instantly.',
    keywords: 'jpg to pdf, jpeg to pdf, image to pdf, convert jpg to pdf',
    faqs: [
      { question: 'Can I convert multiple JPGs?', answer: 'Yes. Select multiple images and they will be combined into one PDF in order.' },
      { question: 'Is there a quality loss?', answer: 'No. JPG images are embedded at their original quality.' },
    ],
  },
  'pdf-to-xml': {
    slug: 'pdf-to-xml',
    title: 'PDF to XML',
    description: 'Convert PDF to XML format online for free. Extract structured data from PDF documents.',
    keywords: 'pdf to xml, convert pdf to xml, pdf data extraction',
    faqs: [
      { question: 'What data is extracted to XML?', answer: 'Text content, page structure, and metadata are exported into a structured XML format.' },
    ],
  },

  // ── Image Convert ─────────────────────────────────────────────────────────
  'jpg-to-png': {
    slug: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format online for free. Get lossless PNG output from any JPEG.',
    keywords: 'jpg to png, jpeg to png, convert jpg to png, image converter',
    faqs: [
      { question: 'Will I lose quality converting to PNG?', answer: 'No. PNG is a lossless format, so your image will be identical or better than the original JPG.' },
    ],
  },
  'png-to-jpg': {
    slug: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format online for free. Reduce image size with JPG compression.',
    keywords: 'png to jpg, png to jpeg, convert png to jpg, image converter',
    faqs: [
      { question: 'Is there a quality loss?', answer: 'JPG uses lossy compression. A minimal quality reduction may occur, but you can control the quality level.' },
    ],
  },
  'jpg-to-webp': { slug: 'jpg-to-webp', title: 'JPG to WebP', description: 'Convert JPG images to WebP format online for free. Get smaller, faster web images.', keywords: 'jpg to webp, jpeg to webp, convert jpg to webp', faqs: [{ question: 'Why convert to WebP?', answer: 'WebP is a modern image format that provides better compression than JPEG and PNG with similar quality.' }] },
  'webp-to-jpg': { slug: 'webp-to-jpg', title: 'WebP to JPG', description: 'Convert WebP images to JPG format online for free. Turn WebP into a universally supported JPEG.', keywords: 'webp to jpg, webp to jpeg, convert webp to jpg', faqs: [{ question: 'Why convert WebP to JPG?', answer: 'JPG has broader compatibility with older software and devices that do not support WebP.' }] },
  'png-to-webp': { slug: 'png-to-webp', title: 'PNG to WebP', description: 'Convert PNG images to WebP format online for free. Optimize PNGs for the web.', keywords: 'png to webp, convert png to webp, image optimizer', faqs: [] },
  'webp-to-png': { slug: 'webp-to-png', title: 'WebP to PNG', description: 'Convert WebP images to PNG format online for free. Get a lossless PNG from any WebP file.', keywords: 'webp to png, convert webp to png', faqs: [] },
  'jpg-to-avif': { slug: 'jpg-to-avif', title: 'JPG to AVIF', description: 'Convert JPG images to AVIF format online for free. Get ultra-compressed, high-quality images.', keywords: 'jpg to avif, jpeg to avif, convert jpg to avif', faqs: [] },
  'avif-to-jpg': { slug: 'avif-to-jpg', title: 'AVIF to JPG', description: 'Convert AVIF images to JPG format online for free. Turn AVIF into widely supported JPEG.', keywords: 'avif to jpg, avif to jpeg, convert avif to jpg', faqs: [] },
  'png-to-avif': { slug: 'png-to-avif', title: 'PNG to AVIF', description: 'Convert PNG images to AVIF format online for free. Compress images with next-gen AVIF encoding.', keywords: 'png to avif, convert png to avif', faqs: [] },
  'avif-to-png': { slug: 'avif-to-png', title: 'AVIF to PNG', description: 'Convert AVIF images to PNG format online for free. Get a lossless PNG from an AVIF file.', keywords: 'avif to png, convert avif to png', faqs: [] },
  'webp-to-avif': { slug: 'webp-to-avif', title: 'WebP to AVIF', description: 'Convert WebP images to AVIF format online for free. Further compress your web images.', keywords: 'webp to avif, convert webp to avif', faqs: [] },
  'avif-to-webp': { slug: 'avif-to-webp', title: 'AVIF to WebP', description: 'Convert AVIF images to WebP format online for free. Export AVIF as a compatible WebP file.', keywords: 'avif to webp, convert avif to webp', faqs: [] },

  // ── Edit ──────────────────────────────────────────────────────────────────
  watermark: {
    slug: 'watermark',
    title: 'Watermark PDF',
    description: 'Add a text or image watermark to every page of your PDF online for free.',
    keywords: 'watermark pdf, add watermark to pdf, pdf watermark tool',
    faqs: [
      { question: 'Can I use an image as a watermark?', answer: 'Yes. Upload any PNG/JPG and place it as a watermark on your PDF pages.' },
      { question: 'Can I control opacity?', answer: 'Yes. You can adjust watermark transparency from 0% to 100%.' },
    ],
  },
  'page-numbers': {
    slug: 'page-numbers',
    title: 'Add Page Numbers to PDF',
    description: 'Add page numbers to any position in your PDF online for free. Customize font, size, and position.',
    keywords: 'add page numbers to pdf, pdf page numbering, page number tool',
    faqs: [
      { question: 'Can I choose starting number?', answer: 'Yes. You can start page numbering from any number.' },
      { question: 'Can I pick the position?', answer: 'Yes. Place numbers at top-left, top-center, top-right, or their bottom equivalents.' },
    ],
  },
  metadata: {
    slug: 'metadata',
    title: 'Edit PDF Metadata',
    description: 'Edit PDF metadata online for free. Update title, author, subject, and keywords of any PDF.',
    keywords: 'edit pdf metadata, pdf metadata editor, change pdf properties',
    faqs: [
      { question: 'What metadata can I edit?', answer: 'You can edit the Title, Author, Subject, Keywords, and Creator fields.' },
      { question: 'Does editing metadata affect the PDF content?', answer: 'No. Only the document properties are changed — the content remains untouched.' },
    ],
  },
  'bookmark-pdf': {
    slug: 'bookmark-pdf',
    title: 'Add Bookmarks to PDF',
    description: 'Add bookmarks and a table of contents to your PDF online for free.',
    keywords: 'add bookmarks to pdf, pdf bookmark tool, pdf table of contents',
    faqs: [
      { question: 'Can I create nested bookmarks?', answer: 'Yes. Bookmarks can be organized in a hierarchical structure.' },
    ],
  },
  'flatten-pdf': {
    slug: 'flatten-pdf',
    title: 'Flatten PDF',
    description: 'Flatten PDF form fields and annotations into static page content online for free.',
    keywords: 'flatten pdf, flatten pdf form, pdf flattener, convert form to static pdf',
    faqs: [
      { question: 'Why flatten a PDF?', answer: 'Flattening makes form data and annotations permanent so they cannot be edited or removed.' },
    ],
  },
  'redact-pdf': {
    slug: 'redact-pdf',
    title: 'Redact PDF',
    description: 'Permanently redact sensitive text and images from your PDF online for free.',
    keywords: 'redact pdf, pdf redaction tool, black out pdf text, remove sensitive content',
    faqs: [
      { question: 'Is redaction permanent?', answer: 'Yes. Once saved, redacted content cannot be recovered.' },
      { question: 'Can I redact images too?', answer: 'Yes. Draw a redaction box over any image area to permanently remove it.' },
    ],
  },
  'remove-ocr': {
    slug: 'remove-ocr',
    title: 'Remove OCR from PDF',
    description: 'Remove the OCR text layer from a scanned PDF online for free. Revert to image-only PDF.',
    keywords: 'remove ocr from pdf, strip text layer pdf, flatten ocr pdf',
    faqs: [
      { question: 'When would I want to remove OCR?', answer: 'If the OCR layer contains errors, removing it gives you a clean scanned image PDF.' },
    ],
  },
  'crop-pdf': {
    slug: 'crop-pdf',
    title: 'Crop PDF',
    description: 'Crop PDF pages online for free. Remove margins and whitespace from any PDF page.',
    keywords: 'crop pdf, crop pdf pages, pdf crop tool, trim pdf margins',
    faqs: [
      { question: 'Can I crop all pages at once?', answer: 'Yes. Apply the same crop to all pages in a single action.' },
      { question: 'Can I set custom crop dimensions?', answer: 'Yes. Enter exact margins in millimeters for precise cropping.' },
    ],
  },
  'compare-pdf': {
    slug: 'compare-pdf',
    title: 'Compare PDF',
    description: 'Compare two PDF files side by side online for free. Highlight differences between PDF documents.',
    keywords: 'compare pdf, pdf diff tool, find differences in pdf, pdf comparison',
    faqs: [
      { question: 'What differences can it detect?', answer: 'The tool highlights text changes, additions, and deletions between two PDF versions.' },
    ],
  },
  'extract-text': {
    slug: 'extract-text',
    title: 'Extract Text from PDF',
    description: 'Extract all text from a PDF online for free. Copy PDF content as plain text instantly.',
    keywords: 'extract text from pdf, pdf text extractor, copy text from pdf',
    faqs: [
      { question: 'Does it work on scanned PDFs?', answer: 'For scanned PDFs, use the OCR PDF tool to convert images to searchable text first.' },
    ],
  },
  'ocr-pdf': {
    slug: 'ocr-pdf',
    title: 'OCR PDF',
    description: 'Make scanned PDFs searchable with OCR online for free. Convert image PDFs to text-based PDFs.',
    keywords: 'ocr pdf, pdf ocr tool, scanned pdf to text, make pdf searchable',
    faqs: [
      { question: 'What languages does OCR support?', answer: 'English is supported by default. Additional language packs may be available depending on the tool version.' },
      { question: 'How accurate is the OCR?', answer: 'Accuracy is typically 95%+ on clean, high-resolution scans.' },
    ],
  },

  // ── Security ──────────────────────────────────────────────────────────────
  protect: {
    slug: 'protect',
    title: 'Protect PDF',
    description: 'Password protect your PDF online for free. Encrypt PDF with AES-256 to secure sensitive documents.',
    keywords: 'protect pdf, password protect pdf, encrypt pdf, pdf password tool',
    faqs: [
      { question: 'What encryption is used?', answer: 'AES-256 encryption — the same standard used by banks and governments.' },
      { question: 'What is the difference between User and Owner password?', answer: 'A User password restricts opening the file. An Owner password restricts editing and printing.' },
      { question: 'Can the PDF be opened on any device?', answer: 'Yes. Password-protected PDFs are compatible with all standard PDF readers.' },
    ],
  },
  unlock: {
    slug: 'unlock',
    title: 'Unlock PDF',
    description: 'Remove password protection from a PDF online for free. Unlock PDF files instantly in your browser.',
    keywords: 'unlock pdf, remove pdf password, pdf unlocker, unlock password protected pdf',
    faqs: [
      { question: 'Do I need the password to unlock?', answer: 'Yes. You must know the current password to remove protection.' },
      { question: 'Is it safe to unlock online?', answer: 'Yes. Unlocking is done locally in your browser — no file is sent to a server.' },
    ],
  },

  // ── Special / Ecommerce ───────────────────────────────────────────────────
  'aadhar-crop': {
    slug: 'aadhar-crop',
    title: 'Aadhar Card Cropper',
    description: 'Crop and resize Aadhar card images online for free. Get a properly sized Aadhar card crop instantly.',
    keywords: 'aadhar crop, aadhar card cropper, crop aadhar card online, aadhar card size',
    faqs: [
      { question: 'What output size is used?', answer: 'The tool crops to the standard Aadhar card dimensions automatically.' },
      { question: 'Can I crop both sides?', answer: 'Yes. Upload front and back separately and crop each side.' },
    ],
  },
  'meesho-cropper': {
    slug: 'meesho-cropper',
    title: 'Meesho Label Cropper',
    description: 'Crop Meesho shipping labels with invoice online for free. Resize labels for printing.',
    keywords: 'meesho label cropper, meesho shipping label, crop meesho label, meesho label pdf',
    faqs: [
      { question: 'Does it support invoice labels?', answer: 'Yes. The tool handles Meesho labels that include the invoice section.' },
    ],
  },
  meshocrop: {
    slug: 'meshocrop',
    title: 'Meesho Label Cropper (Without Invoice)',
    description: 'Crop Meesho shipping labels without invoice online for free.',
    keywords: 'meesho crop without invoice, meesho label no invoice, crop meesho shipping label',
    faqs: [],
  },
  'amazon-cropper': {
    slug: 'amazon-cropper',
    title: 'Amazon Label Cropper',
    description: 'Crop Amazon shipping labels online for free. Get print-ready label PDFs from Amazon orders.',
    keywords: 'amazon label cropper, amazon shipping label, crop amazon label, amazon pdf label',
    faqs: [],
  },
  'flipkart-cropper': {
    slug: 'flipkart-cropper',
    title: 'Flipkart Label Cropper',
    description: 'Crop Flipkart shipping labels online for free. Get print-ready labels from Flipkart order PDFs.',
    keywords: 'flipkart label cropper, flipkart shipping label, crop flipkart label',
    faqs: [],
  },
  'snapdeal-cropper': {
    slug: 'snapdeal-cropper',
    title: 'Snapdeal Label Cropper',
    description: 'Crop Snapdeal shipping labels online for free. Extract and resize labels for printing.',
    keywords: 'snapdeal label cropper, snapdeal shipping label, crop snapdeal label',
    faqs: [],
  },
};

/**
 * Returns tool metadata for a given slug, or null if not found.
 */
export function getToolMeta(slug: string): ToolMeta | null {
  return TOOL_META_MAP[slug] ?? null;
}

/**
 * Returns the canonical URL for a tool.
 */
export function getToolUrl(slug: string): string {
  return `${BASE_URL}/tool/${slug}`;
}

export { BASE_URL };
