"use client";

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, Download, Loader2, X, ChevronRight, CheckCircle2, Wand2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
}

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

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessing(true);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const pageImages: string[] = [];
        
        for (let i = 1; i <= Math.min(pdf.numPages, 2); i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          if (context) {
            await page.render({ canvasContext: context, viewport, canvas: canvas }).promise;
            pageImages.push(canvas.toDataURL('image/jpeg', 0.9));
          }
        }
        
        setPages(pageImages);
        setStep(2);
      } catch (err) {
        console.error(err);
        alert("Could not load PDF. Is it password protected? (Please remove password first)");
      } finally {
        setProcessing(false);
      }
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
      
      const frontImg = await pdfDoc.embedJpg(front);
      const CARD_WIDTH = 243.78; // ~86mm
      const CARD_HEIGHT = 153.07; // ~54mm
      
      page.drawImage(frontImg, {
        x: (page.getWidth() - CARD_WIDTH) / 2,
        y: page.getHeight() - 150,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      });

      if (back) {
        const backImg = await pdfDoc.embedJpg(back);
        page.drawImage(backImg, {
          x: (page.getWidth() - CARD_WIDTH) / 2,
          y: page.getHeight() - 150 - CARD_HEIGHT - 20,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        });
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
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-500 text-white shadow-lg">
              <Wand2 size={28} />
            </div>
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Aadhar Cropper</h2>
              <p className="text-slate-500 font-medium text-sm">Perfect ID card formatting for high-quality printing.</p>
            </div>
          </div>
          {/* Step Indicator */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                step >= s + 1 || (step === 4 && s === 3) ? 'bg-green-500 text-white' :
                step === s ? 'bg-red-500 text-white animate-pulse' :
                'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {step > s || (step === 4 && s === 3) ? <CheckCircle2 size={14} /> : s}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 sm:p-20 group hover:border-red-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
            <input type="file" onChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <div className="flex flex-col items-center text-center space-y-5 pointer-events-none">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-red-500 group-hover:scale-110 transition-transform">
                <Upload size={44} />
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Upload E-Aadhar PDF</div>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed">We'll help you crop and format it to standard ID card dimensions automatically.</p>
              <div className="flex items-center gap-3 pt-2">
                <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-black rounded-full border border-red-100">PDF</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-black rounded-full">JPG</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-black rounded-full">PNG</span>
              </div>
            </div>
            {processing && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center rounded-2xl">
                <Loader2 className="animate-spin text-red-500" size={48} />
              </div>
            )}
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div className="space-y-5 animate-in zoom-in duration-500">
            {/* Cropper — tall enough to work comfortably */}
            <div className="relative h-[500px] sm:h-[560px] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
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
          <div className="py-8 space-y-8 animate-in zoom-in duration-700 text-center">
            <div className="p-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 inline-block">
              <CheckCircle2 size={64} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Your Card is Ready!</h3>
              <p className="text-slate-500 font-medium max-w-lg mx-auto text-sm">Standard A4 format with both sides optimized for high-quality printing.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={result} download="Aadhar_Card_Print.pdf"
                className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-lg font-black shadow-xl flex items-center justify-center gap-3 transition-all">
                <Download size={22} /> Download Printable PDF
              </a>
              <button onClick={() => window.location.reload()}
                className="sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Crop Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
