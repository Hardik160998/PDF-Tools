"use client";

import { useState, useRef } from 'react';
import { Upload, Download, Loader2, X, FilePlus, FileText, CheckCircle2, ChevronDown, Plus, Minus } from 'lucide-react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

const PAGE_SIZES = [
  { label: 'Same as PDF',  value: 'same' },
  { label: 'A4',           value: 'a4' },
  { label: 'Letter',       value: 'letter' },
  { label: 'A3',           value: 'a3' },
];

const FAQS = [
  { q: 'Where can I insert blank pages?',
    a: 'You can insert blank pages at the beginning, end, after a specific page number, or after every page in the document.' },
  { q: 'What size will the blank pages be?',
    a: 'By default blank pages match the size of the first page of your PDF. You can also choose A4, Letter, or A3.' },
  { q: 'Can I add multiple blank pages at once?',
    a: 'Yes. Use the count selector to insert 1–10 blank pages at the chosen position in one click.' },
  { q: 'Is my file uploaded to a server?',
    a: 'No. Everything runs entirely in your browser using pdf-lib. Your file never leaves your device.' },
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

export default function AddBlankPage({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<'beginning' | 'end' | 'after' | 'after-every'>('end');
  const [afterPage, setAfterPage] = useState(1);
  const [blankCount, setBlankCount] = useState(1);
  const [pageSize, setPageSize] = useState('same');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setFile(f); setResult(null);
    try {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(pdf.getPageCount());
      setAfterPage(pdf.getPageCount());
    } catch { setPageCount(0); }
  };

  const getBlankDims = (pdf: PDFDocument): [number, number] => {
    if (pageSize === 'a4')     return [PageSizes.A4[0], PageSizes.A4[1]];
    if (pageSize === 'letter') return [PageSizes.Letter[0], PageSizes.Letter[1]];
    if (pageSize === 'a3')     return [PageSizes.A3[0], PageSizes.A3[1]];
    const first = pdf.getPage(0);
    const { width, height } = first.getSize();
    return [width, height];
  };

  const handleAdd = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const dims = getBlankDims(pdf);
      const total = pdf.getPageCount();

      const addBlanks = (doc: PDFDocument, insertAt: number) => {
        for (let i = 0; i < blankCount; i++) {
          const blank = doc.insertPage(insertAt + i, dims);
          blank.drawRectangle({ x: 0, y: 0, width: dims[0], height: dims[1], color: { red: 1, green: 1, blue: 1, type: 'RGB' as any } });
        }
      };

      if (position === 'beginning') {
        addBlanks(pdf, 0);
      } else if (position === 'end') {
        for (let i = 0; i < blankCount; i++) pdf.addPage(dims);
      } else if (position === 'after') {
        const idx = Math.min(Math.max(afterPage, 1), total);
        addBlanks(pdf, idx);
      } else if (position === 'after-every') {
        // insert after every original page (iterate backwards to keep indices correct)
        for (let i = total - 1; i >= 0; i--) {
          for (let j = 0; j < blankCount; j++) {
            pdf.insertPage(i + 1 + j, dims);
          }
        }
      }

      const bytes = await pdf.save();
      setResult(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    } catch (err) { console.error(err); alert('Error adding blank pages.'); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setResult(null); setPageCount(0); };

  return (
    <div className="py-6 sm:py-10 space-y-6">

      {/* ── TOOL CARD ── */}
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <FilePlus size={36} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Add Blank Page to PDF</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
            Insert one or more blank pages anywhere in your PDF — beginning, end, or after a specific page. 100% private, runs in your browser.
          </p>
        </div>

        {result ? (
          <div className="space-y-6 text-center animate-in zoom-in duration-500">
            <div className="inline-flex p-6 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500">
              <CheckCircle2 size={64} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Done!</h3>
              <p className="text-slate-500 font-medium mt-1">
                {blankCount} blank page{blankCount > 1 ? 's' : ''} added · {position === 'after-every' ? pageCount * blankCount + pageCount : pageCount + blankCount} total pages
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={result} download={`blank_added_${file?.name || 'document.pdf'}`}
                className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-lg font-black shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all">
                <Download size={22} /> Download PDF
              </a>
              <button onClick={reset} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Start Over
              </button>
            </div>
          </div>

        ) : !file ? (
          <div className="space-y-6">
            {/* Drop zone */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-10 sm:p-16 group hover:border-indigo-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
              onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
              <div className="space-y-4 pointer-events-none text-center">
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-indigo-500 group-hover:scale-110 transition-transform">
                  <Upload size={36} />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Select PDF File</div>
                <p className="text-sm text-slate-500">or drop PDF here</p>
              </div>
            </div>
            {/* Feature cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: '📄', t: 'Any Position',    d: 'Insert at beginning, end, or after any page.' },
                { icon: '🔢', t: 'Multiple Pages',  d: 'Add up to 10 blank pages at once.' },
                { icon: '📐', t: 'Custom Size',     d: 'Match PDF size or choose A4, Letter, A3.' },
                { icon: '🔒', t: '100% Private',    d: 'Runs entirely in your browser.' },
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

            {/* File info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-500"><FileText size={20} /></div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[220px]">{file.name}</p>
                  <p className="text-xs text-slate-400">{pageCount} pages</p>
                </div>
              </div>
              <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
            </div>

            {/* Position selector */}
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-900 dark:text-white">Insert Position</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { val: 'beginning',  label: '⬆️ Beginning' },
                  { val: 'end',        label: '⬇️ End' },
                  { val: 'after',      label: '📍 After Page' },
                  { val: 'after-every',label: '🔁 After Every Page' },
                ] as const).map(p => (
                  <button key={p.val} onClick={() => setPosition(p.val)}
                    className={`py-3 px-3 rounded-xl border-2 text-xs font-black transition-all ${position === p.val ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* After page number */}
            {position === 'after' && (
              <div className="space-y-2">
                <p className="text-sm font-black text-slate-900 dark:text-white">After Page Number</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAfterPage(p => Math.max(1, p - 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 transition-all"><Minus size={16} /></button>
                  <span className="w-16 text-center font-black text-slate-900 dark:text-white text-lg">{afterPage}</span>
                  <button onClick={() => setAfterPage(p => Math.min(pageCount, p + 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 transition-all"><Plus size={16} /></button>
                  <span className="text-xs text-slate-400">of {pageCount}</span>
                </div>
              </div>
            )}

            {/* Blank page count */}
            <div className="space-y-2">
              <p className="text-sm font-black text-slate-900 dark:text-white">Number of Blank Pages</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setBlankCount(c => Math.max(1, c - 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 transition-all"><Minus size={16} /></button>
                <span className="w-16 text-center font-black text-slate-900 dark:text-white text-lg">{blankCount}</span>
                <button onClick={() => setBlankCount(c => Math.min(10, c + 1))} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 transition-all"><Plus size={16} /></button>
              </div>
            </div>

            {/* Page size */}
            <div className="space-y-2">
              <p className="text-sm font-black text-slate-900 dark:text-white">Blank Page Size</p>
              <div className="grid grid-cols-4 gap-2">
                {PAGE_SIZES.map(s => (
                  <button key={s.value} onClick={() => setPageSize(s.value)}
                    className={`py-2.5 rounded-xl border-2 text-xs font-black transition-all ${pageSize === s.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                {blankCount} blank page{blankCount > 1 ? 's' : ''} will be inserted{' '}
                {position === 'beginning' ? 'at the beginning' :
                 position === 'end' ? 'at the end' :
                 position === 'after' ? `after page ${afterPage}` :
                 'after every page'} of your PDF.
              </p>
            </div>

            {/* Add button */}
            <button onClick={handleAdd} disabled={processing}
              className="w-full py-4 sm:py-5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl text-lg sm:text-2xl font-black shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all">
              {processing ? <Loader2 className="animate-spin" size={24} /> : <FilePlus size={24} />}
              {processing ? 'Adding pages...' : `Add ${blankCount} Blank Page${blankCount > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">How to Add a Blank Page to PDF</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { n: '1', t: 'Upload PDF',       d: 'Select the PDF you want to add blank pages to.' },
            { n: '2', t: 'Choose Position',  d: 'Pick beginning, end, after a page, or after every page.' },
            { n: '3', t: 'Set Count & Size', d: 'Choose how many blank pages and what size they should be.' },
            { n: '4', t: 'Download',         d: 'Click Add and download your updated PDF instantly.' },
          ].map(s => (
            <div key={s.n} className="flex gap-3 items-start p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-black text-sm flex items-center justify-center shrink-0">{s.n}</div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{s.t}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHEN TO USE ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">When to Add Blank Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '🖨️', t: 'Double-Sided Printing', d: 'Add blank pages to ensure chapters start on the right-hand side.' },
            { icon: '📝', t: 'Notes & Annotations',   d: 'Insert blank pages for handwritten notes between sections.' },
            { icon: '📚', t: 'Book Formatting',        d: 'Maintain proper page flow for booklets and publications.' },
            { icon: '📋', t: 'Form Spacers',           d: 'Add separator pages between form sections or documents.' },
          ].map(item => (
            <div key={item.t} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{item.t}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.d}</p>
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
            { id: 'organize',     label: 'Organize PDF',  color: '#f26522', desc: 'Reorder and rotate pages.' },
            { id: 'delete-pages', label: 'Delete Pages',  color: '#f26522', desc: 'Remove unwanted pages.' },
            { id: 'extract-pages',label: 'Extract Pages', color: '#f26522', desc: 'Pull out specific pages.' },
            { id: 'merge',        label: 'Merge PDF',     color: '#f26522', desc: 'Combine multiple PDFs.' },
            { id: 'split',        label: 'Split PDF',     color: '#f26522', desc: 'Split into smaller files.' },
            { id: 'page-numbers', label: 'Page Numbers',  color: '#E8465D', desc: 'Add page numbers.' },
          ].map(t => (
            <a key={t.id} href={`/tool/${t.id}`}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 hover:border-indigo-300 hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: t.color }}>
                <FilePlus size={16} />
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 dark:text-white text-xs group-hover:text-indigo-600 transition-colors">{t.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
