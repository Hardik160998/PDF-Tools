"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, GitCompare, ChevronLeft, ChevronRight, Loader2, CheckCircle2, AlertCircle, AlignLeft, Eye } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.mjs";

interface LineDiff { type: "same" | "added" | "removed"; text: string; }
interface PageResult {
  page: number;
  identical: boolean;
  similarity: number;
  thumbA: string;
  thumbB: string;
  textA: string;
  textB: string;
  lineDiffs: LineDiff[];
  addedCount: number;
  removedCount: number;
  sameCount: number;
}

async function renderPage(doc: pdfjsLib.PDFDocumentProxy, pageNum: number, scale = 1.2) {
  const pg = await doc.getPage(pageNum);
  const vp = pg.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = vp.width; canvas.height = vp.height;
  await pg.render({ canvas, viewport: vp }).promise;
  return canvas;
}

async function extractText(doc: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<string> {
  if (pageNum > doc.numPages) return "";
  const pg = await doc.getPage(pageNum);
  const content = await pg.getTextContent();
  return content.items.map((item: any) => item.str).join(" ").replace(/\s+/g, " ").trim();
}

function compareCanvases(a: HTMLCanvasElement, b: HTMLCanvasElement): number {
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const dA = a.getContext("2d")!.getImageData(0, 0, w, h).data;
  const dB = b.getContext("2d")!.getImageData(0, 0, w, h).data;
  let diff = 0;
  for (let i = 0; i < dA.length; i += 4)
    diff += Math.abs(dA[i] - dB[i]) + Math.abs(dA[i+1] - dB[i+1]) + Math.abs(dA[i+2] - dB[i+2]);
  return Math.max(0, 1 - diff / (w * h * 3 * 255));
}

// Simple line-level diff (LCS-based)
function diffLines(a: string, b: string): LineDiff[] {
  const linesA = a.split(/[.!?]\s+/).map(s => s.trim()).filter(Boolean);
  const linesB = b.split(/[.!?]\s+/).map(s => s.trim()).filter(Boolean);
  const result: LineDiff[] = [];
  const setA = new Set(linesA), setB = new Set(linesB);
  const allLines = [...new Set([...linesA, ...linesB])];
  // Build ordered diff
  let ai = 0, bi = 0;
  while (ai < linesA.length || bi < linesB.length) {
    const la = linesA[ai], lb = linesB[bi];
    if (la === lb) { result.push({ type: "same", text: la }); ai++; bi++; }
    else if (lb !== undefined && !setA.has(lb)) { result.push({ type: "added", text: lb }); bi++; }
    else if (la !== undefined && !setB.has(la)) { result.push({ type: "removed", text: la }); ai++; }
    else { if (la) result.push({ type: "removed", text: la }); if (lb) result.push({ type: "added", text: lb }); ai++; bi++; }
  }
  return result;
}

export default function ComparePdf() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<PageResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [done, setDone] = useState(false);
  const [viewMode, setViewMode] = useState<"visual" | "text">("text");
  const [filterMode, setFilterMode] = useState<"all" | "diff" | "same">("all");
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  const reset = () => { setFileA(null); setFileB(null); setPages([]); setCurrentPage(0); setDone(false); };

  const handleCompare = useCallback(async () => {
    if (!fileA || !fileB) return;
    setLoading(true);
    try {
      const [bufA, bufB] = await Promise.all([fileA.arrayBuffer(), fileB.arrayBuffer()]);
      const [docA, docB] = await Promise.all([
        pdfjsLib.getDocument({ data: bufA }).promise,
        pdfjsLib.getDocument({ data: bufB }).promise,
      ]);
      const maxPages = Math.max(docA.numPages, docB.numPages);
      const results: PageResult[] = [];

      for (let i = 1; i <= maxPages; i++) {
        const [canvasA, canvasB, textA, textB] = await Promise.all([
          i <= docA.numPages ? renderPage(docA, i) : Promise.resolve(null),
          i <= docB.numPages ? renderPage(docB, i) : Promise.resolve(null),
          extractText(docA, i),
          extractText(docB, i),
        ]);
        const similarity = canvasA && canvasB ? compareCanvases(canvasA, canvasB) : 0;
        const lineDiffs = diffLines(textA, textB);
        const addedCount = lineDiffs.filter(l => l.type === "added").length;
        const removedCount = lineDiffs.filter(l => l.type === "removed").length;
        const sameCount = lineDiffs.filter(l => l.type === "same").length;
        results.push({
          page: i, identical: similarity > 0.995, similarity,
          thumbA: canvasA?.toDataURL() ?? "",
          thumbB: canvasB?.toDataURL() ?? "",
          textA, textB, lineDiffs, addedCount, removedCount, sameCount,
        });
      }
      setPages(results);
      setCurrentPage(0);
      setDone(true);
    } catch { alert("Error comparing PDFs. Please check your files."); }
    finally { setLoading(false); }
  }, [fileA, fileB]);

  const filtered = pages.filter(p =>
    filterMode === "all" ? true : filterMode === "diff" ? !p.identical : p.identical
  );
  const totalDiff = pages.filter(p => !p.identical).length;
  const totalSame = pages.filter(p => p.identical).length;
  const totalAdded = pages.reduce((s, p) => s + p.addedCount, 0);
  const totalRemoved = pages.reduce((s, p) => s + p.removedCount, 0);
  const cur = pages[currentPage];

  const FileZone = ({ label, file, onFile, ref: inputRef, grad }: { label: string; file: File | null; onFile: (f: File) => void; ref: React.RefObject<HTMLInputElement | null>; grad: string }) => (
    <div className={`relative flex-1 rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${file ? "border-solid" : ""}`}
      style={{ borderColor: file ? (label === "A" ? "#6366f1" : "#f59e0b") : "#cbd5e1" }}
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.name.endsWith(".pdf")) onFile(f); }}>
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
      {file ? (
        <div className="p-5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl text-white shrink-0" style={{ background: grad }}><FileText size={20} /></div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 dark:text-white text-sm truncate">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button onClick={e => { e.stopPropagation(); label === "A" ? setFileA(null) : setFileB(null); }} className="p-1.5 text-slate-400 hover:text-red-500 shrink-0"><X size={16} /></button>
        </div>
      ) : (
        <div className="p-8 flex flex-col items-center gap-3 pointer-events-none">
          <div className="p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform" style={{ background: grad }}><Upload size={28} /></div>
          <p className="font-black text-slate-700 dark:text-slate-200 text-sm">PDF {label}</p>
          <p className="text-xs text-slate-400">Click or drag & drop</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-10 px-3 sm:px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl text-white shadow-lg" style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
            <GitCompare size={36} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Compare PDF Files</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Upload two PDFs — see text differences and visual changes side by side.</p>
        </div>

        {/* Upload */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <FileZone label="A" file={fileA} onFile={setFileA} ref={inputARef} grad="linear-gradient(135deg,#6366f1,#4f46e5)" />
          <div className="flex items-center justify-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <GitCompare size={18} className="text-slate-400" />
            </div>
          </div>
          <FileZone label="B" file={fileB} onFile={setFileB} ref={inputBRef} grad="linear-gradient(135deg,#f59e0b,#d97706)" />
        </div>

        {/* Compare button */}
        {!done && (
          <button onClick={handleCompare} disabled={!fileA || !fileB || loading}
            className="w-full py-4 sm:py-5 text-white rounded-2xl text-xl font-black shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
            {loading ? <Loader2 className="animate-spin" size={26} /> : <GitCompare size={26} />}
            {loading ? "Comparing pages…" : "Compare PDFs"}
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i*0.18}s` }} />)}</div>
            <p className="text-xs text-slate-400 font-medium">Extracting text and comparing pages…</p>
          </div>
        )}

        {/* Results */}
        {done && pages.length > 0 && (
          <div className="space-y-6">

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl p-4 text-center bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{pages.length}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Pages</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                <p className="text-2xl font-black text-red-500">{totalDiff}</p>
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">Changed Pages</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
                <p className="text-2xl font-black text-green-500">+{totalAdded}</p>
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mt-1">Lines Added</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
                <p className="text-2xl font-black text-orange-500">-{totalRemoved}</p>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1">Lines Removed</p>
              </div>
            </div>

            {/* Page list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Pages</p>
                <div className="flex gap-1">
                  {(["all","diff","same"] as const).map(m => (
                    <button key={m} onClick={() => setFilterMode(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterMode === m ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200"}`}>
                      {m === "all" ? "All" : m === "diff" ? "Changed" : "Identical"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {filtered.map(p => (
                  <button key={p.page} onClick={() => setCurrentPage(p.page - 1)}
                    className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentPage === p.page - 1 ? "border-indigo-500 ring-2 ring-indigo-500/30 scale-105" : p.identical ? "border-green-300 dark:border-green-600" : "border-red-300 dark:border-red-600"}`}
                    style={{ width: 64 }}>
                    {p.thumbA ? <img src={p.thumbA} alt={`Page ${p.page}`} className="w-full h-auto block" /> : <div className="w-16 h-20 bg-slate-100 dark:bg-slate-700" />}
                    <div className={`text-center py-0.5 text-[10px] font-black ${p.identical ? "bg-green-50 dark:bg-green-900/30 text-green-600" : "bg-red-50 dark:bg-red-900/30 text-red-500"}`}>
                      {p.identical ? "✓" : "≠"} {p.page}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Page detail */}
            {cur && (
              <div className="space-y-4">
                {/* Page header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">Page {cur.page}</span>
                    {cur.identical
                      ? <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full"><CheckCircle2 size={11} /> Identical</span>
                      : <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full"><AlertCircle size={11} /> {Math.round((1 - cur.similarity) * 100)}% different</span>
                    }
                    {!cur.identical && (
                      <>
                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">+{cur.addedCount} added</span>
                        <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">-{cur.removedCount} removed</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 gap-1">
                      <button onClick={() => setViewMode("text")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "text" ? "bg-white dark:bg-slate-600 text-indigo-600 shadow-sm" : "text-slate-500"}`}>
                        <AlignLeft size={13} /> Text Diff
                      </button>
                      <button onClick={() => setViewMode("visual")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "visual" ? "bg-white dark:bg-slate-600 text-indigo-600 shadow-sm" : "text-slate-500"}`}>
                        <Eye size={13} /> Visual
                      </button>
                    </div>
                    <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-200 transition-colors"><ChevronLeft size={16} /></button>
                    <button onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))} disabled={currentPage === pages.length - 1} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-200 transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>

                {/* TEXT DIFF VIEW */}
                {viewMode === "text" && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Legend */}
                    <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-600"><span className="w-3 h-3 rounded bg-green-200 dark:bg-green-800 inline-block" /> Added in PDF B</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-500"><span className="w-3 h-3 rounded bg-red-200 dark:bg-red-900 inline-block" /> Removed from PDF A</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-600 inline-block" /> Unchanged</span>
                    </div>
                    {/* Diff lines */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                      {cur.lineDiffs.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-400 text-sm font-medium">No text content found on this page.</div>
                      ) : cur.lineDiffs.map((line, idx) => (
                        <div key={idx} className={`flex gap-3 px-4 py-2 text-sm font-medium leading-relaxed ${
                          line.type === "added"   ? "bg-green-50 dark:bg-green-900/20" :
                          line.type === "removed" ? "bg-red-50 dark:bg-red-900/20" :
                          "bg-white dark:bg-slate-800"
                        }`}>
                          <span className={`shrink-0 w-5 text-center font-black text-xs mt-0.5 ${
                            line.type === "added"   ? "text-green-500" :
                            line.type === "removed" ? "text-red-500" :
                            "text-slate-300 dark:text-slate-600"
                          }`}>
                            {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                          </span>
                          <span className={`flex-1 ${
                            line.type === "added"   ? "text-green-800 dark:text-green-300" :
                            line.type === "removed" ? "text-red-800 dark:text-red-300 line-through opacity-70" :
                            "text-slate-600 dark:text-slate-300"
                          }`}>
                            {line.text || <span className="italic text-slate-300">(empty)</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VISUAL VIEW */}
                {viewMode === "visual" && (
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: "PDF A", thumb: cur.thumbA, name: fileA?.name ?? "", color: "#6366f1" },
                      { label: "PDF B", thumb: cur.thumbB, name: fileB?.name ?? "", color: "#f59e0b" }].map(({ label, thumb, name, color }) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                          <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest truncate">{label} — {name}</span>
                        </div>
                        <div className={`rounded-xl overflow-hidden border-2 ${!cur.identical ? "border-red-300 dark:border-red-600" : "border-green-200 dark:border-green-700"}`}>
                          {thumb ? <img src={thumb} alt={label} className="w-full h-auto block" /> : <div className="w-full h-48 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-sm font-bold">No page</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button onClick={reset} className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-2xl font-bold transition-all text-sm">
              Compare New Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
