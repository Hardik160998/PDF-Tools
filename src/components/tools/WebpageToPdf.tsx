"use client";

import { useState } from "react";
import { Globe, Download, Loader2, X, CheckCircle2, Link, Sparkles, Zap, ShieldCheck, Layers, Lock, Trash2, Smartphone, Rocket, RefreshCw, FileText } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import OutOfCreditsModal from "@/components/credits/OutOfCreditsModal";

export default function WebpageToPdf({ id: _id }: { id: string }) {
  const { remaining, isGuest, isPremium, deductCredit } = useCredits();
  const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const ACCENT = "#0ea5e9";
  const ACCENT_GRADIENT = "linear-gradient(135deg,#0ea5e9,#0369a1)";

  const isValidUrl = (val: string) => {
    try { new URL(val.startsWith("http") ? val : `https://${val}`); return true; } catch { return false; }
  };

  const handleConvert = async () => {
    if (!isPremium && remaining <= 0) {
      setOutOfCreditsOpen(true);
      return;
    }
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
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.error("Conversion API error response:", text);
          throw new Error(`Server error (${res.status}). Please try again later.`);
        }
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

  const handleDownloadClick = () => {
    if (!isPremium && remaining <= 0) {
      setOutOfCreditsOpen(true);
      return;
    }
    deductCredit("webpage-to-pdf");
    if (resultUrl) {
      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = `${hostname}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-6 text-left">
      <OutOfCreditsModal isOpen={outOfCreditsOpen} onClose={() => setOutOfCreditsOpen(false)} isGuest={isGuest} />
      <div className="w-full space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-5 sm:p-10 min-h-[600px] flex flex-col relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 dark:bg-sky-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          
          <div className="relative text-center space-y-4 mb-10">
            <div className="inline-flex p-4 rounded-2xl text-white shadow-lg mx-auto" style={{ background: ACCENT_GRADIENT, boxShadow: `0 10px 20px -5px ${ACCENT}44` }}>
              <Globe size={32} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Webpage to PDF
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              Enter any website URL and convert it to a printable, high-fidelity PDF instantly.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center animate-in fade-in duration-500 w-full max-w-3xl mx-auto">
            
            {/* Feature pills when empty */}
            {!resultUrl && !processing && (
              <div className="hidden sm:flex items-center justify-center gap-6 w-full mb-6">
                {[
                  { icon: Zap,        title: "Instant",    desc: "In your browser" },
                  { icon: ShieldCheck, title: "Private",   desc: "No server upload" },
                  { icon: Layers,      title: "Lossless",  desc: "Format preserved" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                      <f.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!resultUrl ? (
              <div className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-6 sm:p-10 flex flex-col items-center justify-center transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-500 relative overflow-hidden mb-6">
                
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-8 tracking-tight text-center">
                  Paste Webpage Link
                </h3>

                <div className="w-full max-w-2xl mx-auto space-y-6">
                  <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all bg-slate-50 dark:bg-slate-950 shadow-inner ${error ? "border-red-400" : "border-slate-200 dark:border-slate-800 focus-within:border-sky-400 focus-within:shadow-sky-500/10"}`}>
                    <div className="hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shrink-0 ml-1" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                      <Link size={20} />
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={e => { setUrl(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleConvert()}
                      onClick={() => {
                        if (!isPremium && remaining <= 0) {
                          setOutOfCreditsOpen(true);
                        }
                      }}
                      onFocus={(e) => {
                        if (!isPremium && remaining <= 0) {
                          e.target.blur();
                          setOutOfCreditsOpen(true);
                        }
                      }}
                      placeholder="https://en.wikipedia.org/wiki/PDF"
                      className="flex-1 w-full sm:w-auto bg-transparent text-slate-900 dark:text-white font-bold text-sm sm:text-base outline-none placeholder:text-slate-400 min-w-0 px-4 sm:px-2 py-3 sm:py-0 text-center sm:text-left"
                      autoFocus
                    />
                    {url && !processing && (
                      <button onClick={() => { setUrl(""); setError(""); }} className="hidden sm:flex text-slate-400 hover:text-red-500 transition-colors shrink-0 px-4">
                        <X size={20} />
                      </button>
                    )}
                    <button
                      onClick={handleConvert}
                      disabled={processing || !url.trim()}
                      className="w-full sm:w-auto px-8 py-4 sm:py-4 text-white rounded-xl sm:rounded-2xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 uppercase tracking-widest"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      {processing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                      {processing ? "Converting..." : "Convert"}
                    </button>
                  </div>
                  {error && <p className="text-[11px] sm:text-xs text-red-500 font-bold uppercase tracking-widest text-center animate-pulse flex items-center justify-center gap-2"><X size={14} /> {error}</p>}
                </div>

                {/* Quick examples */}
                {!processing && (
                  <div className="flex flex-wrap gap-2 justify-center mt-8">
                    {["wikipedia.org", "github.com", "news.ycombinator.com"].map(ex => (
                      <button key={ex} onClick={() => {
                        if (!isPremium && remaining <= 0) {
                          setOutOfCreditsOpen(true);
                          return;
                        }
                        setUrl(`https://${ex}`); 
                        setError(""); 
                      }}
                      className="px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-sky-500 hover:border-sky-200 dark:hover:border-sky-800 transition-all uppercase tracking-widest shadow-sm">
                        {ex}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/30"><CheckCircle2 size={32} /></div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Success!</h4>
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-md">{hostname} converted to PDF.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <button onClick={handleDownloadClick} className="px-8 py-4 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto" style={{ background: ACCENT_GRADIENT }}>
                      <Download size={18} /> Download PDF
                    </button>
                    <button onClick={reset} className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                      <RefreshCw size={18} /> Convert Another
                    </button>
                  </div>
                </div>

                <div className="max-w-xs mx-auto">
                   <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative">
                     <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 relative border border-slate-100 dark:border-slate-700 shadow-inner flex items-center justify-center">
                       <FileText size={64} className="text-slate-200 dark:text-slate-700" />
                     </div>
                     <div className="text-center px-2 pb-1">
                       <p className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight">{hostname}.pdf</p>
                       <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1">Ready for Download</p>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* Feature grid when empty */}
            {!resultUrl && !processing && (
              <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                {[
                  { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
                  { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
                  { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
                  { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
                ].map((f, i) => (
                  <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}10` }}>
                      <f.icon size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{f.title}</p>
                      <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
