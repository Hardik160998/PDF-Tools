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
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-left space-y-2">
              <div className="inline-flex p-4 rounded-3xl bg-red-500 text-white shadow-lg mb-2">
                 <Wand2 size={32} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Aadhar Cropper</h2>
              <p className="text-slate-500 font-medium">Perfect ID card formatting for high-quality printing.</p>
           </div>
           
           {/* Step Indicator */}
           <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {[1, 2, 3].map(s => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= s + 1 || (step === 4 && s === 3) ? 'bg-green-500 text-white' : (step === s ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-400')}`}>
                   {step > s || (step === 4 && s === 3) ? <CheckCircle2 size={16} /> : s}
                </div>
              ))}
           </div>
        </div>

        {step === 1 && (
          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 group hover:border-red-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
            <input type="file" onChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-red-500 group-hover:scale-110 transition-transform">
                <Upload size={48} />
              </div>
              <div className="text-2xl font-black tracking-tight">Upload E-Aadhar PDF</div>
              <p className="text-slate-500 max-w-sm mx-auto">We'll help you crop and format it to standard ID card dimensions automatically.</p>
            </div>
            {processing && <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center rounded-[2.5rem]"><Loader2 className="animate-spin text-red-500" size={64} /></div>}
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div className="space-y-10 animate-in zoom-in duration-500">
            <div className="relative h-[450px] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
              <Cropper
                image={pages[step === 2 ? 0 : (pages.length > 1 ? 1 : 0)]}
                crop={crop}
                zoom={zoom}
                aspect={AADHAR_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{ containerClassName: 'rounded-3xl' }}
              />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6 flex-1 w-full max-w-lg text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zoom Level</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
               </div>
               
               <div className="flex gap-4 w-full md:w-auto">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mr-4 self-center">
                    {step === 2 ? "Crop Front Side" : "Crop Back Side"}
                 </h3>
                 <button onClick={nextStep} disabled={processing} className="flex-1 md:flex-none py-5 px-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3">
                    {processing ? <Loader2 className="animate-spin" /> : <ChevronRight />}
                    {step === 2 ? "Next" : "Finalize"}
                 </button>
               </div>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="py-12 space-y-12 animate-in zoom-in duration-700">
            <div className="p-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 scale-110 inline-block">
               <CheckCircle2 size={80} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">Your Card is Ready!</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest max-w-lg mx-auto">Standard A4 format with both sides optimized for high-quality printing.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href={result} download="Aadhar_Card_Print.pdf" className="flex-1 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-2xl font-black shadow-xl flex items-center justify-center gap-4">
                <Download size={28} /> Download Printable PDF
              </a>
              <button onClick={() => window.location.reload()} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all">
                Crop Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
