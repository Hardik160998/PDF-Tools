-- Data Migration SQL File

-- Insert Categories
INSERT INTO "public"."categories" ("id", "name", "icon", "sort_order", "is_active") VALUES
(1, 'Organize', 'SlidersHorizontal', 2, true),
(2, 'Optimize', 'Zap', 3, true),
(3, 'Convert', 'RefreshCw', 4, true),
(4, 'Edit', 'Pencil', 5, true),
(5, 'Security', 'ShieldCheck', 6, true),
(6, 'Special', 'Star', 7, true),
(7, 'Sign', 'PenTool', 8, true),
(10, 'Image Convert', 'ImageIcon', 9, true),
(11, 'Ecommerce', 'LayoutGrid', 9, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Tools
INSERT INTO "public"."allpdftools" ("id", "tool_key", "title", "url", "category_id", "is_verified", "category", "img_convert") VALUES
(1, 'organize', 'Organize PDF', '/tool/organize', 1, true, 'Organize', false),
(2, 'merge', 'Merge PDFsss', '/tool/merge', 1, true, 'Organize', false),
(3, 'split', 'Split PDF', '/tool/split', 1, true, 'Organize', false),
(4, 'compress', 'Compress PDF', '/tool/compress', 2, true, 'Optimize', false),
(5, 'repair-pdf', 'Repair PDF', '/tool/repair-pdf', 2, true, 'Optimize', false),
(6, 'extract-text', 'PDF to Text', '/tool/extract-text', 3, true, 'Convert', false),
(7, 'pdf-to-xml', 'PDF to XML', '/tool/pdf-to-xml', 3, true, 'Convert', false),
(8, 'pdf-to-jpg', 'PDF to JPG', '/tool/pdf-to-jpg', 3, true, 'Convert', false),
(9, 'jpg-to-pdf', 'JPG to PDF', '/tool/jpg-to-pdf', 3, true, 'Convert', false),
(10, 'word-to-pdf', 'Word to PDF', '/tool/word-to-pdf', 3, true, 'Convert', false),
(11, 'pdf-to-word', 'PDF to Word', '/tool/pdf-to-word', 3, true, 'Convert', false),
(12, 'ppt-to-pdf', 'PowerPoint to PDF', '/tool/ppt-to-pdf', 3, true, 'Convert', false),
(13, 'pdf-to-ppt', 'PDF to PowerPoint', '/tool/pdf-to-ppt', 3, true, 'Convert', false),
(14, 'excel-to-pdf', 'Excel to PDF', '/tool/excel-to-pdf', 3, true, 'Convert', false),
(15, 'pdf-to-excel', 'PDF to Excel', '/tool/pdf-to-excel', 3, true, 'Convert', false),
(16, 'html-to-pdf', 'HTML to PDF', '/tool/html-to-pdf', 3, true, 'Convert', false),
(17, 'watermark', 'Watermark', '/tool/watermark', 4, true, 'Edit', false),
(18, 'page-numbers', 'Page Numbers', '/tool/page-numbers', 4, true, 'Edit', false),
(19, 'metadata', 'Edit Metadata', '/tool/metadata', 4, true, 'Edit', false),
(20, 'edit-pdf', 'Edit PDF', '/edit', 4, true, 'Edit', false),
(21, 'unlock', 'Unlock PDF', '/tool/unlock', 5, true, 'Security', false),
(22, 'protect', 'Protect PDF', '/tool/protect', 5, true, 'Security', false),
(23, 'aadhar-crop', 'Aadhar Cropper', '/tool/aadhar-crop', 6, true, 'Special', false),
(24, 'esign', 'E-Sign PDF', '/esign', 7, true, 'Sign', false),
(29, 'extract-pages', 'Extract PDF Pages', '/tool/extract-pages', 1, true, 'Organize', false),
(30, 'webpage-to-pdf', 'Webpage to PDF', '/tool/webpage-to-pdf', 1, true, 'Convert', false),
(31, 'compare-pdf', 'Compare PDF', '/tool/compare-pdf', 1, true, 'Organize', false),
(32, 'redact-pdf', 'Redact PDF', '/tool/redact-pdf', 1, true, 'Security', false),
(37, 'bookmark-pdf', 'Bookmark PDF', '/tool/bookmark-pdf', 3, true, 'Edit', false),
(38, 'docx-to-pdf', 'DOCX to PDF', '/tool/docx-to-pdf', 3, true, 'Convert', false),
(39, 'pdf-to-docx', 'PDF to DOCX', '/tool/pdf-to-docx', 3, true, 'Convert', false),
(47, 'jpg-to-png', 'JPG to PNG', '/tool/jpg-to-png', 10, true, 'Image Convert', true),
(48, 'png-to-jpg', 'PNG to JPG', '/tool/png-to-jpg', 10, true, 'Image Convert', true),
(52, 'jpg-to-webp', 'JPG to WebP', '/tool/jpg-to-webp', 10, true, 'Image Convert', true),
(53, 'webp-to-jpg', 'WebP to JPG', '/tool/webp-to-jpg', 10, true, 'Image Convert', true),
(54, 'png-to-webp', 'PNG to WebP', '/tool/png-to-webp', 10, true, 'Image Convert', true),
(55, 'webp-to-png', 'WebP to PNG', '/tool/webp-to-png', 10, true, 'Image Convert', true),
(57, 'jpg-to-avif', 'JPG to AVIF', '/tool/jpg-to-avif', 10, true, 'Image Convert', true),
(58, 'avif-to-jpg', 'AVIF to JPG', '/tool/avif-to-jpg', 10, true, 'Image Convert', true),
(59, 'png-to-avif', 'PNG to AVIF', '/tool/png-to-avif', 10, true, 'Image Convert', true),
(60, 'avif-to-png', 'AVIF to PNG', '/tool/avif-to-png', 10, true, 'Image Convert', true),
(61, 'webp-to-avif', 'WebP to AVIF', '/tool/webp-to-avif', 10, true, 'Image Convert', true),
(62, 'avif-to-webp', 'AVIF to WebP', '/tool/avif-to-webp', 10, true, 'Image Convert', true),
(63, 'delete-pages', 'Delete PDF Pages', '/tool/delete-pages', 3, true, 'Organize', false),
(64, 'optimize-pdf', 'Optimize PDF', '/tool/optimize-pdf', 3, true, 'Optimize', false),
(65, 'translate-pdf', 'Translate PDF', '/tool/translate-pdf', 4, true, 'Convert', false),
(66, 'add-blank-page', 'Add Blank Page to PDF', '/tool/add-blank-page', 3, true, 'Organize', false),
(68, 'ocr-pdf', 'OCR PDF', '/tool/ocr-pdf', 3, true, 'Convert', false),
(69, 'remove-ocr', 'Remove OCR', '/tool/remove-ocr', 4, true, 'Edit', false),
(70, 'flatten-pdf', 'Flatten PDF', '/tool/flatten-pdf', 4, true, 'Edit', false),
(71, 'crop-pdf', 'Crop PDF', '/tool/crop-pdf', 6, true, 'Special', false),
(73, 'meesho-cropper', 'Meesho Label with Invoice Cropper', '/tool/meesho-cropper', 11, true, 'Ecommerce', false),
(74, 'meshocrop', 'Meesho Label Crop (without invoice)', '/tool/meshocrop', 11, true, 'Ecommerce', false),
(75, 'flipkart-cropper', 'Flipkart Label Cropper', '/tool/flipkart-cropper', 11, true, 'Ecommerce', false),
(76, 'amazon-cropper', 'Amazon Label Cropper', '/tool/amazon-cropper', 11, true, 'Ecommerce', false),
(77, 'snapdeal-cropper', 'Snapdeal Label Cropper', '/tool/snapdeal-cropper', 11, true, 'Ecommerce', false)
ON CONFLICT (id) DO NOTHING;

-- Update sequences
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('allpdftools_id_seq', (SELECT MAX(id) FROM allpdftools));
