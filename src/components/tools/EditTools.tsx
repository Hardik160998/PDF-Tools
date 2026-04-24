"use client";

import { useState } from 'react';
import { Upload, Download, Loader2, X, FileText, Stamp, Hash, Settings, CheckCircle2, Type, ImageIcon } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function EditTools({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('DRAFT');
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, string>>({
    title: '', author: '', subject: '', keywords: '', creator: '', producer: '', 
    language: '', creator_tool: '', create_date: '', modify_date: '', metadata_date: ''
  });
  const [origMetadata, setOrigMetadata] = useState<Record<string, string>>({
    title: '', author: '', subject: '', keywords: '', creator: '', producer: '', 
    language: '', creator_tool: '', create_date: '', modify_date: '', metadata_date: ''
  });

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    try {
      const pad = (num: number) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch (e) {
      return '';
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResult(null);

      if (id === 'metadata') {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const meta = {
            title: pdfDoc.getTitle() || '',
            author: pdfDoc.getAuthor() || '',
            subject: pdfDoc.getSubject() || '',
            keywords: pdfDoc.getKeywords() || '',
            creator: pdfDoc.getCreator() || '',
            producer: pdfDoc.getProducer() || '',
            language: (pdfDoc as any).getLanguage?.() || '',
            creator_tool: pdfDoc.getCreator() || '',
            create_date: formatDateForInput(pdfDoc.getCreationDate()),
            modify_date: formatDateForInput(pdfDoc.getModificationDate()),
            metadata_date: formatDateForInput(pdfDoc.getModificationDate()),
          };
          setMetadata(meta);
          setOrigMetadata(meta);
        } catch (err) {
          console.error("Meta extraction error:", err);
        }
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      if (id === 'watermark') {
        let embeddedImage: any = null;
        let imgDims = { width: 0, height: 0 };
        
        if (watermarkType === 'image' && watermarkImage) {
          const imgBytes = await watermarkImage.arrayBuffer();
          if (watermarkImage.type === 'image/png') {
            embeddedImage = await pdfDoc.embedPng(imgBytes);
          } else {
            embeddedImage = await pdfDoc.embedJpg(imgBytes);
          }
          const MAX_WIDTH = 400; // max width for watermark
          const scale = embeddedImage.width > MAX_WIDTH ? MAX_WIDTH / embeddedImage.width : 1;
          imgDims = { width: embeddedImage.width * scale, height: embeddedImage.height * scale };
        }

        pages.forEach((page) => {
          const { width, height } = page.getSize();
          
          if (watermarkType === 'text') {
            const textSize = 60;
            const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, textSize);
            const textHeight = helveticaFont.heightAtSize(textSize);
            
            page.drawText(watermarkText, {
              x: width / 2 - textWidth / 2, // Centered X
              y: height / 2 - textHeight / 2, // Centered Y
              size: textSize,
              font: helveticaFont,
              color: rgb(0.8, 0.8, 0.8),
              opacity: 0.4,
            });
          } else if (embeddedImage) {
            page.drawImage(embeddedImage, {
              x: width / 2 - imgDims.width / 2, // Centered X
              y: height / 2 - imgDims.height / 2, // Centered Y
              width: imgDims.width,
              height: imgDims.height,
              opacity: 0.4, // Match text opacity
            });
          }
        });
      } else if (id === 'page-numbers') {
        pages.forEach((page, i) => {
          page.drawText(`${i + 1}`, {
            x: page.getSize().width - 40,
            y: 30,
            size: 14,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        });
      } else if (id === 'metadata') {
        pdfDoc.setTitle(metadata.title);
        pdfDoc.setAuthor(metadata.author);
        pdfDoc.setSubject(metadata.subject);
        pdfDoc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));
        pdfDoc.setCreator(metadata.creator);
        pdfDoc.setProducer(metadata.producer);
        if ((pdfDoc as any).setLanguage) (pdfDoc as any).setLanguage(metadata.language);
        if (metadata.create_date) pdfDoc.setCreationDate(new Date(metadata.create_date));
        if (metadata.modify_date) pdfDoc.setModificationDate(new Date(metadata.modify_date));
      }

      const pdfBytes = await pdfDoc.save();
      setResult(URL.createObjectURL(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
    } catch (err) {
      console.error(err);
      alert("Error editing PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const getToolInfo = () => {
    switch(id) {
      case 'watermark': return { title: 'Watermark', icon: Stamp, color: 'bg-purple-500' };
      case 'page-numbers': return { title: 'Page Numbers', icon: Hash, color: 'bg-indigo-500' };
      case 'metadata': return { title: 'Edit Metadata', icon: Settings, color: 'bg-slate-500' };
      default: return { title: 'Edit PDF', icon: Settings, color: 'bg-slate-500' };
    }
  };

  const info = getToolInfo();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-10">
        <div className="space-y-4">
          <div className={`inline-flex p-5 rounded-3xl ${info.color} text-white shadow-lg`}>
             <info.icon size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {info.title}
          </h2>
          <p className="text-slate-500 font-medium">Customize your documents with professional grade editing.</p>
        </div>

        {!result ? (
          <div className="space-y-8">
            {!file ? (
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 group hover:border-purple-500 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                <input type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl inline-block text-purple-500 group-hover:scale-110 transition-transform">
                    <Upload size={48} />
                  </div>
                  <div className="text-2xl font-black tracking-tight">Select PDF File</div>
                  <p className="text-slate-500">or drop PDF here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <div className="flex items-center gap-4 text-left">
                     <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-purple-500">
                       <FileText size={18} />
                     </div>
                     <p className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[150px]">{file.name}</p>
                  </div>
                  <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                     <X size={18} />
                  </button>
                </div>

                {id === 'watermark' && (
                  <div className="space-y-4 text-left bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                     <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl">
                       <button onClick={() => setWatermarkType('text')} className={`flex-1 py-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${watermarkType === 'text' ? 'bg-white dark:bg-slate-800 shadow-sm text-purple-500' : 'text-slate-400 hover:text-slate-900'}`}>
                         <Type size={14} /> Text
                       </button>
                       <button onClick={() => setWatermarkType('image')} className={`flex-1 py-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${watermarkType === 'image' ? 'bg-white dark:bg-slate-800 shadow-sm text-purple-500' : 'text-slate-400 hover:text-slate-900'}`}>
                         <ImageIcon size={14} /> Image
                       </button>
                     </div>

                     {watermarkType === 'text' ? (
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Watermark Text</label>
                         <input 
                           type="text" 
                           value={watermarkText || ''} 
                           onChange={(e) => setWatermarkText(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 ring-purple-500/20 font-black"
                         />
                       </div>
                     ) : (
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Upload Image Logo</label>
                         <input 
                           type="file" 
                           accept="image/png, image/jpeg"
                           onChange={(e) => setWatermarkImage(e.target.files?.[0] || null)}
                           className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-purple-50 dark:file:bg-purple-500/10 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 cursor-pointer"
                         />
                       </div>
                     )}
                  </div>
                )}

                {id === 'metadata' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    {Object.entries(metadata).map(([key, value]) => {
                      const isDate = key.includes('date');
                      return (
                        <div key={key} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">{key.replace('_', ' ')}</label>
                            <span className="text-[8px] font-black text-slate-300 truncate max-w-[80px]" title={origMetadata[key]}>
                              Old: {origMetadata[key] || 'None'}
                            </span>
                          </div>
                          <input 
                            type={isDate ? "datetime-local" : "text"} 
                            value={value} 
                            onChange={(e) => setMetadata({ ...metadata, [key]: e.target.value })}
                            placeholder={`Enter ${key}...`}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 ring-slate-500/20 font-bold transition-all"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                <button 
                  onClick={handleProcess} 
                  disabled={processing}
                  className={`w-full py-5 ${info.color} hover:opacity-90 text-white rounded-2xl text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all`}
                >
                  {processing ? <Loader2 className="animate-spin" /> : <info.icon size={28} className="fill-white/20" />}
                  {processing ? 'Processing...' : 'Apply ' + info.title}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-700">
             <div className="p-12 rounded-full bg-slate-100 dark:bg-slate-700 text-purple-500 scale-110 inline-block">
                <CheckCircle2 size={80} />
             </div>
             <div className="space-y-4">
                <h3 className="text-4xl font-black">Changes Applied!</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest">Document optimized and ready.</p>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={result} download={`edited_${file?.name}`} className={`flex-1 py-5 ${info.color} text-white rounded-2xl text-2xl font-black shadow-xl flex items-center justify-center gap-4`}>
                   <Download size={28} /> Download
                </a>
                <button 
                  onClick={() => {
                    setFile(null); 
                    setResult(null);
                    setMetadata({ 
                      title: '', author: '', subject: '', keywords: '', creator: '', producer: '', 
                      language: '', creator_tool: '', create_date: '', modify_date: '', metadata_date: '' 
                    });
                    setOrigMetadata({ 
                      title: '', author: '', subject: '', keywords: '', creator: '', producer: '', 
                      language: '', creator_tool: '', create_date: '', modify_date: '', metadata_date: '' 
                    });
                  }} 
                  className="px-10 py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl font-bold transition-all"
                >
                   Start Over
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
