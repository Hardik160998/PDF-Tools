"use client";

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Download, Loader2, ChevronRight, CheckCircle2, Wand2, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const AADHAR_ASPECT = 86 / 54; // Standard ID Card aspect ratio

export default function AadharCropper({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [step, setStep] = useState(1); // 1: Upload, 2: Crop Front, 3: Crop Back, 4: Result
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [uploadMode, setUploadMode] = useState<'pdf' | 'img' | null>(null);
  const [frontPage, setFrontPage] = useState<string | null>(null);
  const [backPage, setBackPage] = useState<string | null>(null);
  const [loadingSlot, setLoadingSlot] = useState<'front' | 'back' | null>(null);

  const fileToDataUrl = async (selectedFile: File): Promise<string> => {
    if (selectedFile.type.startsWith('image/')) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
    }
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d')!;
    await page.render({ canvasContext: context, viewport, canvas }).promise;
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const onSlotFileChange = async (e: React.ChangeEvent<HTMLInputElement>, slot: 'front' | 'back') => {
    if (!e.target.files?.[0]) return;
    setLoadingSlot(slot);
    try {
      const dataUrl = await fileToDataUrl(e.target.files[0]);
      if (slot === 'front') setFrontPage(dataUrl);
      else setBackPage(dataUrl);
    } catch (err) {
      console.error(err);
      alert('Could not load file. If PDF is password protected, please remove the password first.');
    } finally {
      setLoadingSlot(null);
    }
  };

  const startCropping = () => {
    const combined: string[] = [];
    if (frontPage) combined.push(frontPage);
    if (backPage) combined.push(backPage);
    setPages(combined);
    setStep(2);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setProcessing(true);
    try {
      const dataUrl = await fileToDataUrl(selectedFile);
      setPages([dataUrl]);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Could not load file. If PDF is password protected, please remove the password first.');
    } finally {
      setProcessing(false);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 1.0);
  };

  const nextStep = async () => {
    if (step === 2) {
      const img = await getCroppedImg(pages[0], croppedAreaPixels);
      setFrontImage(img);
      setStep(pages.length > 1 ? 3 : 4);
      if (pages.length === 1) await generateFinalPdf(img, null);
    } else if (step === 3) {
      const img = await getCroppedImg(pages[pages.length > 1 ? 1 : 0], croppedAreaPixels);
      setBackImage(img);
      setStep(4);
      await generateFinalPdf(frontImage!, img);
    }
  };

  const generateFinalPdf = async (front: string, back: string | null) => {
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const W = page.getWidth();
      const H = page.getHeight();
      const MARGIN = 40;
      // Scale card to fill page width with margins
      const CARD_WIDTH = W - MARGIN * 2;
      const CARD_HEIGHT = CARD_WIDTH * (54 / 86); // maintain aspect ratio
      const cx = MARGIN;

      const frontImg = await pdfDoc.embedJpg(front);

      if (back) {
        const backImg = await pdfDoc.embedJpg(back);
        const GAP = 20;
        const totalH = CARD_HEIGHT * 2 + GAP;
        // Center the block vertically
        const blockStartY = (H - totalH) / 2;
        // Front on top (pdf-lib Y=0 is bottom)
        page.drawImage(frontImg, { x: cx, y: blockStartY + CARD_HEIGHT + GAP, width: CARD_WIDTH, height: CARD_HEIGHT });
        page.drawImage(backImg,  { x: cx, y: blockStartY,                      width: CARD_WIDTH, height: CARD_HEIGHT });
      } else {
        // Only front: vertically centered
        page.drawImage(frontImg, { x: cx, y: (H - CARD_HEIGHT) / 2, width: CARD_WIDTH, height: CARD_HEIGHT });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-10 px-3 sm:px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-red-500 text-white shadow-lg shrink-0">
              <Wand2 size={22} />
            </div>
            <div className="text-left">
              <h2 className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Aadhar Cropper</h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm hidden sm:block">Perfect ID card formatting for high-quality printing.</p>
            </div>
          </div>
          {/* Step Indicator */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                step >= s + 1 || (step === 4 && s === 3) ? 'bg-green-500 text-white' :
                step === s ? 'bg-red-500 text-white animate-pulse' :
                'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {step > s || (step === 4 && s === 3) ? <CheckCircle2 size={12} /> : s}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-center text-slate-500 text-sm font-medium">Upload front and back of your Aadhar card</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Front View */}
              {(['front', 'back'] as const).map((slot) => {
                const isLoading = loadingSlot === slot;
                const preview = slot === 'front' ? frontPage : backPage;
                const color = slot === 'front' ? 'red' : 'blue';
                return (
                  <div key={slot} className={`relative group border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 ${
                    preview ? `border-${color}-400 bg-${color}-50/20` : `border-slate-200 dark:border-slate-700 hover:border-${color}-500 hover:bg-${color}-50/30 dark:hover:bg-${color}-500/5`
                  }`}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => onSlotFileChange(e, slot)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center text-center space-y-3 pointer-events-none">
                      {isLoading ? (
                        <Loader2 className={`animate-spin text-${color}-500`} size={36} />
                      ) : preview ? (
                        <img src={preview} alt={slot} className="w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className={`p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-${color}-500 group-hover:scale-110 transition-transform`}>
                          <FileText size={36} />
                        </div>
                      )}
                      <div>
                        <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                          {preview ? `${slot === 'front' ? 'Front' : 'Back'} Uploaded ✓` : `Add ${slot === 'front' ? 'Front' : 'Back'} View`}
                        </div>
                        <p className="text-slate-500 text-xs mt-1">{slot === 'front' ? 'Front side of Aadhar card' : 'Back side of Aadhar card'}</p>
                      </div>
                      <span className={`px-3 py-1 bg-${color}-50 text-${color}-500 text-xs font-black rounded-full border border-${color}-100`}>
                        PDF / Image
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {(frontPage || backPage) && (
              <button
                onClick={startCropping}
                disabled={!frontPage}
                className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-black text-base shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <ChevronRight size={18} />
                {frontPage && backPage ? 'Crop Both Sides' : 'Crop Front Side Only'}
              </button>
            )}
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div className="space-y-5 animate-in zoom-in duration-500">
            {/* Cropper — tall enough to work comfortably */}
            <div className="relative h-[320px] sm:h-[560px] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
              <Cropper
                image={pages[step === 2 ? 0 : (pages.length > 1 ? 1 : 0)]}
                crop={crop}
                zoom={zoom}
                aspect={AADHAR_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{ containerClassName: 'rounded-2xl' }}
              />
            </div>

            {/* Controls row */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Zoom slider */}
              <div className="flex items-center gap-3 flex-1 w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <span className="text-xs font-black text-slate-400 w-8 text-right">{zoom.toFixed(1)}x</span>
              </div>

              {/* Step label + Next button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-black text-slate-700 dark:text-white whitespace-nowrap">
                  {step === 2 ? 'Crop Front Side' : 'Crop Back Side'}
                </span>
                <button
                  onClick={nextStep}
                  disabled={processing}
                  className="flex-1 sm:flex-none py-3 px-8 bg-red-500 hover:bg-red-600 text-white rounded-xl text-base font-black shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {processing ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                  {step === 2 ? 'Next' : 'Finalize'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="py-4 sm:py-8 space-y-5 sm:space-y-8 animate-in zoom-in duration-700 text-center">
            <div className="p-5 sm:p-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Your Card is Ready!</h3>
              <p className="text-slate-500 font-medium max-w-lg mx-auto text-xs sm:text-sm">Standard A4 format with both sides optimized for high-quality printing.</p>
            </div>
            <div className="flex flex-col gap-3">
              <a href={result} download="Aadhar_Card_Print.pdf"
                className="w-full py-3.5 sm:py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-base sm:text-lg font-black shadow-xl flex items-center justify-center gap-2 transition-all">
                <Download size={20} /> Download Printable PDF
              </a>
              <button onClick={() => { setStep(1); setPages([]); setFrontImage(null); setBackImage(null); setResult(null); setUploadMode(null); setZoom(1); setCrop({ x: 0, y: 0 }); setFrontPage(null); setBackPage(null); }}
                className="w-full py-3.5 sm:py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all text-sm sm:text-base">
                Crop Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
