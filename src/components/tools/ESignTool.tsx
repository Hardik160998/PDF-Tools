"use client";

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Loader2, X, FileText, PenLine, Type, Eraser, CheckCircle2, Move } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface Signature {
  id: string;
  data: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Convert a client-space point to canvas internal-space, accounting for CSS scaling */
function clientToCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

function getPoint(
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
) {
  if ('touches' in e) {
    return clientToCanvas(canvas, e.touches[0].clientX, e.touches[0].clientY);
  }
  return clientToCanvas(canvas, e.clientX, e.clientY);
}

// ─── component ──────────────────────────────────────────────────────────────

export default function ESignTool({ id: _id }: { id: string }) {
  const [file, setFile]               = useState<File | null>(null);
  const [processing, setProcessing]   = useState(false);
  const [result, setResult]           = useState<string | null>(null);
  const [mode, setMode]               = useState<'upload' | 'sign' | 'done'>('upload');
  const [signMode, setSignMode]       = useState<'draw' | 'type'>('draw');
  const [typedText, setTypedText]     = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [pageImages, setPageImages]   = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [signatures, setSignatures]   = useState<Signature[]>([]);
  const [selectedSig, setSelectedSig] = useState<string | null>(null);
  const [penColor, setPenColor]       = useState('#1e293b');
  const [penSize, setPenSize]         = useState(2.5);

  // ── refs (never cause re-renders mid-gesture) ──
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const previewRef   = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);          // FIX 2: ref instead of state
  const lastPt       = useRef<{ x: number; y: number } | null>(null);
  const dragRef      = useRef<{ startX: number; startY: number; sigX: number; sigY: number } | null>(null); // FIX 5

  // ── file upload ──────────────────────────────────────────────────────────

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(f.type)) {
      alert('Please upload a PDF or image (PNG / JPG).');
      return;
    }
    setFile(f);
    setMode('sign');
    if (f.type === 'application/pdf') {
      await loadPdfPages(f);
    } else {
      const reader = new FileReader();
      reader.onload = ev => setPageImages([ev.target?.result as string]);
      reader.readAsDataURL(f);
    }
    e.target.value = '';
  };

  const loadPdfPages = async (pdfFile: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument({ data: await pdfFile.arrayBuffer() }).promise;
      const imgs: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page     = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas   = document.createElement('canvas');
        canvas.width   = viewport.width;
        canvas.height  = viewport.height;
        const ctx      = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        imgs.push(canvas.toDataURL());
      }
      setPageImages(imgs);
    } catch {
      alert('Could not load PDF. Please try another file.');
    }
  };

  // ── drawing ──────────────────────────────────────────────────────────────

  const setupCtx = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = penColor;
    ctx.lineWidth   = penSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
  };

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      // FIX 3: prevent scroll on touch
      if ('touches' in e) e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      isDrawingRef.current = true;
      const pt = getPoint(e, canvas);
      lastPt.current = pt;
      const ctx = canvas.getContext('2d')!;
      setupCtx(ctx);
      // draw a dot so a single tap/click is visible
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, penSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = penColor;
      ctx.fill();
    },
    [penColor, penSize]
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      // FIX 2: read ref, not state
      if (!isDrawingRef.current) return;
      if ('touches' in e) e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pt  = getPoint(e, canvas);
      const ctx = canvas.getContext('2d')!;
      setupCtx(ctx);
      // FIX 4: always beginPath per segment to avoid ghost lines
      ctx.beginPath();
      ctx.moveTo(lastPt.current?.x ?? pt.x, lastPt.current?.y ?? pt.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      lastPt.current = pt;
    },
    [penColor, penSize]
  );

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPt.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  }, []);

  // ── create / place signature ─────────────────────────────────────────────

  const createSignature = () => {
    if (signMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setSignatureData(canvas.toDataURL('image/png'));
    } else {
      if (!typedText.trim()) { alert('Please type your signature.'); return; }
      // FIX: render typed sig at 2× resolution for crispness
      const offscreen = document.createElement('canvas');
      offscreen.width  = 600;
      offscreen.height = 120;
      const ctx = offscreen.getContext('2d')!;
      ctx.clearRect(0, 0, 600, 120);
      ctx.fillStyle = penColor;
      ctx.font      = `bold 72px "Brush Script MT", "Dancing Script", cursive`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedText, 300, 60);
      setSignatureData(offscreen.toDataURL('image/png'));
    }
  };

  const placeSignature = () => {
    if (!signatureData) return;
    setSignatures(prev => [
      ...prev,
      { id: Date.now().toString(), data: signatureData, x: 40, y: 40, width: 180, height: 60 },
    ]);
    setSignatureData(null);
    setTypedText('');
    clearCanvas();
  };

  // ── drag signatures on preview ───────────────────────────────────────────

  const onSigPointerDown = (e: React.PointerEvent, sigId: string) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const sig = signatures.find(s => s.id === sigId);
    if (!sig) return;
    setSelectedSig(sigId);
    // FIX 5: store in ref so moves don't re-render state on every pixel
    dragRef.current = { startX: e.clientX, startY: e.clientY, sigX: sig.x, sigY: sig.y };
  };

  const onSigPointerMove = (e: React.PointerEvent, sigId: string) => {
    if (!dragRef.current || selectedSig !== sigId) return;
    e.preventDefault();
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setSignatures(prev =>
      prev.map(s =>
        s.id === sigId
          ? { ...s, x: dragRef.current!.sigX + dx, y: dragRef.current!.sigY + dy }
          : s
      )
    );
  };

  const onSigPointerUp = () => {
    dragRef.current = null;
    setSelectedSig(null);
  };

  // ── resize handle ────────────────────────────────────────────────────────

  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);

  const onResizeDown = (e: React.PointerEvent, sigId: string) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const sig = signatures.find(s => s.id === sigId);
    if (!sig) return;
    setSelectedSig(sigId);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, w: sig.width, h: sig.height };
  };

  const onResizeMove = (e: React.PointerEvent, sigId: string) => {
    if (!resizeRef.current || selectedSig !== sigId) return;
    e.preventDefault();
    const dx = e.clientX - resizeRef.current.startX;
    const dy = e.clientY - resizeRef.current.startY;
    setSignatures(prev =>
      prev.map(s =>
        s.id === sigId
          ? { ...s, width: Math.max(60, resizeRef.current!.w + dx), height: Math.max(24, resizeRef.current!.h + dy) }
          : s
      )
    );
  };

  const onResizeUp = () => {
    resizeRef.current = null;
    setSelectedSig(null);
  };

  // ── download ─────────────────────────────────────────────────────────────

  const handleDownload = async () => {
    if (!file || !previewRef.current) return;
    setProcessing(true);
    try {
      let pdfDoc: PDFDocument;

      if (file.type === 'application/pdf') {
        pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      } else {
        pdfDoc = await PDFDocument.create();
        const bytes = await file.arrayBuffer();
        const img   = file.type === 'image/png'
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);
        const pg = pdfDoc.addPage([img.width, img.height]);
        pg.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const page              = pdfDoc.getPages()[currentPage];
      const { width: pdfW, height: pdfH } = page.getSize();

      // FIX 6: use both width AND height for correct scaling
      const previewW = previewRef.current.offsetWidth;
      const previewH = previewRef.current.offsetHeight;
      const scaleX   = pdfW / previewW;
      const scaleY   = pdfH / previewH;

      for (const sig of signatures) {
        const bytes  = await (await fetch(sig.data)).arrayBuffer();
        const sigImg = await pdfDoc.embedPng(bytes);
        page.drawImage(sigImg, {
          x:      sig.x * scaleX,
          y:      pdfH - (sig.y + sig.height) * scaleY,   // PDF y-axis is bottom-up
          width:  sig.width  * scaleX,
          height: sig.height * scaleY,
        });
      }

      const saved = await pdfDoc.save();
      const blob = new Blob([saved.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
      setMode('done');
    } catch (err) {
      console.error(err);
      alert('Error saving document. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // ── reset ────────────────────────────────────────────────────────────────

  const reset = () => {
    setFile(null); setMode('upload'); setSignatures([]); setSignatureData(null);
    setPageImages([]); setCurrentPage(0); setResult(null); setTypedText('');
    clearCanvas();
  };

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-10 px-2 sm:px-4">
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-10 border border-slate-100 shadow-2xl space-y-6 sm:space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
            <PenLine className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            E-Signature Tool
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Upload, sign, and download your documents securely in your browser.
          </p>
        </div>

        {/* ── UPLOAD ── */}
        {mode === 'upload' && (
          <label className="relative flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-16 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all group">
            <input type="file" onChange={onFileChange} accept=".pdf,image/png,image/jpeg,image/jpg" className="sr-only" />
            <div className="p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-lg text-purple-500 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-lg sm:text-xl font-medium text-slate-800 dark:text-white mb-1">Click or drag & drop to upload</div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">PDF · PNG · JPG · WebP</p>
            </div>
          </label>
        )}

        {/* ── SIGN ── */}
        {mode === 'sign' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

            {/* Left — document preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText size={16} className="text-purple-500" />
                  <span className="truncate max-w-[220px]">{file?.name}</span>
                </div>
                <button onClick={reset} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Page nav */}
              {pageImages.length > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
                    className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium disabled:opacity-40">← Prev</button>
                  <span className="text-xs font-medium text-slate-500">Page {currentPage + 1} / {pageImages.length}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(pageImages.length - 1, p + 1))} disabled={currentPage === pageImages.length - 1}
                    className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium disabled:opacity-40">Next →</button>
                </div>
              )}

              {/* Document canvas */}
              <div
                ref={previewRef}
                className="relative bg-white rounded-xl shadow-lg overflow-hidden select-none"
                style={{ touchAction: 'none' }}
              >
                {pageImages[currentPage]
                  ? <img src={pageImages[currentPage]} alt="Document page" className="w-full block" draggable={false} />
                  : <div className="flex items-center justify-center h-64 text-slate-300"><Loader2 className="animate-spin" size={32} /></div>
                }

                {signatures.map(sig => (
                  <div
                    key={sig.id}
                    className={`absolute group/sig ${selectedSig === sig.id ? 'ring-2 ring-purple-500' : 'ring-1 ring-transparent hover:ring-purple-300'} rounded`}
                    style={{ left: sig.x, top: sig.y, width: sig.width, height: sig.height, cursor: 'move', touchAction: 'none' }}
                    onPointerDown={e => onSigPointerDown(e, sig.id)}
                    onPointerMove={e => onSigPointerMove(e, sig.id)}
                    onPointerUp={onSigPointerUp}
                  >
                    <img src={sig.data} alt="sig" className="w-full h-full object-contain pointer-events-none" draggable={false} />

                    {/* delete */}
                    <button
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => setSignatures(p => p.filter(s => s.id !== sig.id))}
                      className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/sig:opacity-100 transition-opacity z-10"
                    >
                      <X size={11} />
                    </button>

                    {/* resize handle */}
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 bg-purple-500 rounded-tl cursor-se-resize opacity-0 group-hover/sig:opacity-100 transition-opacity"
                      style={{ touchAction: 'none' }}
                      onPointerDown={e => onResizeDown(e, sig.id)}
                      onPointerMove={e => onResizeMove(e, sig.id)}
                      onPointerUp={onResizeUp}
                    />
                  </div>
                ))}
              </div>

              {signatures.length > 0 && (
                <p className="text-xs text-slate-400 text-center">Drag to reposition · corner handle to resize · hover for delete</p>
              )}
            </div>

            {/* Right — signature creator */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
                <p className="text-xs sm:text-sm font-medium text-slate-700 uppercase tracking-widest">Create Signature</p>

                {/* Draw / Type toggle */}
                <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
                  {(['draw', 'type'] as const).map(m => (
                    <button key={m} onClick={() => { setSignMode(m); setSignatureData(null); }}
                      className={`flex-1 py-2.5 sm:py-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-widest rounded-lg transition-all ${signMode === m ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}>
                      {m === 'draw' ? <PenLine className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />} {m}
                    </button>
                  ))}
                </div>

                {/* Pen options */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <label className="font-outfit text-[11px] font-medium uppercase tracking-widest text-slate-400 w-10">Color</label>
                    <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shadow-sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="font-outfit text-[11px] font-medium uppercase tracking-widest text-slate-400 w-10">Size</label>
                    <input type="range" min={1} max={6} step={0.5} value={penSize} onChange={e => setPenSize(Number(e.target.value))}
                      className="flex-1 accent-purple-500 h-6" />
                    <span className="text-xs font-medium text-slate-500 w-6 text-right">{penSize}</span>
                  </div>
                </div>

                {/* Draw canvas */}
                {signMode === 'draw' && (
                  <div className="space-y-2">
                    <canvas
                      ref={canvasRef}
                      width={700}
                      height={180}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      onTouchCancel={stopDrawing}
                      className="w-full h-[120px] sm:h-[150px] rounded-xl border-2 border-slate-200 bg-white cursor-crosshair"
                      style={{ touchAction: 'none', display: 'block' }}
                    />
                    <button onClick={clearCanvas}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Eraser size={13} /> Clear
                    </button>
                  </div>
                )}

                {/* Type input */}
                {signMode === 'type' && (
                  <input
                    type="text"
                    value={typedText}
                    onChange={e => setTypedText(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-2xl text-center bg-white outline-none focus:border-purple-400"
                    style={{ fontFamily: '"Brush Script MT","Dancing Script",cursive', color: penColor, userSelect: 'text', WebkitUserSelect: 'text' }}
                  />
                )}

                {/* Signature preview */}
                {signatureData && (
                  <div className="border-2 border-dashed border-purple-200 rounded-xl p-2 bg-white">
                    <p className="font-outfit text-[11px] font-medium uppercase tracking-widest text-slate-400 mb-1">Preview</p>
                    <img src={signatureData} alt="preview" className="max-h-16 mx-auto" />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button onClick={createSignature}
                    className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium text-sm transition-colors">
                    ✓ Create Signature
                  </button>
                  {signatureData && (
                    <button onClick={placeSignature}
                      className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
                      <Move size={14} /> Place on Document
                    </button>
                  )}
                </div>
              </div>

              {/* Download */}
              {signatures.length > 0 && (
                <button onClick={handleDownload} disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-medium text-base shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-60">
                  {processing
                    ? <><Loader2 className="animate-spin" size={20} /> Processing…</>
                    : <><Download size={20} /> Download Signed PDF</>}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {mode === 'done' && (
          <div className="text-center space-y-6 sm:space-y-8 py-4 sm:py-6">
            <div className="inline-flex p-6 sm:p-8 rounded-full bg-green-100 text-green-500">
              <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Document Signed!</h3>
              <p className="text-sm text-slate-500 font-medium mt-1 px-4">Your signed PDF is ready to download.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a href={result!} download={`signed_${file?.name ?? 'document.pdf'}`}
                className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium text-lg flex items-center justify-center gap-3 shadow-lg">
                <Download size={22} /> Download
              </a>
              <button onClick={reset}
                className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-medium transition-all">
                Sign Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}



