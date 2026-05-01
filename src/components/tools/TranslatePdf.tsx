"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, Languages, FileText, CheckCircle2, ChevronDown } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ko', label: 'Korean' },
  { code: 'nl', label: 'Dutch' },
  { code: 'tr', label: 'Turkish' },
  { code: 'pl', label: 'Polish' },
  { code: 'sv', label: 'Swedish' },
];

const FAQS = [
  { q: 'How does PDF translation work?',
    a: 'Text is extracted from each page of your PDF, translated using the MyMemory translation API, then assembled into a new PDF document with the translated content.' },
  { q: 'Is the translation accurate?',
    a: 'Translation quality depends on the MyMemory API. For professional or legal documents, we recommend reviewing the output with a human translator.' },
  { q: 'What happens to complex layouts?',
    a: 'The tool extracts plain text and rebuilds a clean text-based PDF. Complex layouts, images, and tables may not be preserved exactly.' },
  { q: 'Is my file uploaded to a server?',
    a: 'The PDF is processed locally in your browser. Only the extracted text is sent to the translation API — your original file is never uploaded.' },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        <span className="font-black text-sm text-slate-900 dark:text-white pr-4">{q}</span>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-800">{a}</div>}
    </div>
  );
}

async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return text;
  const chunks: string[] = [];
  // MyMemory limit ~500 chars per request
  for (let i = 0; i < text.length; i += 450) chunks.push(text.slice(i, i + 450));
  const results: string[] = [];
  for (const chunk of chunks) {
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${from}|${to}`);
      const data = await res.json();
      results.push(data?.responseData?.translatedText || chunk);
    } catch { results.push(chunk); }
  }
  return results.join(' ');
}

export default function TranslatePdf({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setFile(f); setResult(null);
    try {
      const pdf = await pdfjsLib.getDocument(await f.arrayBuffer()).promise;
      setPageCount(pdf.numPages);
    } catch { setPageCount(0); }
  };

  const handleTranslate = async () => {
    if (!file || fromLang === toLang) return;
    setProcessing(true);
    try {
      const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
      const outDoc = await PDFDocument.create();
      const font = await outDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 11;
      const margin = 50;

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Translating page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const rawText = content.items.map((item: any) => item.str).join(' ');
        const translated = await translateText(rawText, fromLang, toLang);

        // Build page
        const { width, height } = page.getViewport({ scale: 1 });
        const outPage = outDoc.addPage([width, height]);
        const maxWidth = width - margin * 2;
        const lineHeight = fontSize * 1.5;

        // Word-wrap
        const words = translated.split(' ');
        const lines: string[] = [];
        let current = '';
        for (const word of words) {
          const test = current ? `${current} ${word}` : word;
          const w = font.widthOfTextAtSize(test, fontSize);
          if (w > maxWidth && current) { lines.push(current); current = word; }
          else current = test;
        }
        if (current) lines.push(current);

        let y = height - margin;
        for (const line of lines) {
          if (y < margin) break;
          outPage.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
        }
      }

      const bytes = await outDoc.save();
      setResult(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    } catch (err) { console.error(err); alert('Error translating PDF.'); }
    finally { setProcessing(false); setProgress(''); }
  };

  const reset = () => { setFile(null); setResult(null); setPageCount(0); setProgress(''); };

  return (
    <div className="py-6 sm:py-10 space-y-6">

      {/* ── TOOL CARD ── */}
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
            <Languages size={36} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Translate PDF</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
            Extract text from your PDF and translate it into another language. Download the translated PDF instantly.
          </p>
        </div>

        {result ? (
          <div className="space-y-6 text-center animate-in zoom-in duration-500">
            <div className="inline-flex p-6 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500">
              <CheckCircle2 size={64} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Translation Complete!</h3>
              <p className="text-slate-500 font-medium mt-1">
                {pageCount} pages · {LANGUAGES.find(l => l.code === fromLang)?.label} → {LANGUAGES.find(l => l.code === toLang)?.label}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={result} download={`translated_${file?.name || 'document.pdf'}`}
                className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-lg font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all">
                <Download size={22} /> Download Translated PDF
              </a>
              <button onClick={reset} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Translate Another
              </button>
            </div>
          </div>

        ) : !file ? (
          <div className="space-y-6">
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group hover:border-blue-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
              onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
              <div className="space-y-4 pointer-events-none text-center">
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-blue-500 group-hover:scale-110 transition-transform">
                  <Upload size={36} />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Select PDF File</div>
                <p className="text-sm text-slate-500">or drop PDF here</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: '🌍', t: '16 Languages',    d: 'Translate between 16 popular languages.' },
                { icon: '📄', t: 'Text Extraction', d: 'Extracts all text content from your PDF.' },
                { icon: '⚡', t: 'Fast & Free',     d: 'Powered by MyMemory translation API.' },
                { icon: '🔒', t: '100% Private',    d: 'Only text is sent — file stays local.' },
              ].map(f => (
                <div key={f.t} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 text-left space-y-2">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{f.t}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>

        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-blue-500"><FileText size={20} /></div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[220px]">{file.name}</p>
                  <p className="text-xs text-slate-400">{pageCount} pages</p>
                </div>
              </div>
              <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
            </div>

            {/* Language selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">From</label>
                <select value={fromLang} onChange={e => setFromLang(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-blue-400">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">To</label>
                <select value={toLang} onChange={e => setToLang(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-blue-400">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
            </div>

            {fromLang === toLang && (
              <p className="text-xs text-amber-600 font-bold text-center">Source and target language must be different.</p>
            )}

            {processing && progress && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <Loader2 size={16} className="animate-spin text-blue-500 shrink-0" />
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{progress}</p>
              </div>
            )}

            <button onClick={handleTranslate} disabled={processing || fromLang === toLang}
              className="w-full py-4 sm:py-5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all">
              {processing ? <Loader2 className="animate-spin" size={24} /> : <Languages size={24} />}
              {processing ? progress || 'Translating...' : 'Translate PDF'}
            </button>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">How to Translate a PDF</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { n: '1', t: 'Upload PDF',       d: 'Select the PDF you want to translate.' },
            { n: '2', t: 'Choose Languages', d: 'Select source and target language.' },
            { n: '3', t: 'Click Translate',  d: 'Text is extracted and translated page by page.' },
            { n: '4', t: 'Download',         d: 'Get your translated PDF instantly.' },
          ].map(s => (
            <div key={s.n} className="flex gap-3 items-start p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-black text-sm flex items-center justify-center shrink-0">{s.n}</div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{s.t}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-2">{FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}</div>
      </div>

      {/* ── RELATED TOOLS ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Related PDF Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'extract-text', label: 'PDF to Text',  color: '#3182ce', desc: 'Extract raw text from PDF.' },
            { id: 'pdf-to-word',  label: 'PDF to Word',  color: '#3182ce', desc: 'Convert PDF to editable DOCX.' },
            { id: 'pdf-to-docx',  label: 'PDF to DOCX',  color: '#3182ce', desc: 'Export as Word document.' },
            { id: 'flatten-pdf',  label: 'Flatten PDF',  color: '#7c3aed', desc: 'Merge all layers.' },
            { id: 'compress',     label: 'Compress PDF', color: '#22c55e', desc: 'Reduce file size.' },
            { id: 'protect',      label: 'Protect PDF',  color: '#e53e3e', desc: 'Add password protection.' },
          ].map(t => (
            <a key={t.id} href={`/tool/${t.id}`}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: t.color }}>
                <Languages size={16} />
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 dark:text-white text-xs group-hover:text-blue-600 transition-colors">{t.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
