"use client";

import { useState } from "react";
import { Globe, Download, Loader2, X, CheckCircle2, Link, Sparkles } from "lucide-react";

export default function WebpageToPdf({ id: _id }: { id: string }) {
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const isValidUrl = (val: string) => {
    try { new URL(val.startsWith("http") ? val : `https://${val}`); return true; } catch { return false; }
  };

  const handleConvert = async () => {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    if (!isValidUrl(fullUrl)) { setError("Please enter a valid website URL."); return; }
    setError("");
    setProcessing(true);
    setInputUrl(fullUrl);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "webpage-to-pdf", url: fullUrl }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Conversion failed");
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setResultUrl(objectUrl);
    } catch (err: any) {
      setError(err.message || "Failed to convert. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setUrl(""); setResultUrl(null); setError(""); setInputUrl(""); };

  const hostname = (() => { try { return new URL(inputUrl).hostname; } catch { return inputUrl; } })();

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-12 px-2 sm:px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] sm:rounded-[2.5rem] p-4 sm:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 sm:space-y-10">

        {/* Header */}
        <div className="space-y-2 sm:space-y-4">
          <div className="inline-flex p-3 sm:p-5 rounded-xl sm:rounded-3xl text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0ea5e9,#0369a1)" }}>
            <Globe size={24} className="sm:w-10 sm:h-10" />
          </div>
          <h2 className="font-outfit text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Webpage to PDF</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Enter any website URL and convert it to a PDF instantly.</p>
        </div>

        {!resultUrl ? (
          <div className="space-y-4 sm:space-y-6">
            {/* URL Input */}
            <div className="space-y-2 sm:space-y-3 text-left">
              <label className="font-outfit text-[11px] font-black uppercase tracking-widest text-slate-400">Website URL</label>
              <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all bg-slate-50 dark:bg-slate-900/50 ${error ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus-within:border-sky-400"}`}>
                <Link size={16} className="text-slate-400 shrink-0 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleConvert()}
                  placeholder="https://example.com"
                  className="flex-1 bg-transparent text-slate-900 dark:text-white font-medium text-sm sm:text-base outline-none placeholder:text-slate-400 min-w-0"
                  autoFocus
                />
                {url && (
                  <button onClick={() => { setUrl(""); setError(""); }} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                    <X size={16} className="sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
              {error && <p className="text-[10px] sm:text-xs text-red-500 font-medium flex items-center gap-1">⚠ {error}</p>}
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Works with any public webpage — news, docs, blogs, etc.</p>
            </div>

            {/* Quick examples */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              {["wikipedia.org", "github.com", "news.ycombinator.com"].map(ex => (
                <button key={ex} onClick={() => { setUrl(`https://${ex}`); setError(""); }}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 hover:bg-sky-100 transition-colors">
                  {ex}
                </button>
              ))}
            </div>

            {/* Convert button */}
            <button
              onClick={handleConvert}
              disabled={processing || !url.trim()}
              className="w-full py-3.5 sm:py-5 text-white rounded-xl sm:rounded-2xl text-base sm:text-2xl font-black shadow-xl flex items-center justify-center gap-3 sm:gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#0ea5e9,#0369a1)", boxShadow: "0 8px 32px -8px rgba(14,165,233,0.4)" }}
            >
              {processing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="sm:w-7 sm:h-7 fill-white/20" />}
              {processing ? "Converting Webpage…" : "Convert to PDF"}
            </button>

            {processing && (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Rendering page, this may take a few seconds…</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-10 animate-in zoom-in duration-500">
            <div className="inline-flex p-6 sm:p-10 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-500">
              <CheckCircle2 size={40} className="sm:w-[72px] sm:h-[72px]" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">Conversion Complete!</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{hostname} → PDF</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href={resultUrl}
                download={`${hostname}.pdf`}
                className="flex-1 py-3.5 sm:py-5 text-white rounded-xl sm:rounded-2xl text-base sm:text-lg sm:text-xl font-black shadow-xl flex items-center justify-center gap-2 sm:gap-3 transition-all"
                style={{ background: "linear-gradient(135deg,#0ea5e9,#0369a1)" }}
              >
                <Download size={20} className="sm:w-6 sm:h-6" /> Download PDF
              </a>
              <button onClick={reset} className="px-6 sm:px-10 py-3.5 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base">
                Convert Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
