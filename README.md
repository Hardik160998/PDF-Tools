# SmartPDFs Plus

A powerful, web-based PDF toolkit built with **Next.js 16**, **React 19**, and **TypeScript**. All core tools run entirely in the browser — no file uploads to external servers for client-side operations.

---

## Features

### Organize
| Tool | Description |
|------|-------------|
| **Organize PDF** | Visual drag-and-drop page organizer with rotate, delete, and reorder |
| **Merge PDF** | Combine multiple PDFs into one |
| **Split PDF** | Split by equal parts or extract every page individually |

### Optimize
| Tool | Description |
|------|-------------|
| **Compress PDF** | Reduce file size using object streams and metadata stripping |
| **Repair PDF** | Recover corrupted/damaged PDFs via ConvertAPI |

### Convert
| Tool | Description |
|------|-------------|
| **PDF to Text** | Extract all text content from a PDF |
| **PDF to XML** | Export extracted text as structured XML |
| **PDF to JPG** | Render each PDF page as a JPEG image |
| **JPG to PDF** | Pack multiple images into a single PDF |
| **Word ↔ PDF** | Convert DOCX to PDF and vice versa |
| **Excel ↔ PDF** | Convert XLSX to PDF and vice versa |
| **PowerPoint ↔ PDF** | Convert PPTX to PDF and vice versa |
| **HTML to PDF** | Convert HTML/web pages to PDF |

### Edit
| Tool | Description |
|------|-------------|
| **Watermark** | Add text or image watermark to every page |
| **Page Numbers** | Stamp page numbers at the bottom-right of each page |
| **Edit Metadata** | Read and update Title, Author, Subject, Keywords, Dates, etc. |

### Security
| Tool | Description |
|------|-------------|
| **Unlock PDF** | Remove password protection from a PDF |
| **Protect PDF** | Encrypt a PDF with a user password |

### Special
| Tool | Description |
|------|-------------|
| **Aadhar Cropper** | Crop front/back of an e-Aadhar PDF to standard ID card dimensions and export as a print-ready A4 PDF |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript 5 |
| PDF Manipulation | `pdf-lib` (client-side) |
| PDF Rendering | `pdfjs-dist` v5 (local worker) |
| Drag & Drop | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Image Cropping | `react-easy-crop` |
| Animations | `framer-motion` |
| ZIP Packaging | `jszip` |
| Cloud Conversions | ConvertAPI (server-side proxy) |
| Database | Supabase |
| Icons | `lucide-react` |

---

## Project Structure

```
src/
├── app/
│   ├── api/convert/route.ts   # Server-side proxy for ConvertAPI
│   ├── tool/[id]/page.tsx     # Dynamic tool page router
│   ├── layout.tsx             # Global layout (header, footer)
│   └── page.tsx               # Homepage with tool grid & category filter
├── components/tools/
│   ├── AadharCropper.tsx      # Aadhar ID card cropper
│   ├── Compressor.tsx         # PDF compressor
│   ├── EditTools.tsx          # Watermark / Page Numbers / Metadata
│   ├── ExtractText.tsx        # PDF to Text / XML
│   ├── ImageConverter.tsx     # PDF ↔ JPG
│   ├── MergeSplit.tsx         # Merge / Split
│   ├── OfficeTools.tsx        # Office format conversions (via API)
│   ├── OrganizeTool.tsx       # Visual page organizer (drag & drop)
│   ├── RepairTool.tsx         # PDF repair (via API)
│   └── SecurityTools.tsx      # Unlock / Protect
└── lib/
    └── supabase.ts            # Supabase client
public/
└── workers/
    └── pdf.worker.min.mjs     # Bundled PDF.js worker (served locally)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [ConvertAPI](https://www.convertapi.com/) account (for Office/Repair/Security tools)
- A [Supabase](https://supabase.com/) project (optional, for auth/storage)

### Installation

```bash
git clone <repo-url>
cd PDF-Tools
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
CONVERT_API_SECRET=your_convertapi_secret_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Architecture Notes

- **Client-side tools** (Merge, Split, Compress, Organize, Watermark, Page Numbers, Metadata, PDF↔JPG, PDF↔Text, Aadhar Cropper) process files entirely in the browser using `pdf-lib` and `pdfjs-dist`. No file data leaves the user's machine.
- **Server-side tools** (Office conversions, Repair, Unlock, Protect) send files through the `/api/convert` Next.js route, which proxies requests to ConvertAPI using base64 encoding.
- The PDF.js worker (`pdf.worker.min.mjs`) is served from `/public/workers/` to avoid CDN fetch failures and ensure offline-capable rendering.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

Private project. All rights reserved © 2026 SmartPDFs Plus.
