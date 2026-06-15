"use client";

import { useState } from 'react';
import { Upload, Download, Loader2, X, FileText, Stamp, Hash, Settings, CheckCircle2, Type, ImageIcon, Plus, Lock, Trash2, Smartphone, Rocket, Zap, Shield, Sparkles } from 'lucide-react';
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

 const formatDateForInput = (date?: Date): string => {
 if (!date) return '';
 try {
 const pad = (n: number) => n.toString().padStart(2, '0');
 return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
 } catch {
 return '';
 }
 };

 const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 if (!e.target.files?.[0]) return;
 const selectedFile = e.target.files[0];
 setFile(selectedFile);
 setResult(null);

 if (id === 'metadata') {
 try {
 const pdfDoc = await PDFDocument.load(await selectedFile.arrayBuffer());
 const keywords = pdfDoc.getKeywords();
 const meta = {
 title: pdfDoc.getTitle() ?? '',
 author: pdfDoc.getAuthor() ?? '',
 subject: pdfDoc.getSubject() ?? '',
 keywords: Array.isArray(keywords) ? keywords.join(', ') : (keywords ?? ''),
 creator: pdfDoc.getCreator() ?? '',
 producer: pdfDoc.getProducer() ?? '',
 language: (pdfDoc as any).getLanguage?.() ?? '',
 creator_tool: pdfDoc.getCreator() ?? '',
 create_date: formatDateForInput(pdfDoc.getCreationDate()),
 modify_date: formatDateForInput(pdfDoc.getModificationDate()),
 metadata_date: formatDateForInput(pdfDoc.getModificationDate()),
 };
 setMetadata(meta);
 setOrigMetadata(meta);
 } catch (err) {
 console.error('Meta extraction error:', err);
 }
 }
 e.target.value = '';
 };

 const handleProcess = async () => {
 if (!file) return;
 setProcessing(true);
 try {
 const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
 const pages = pdfDoc.getPages();
 const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

 if (id === 'watermark') {
 let embeddedImage: any = null;
 let imgDims = { width: 0, height: 0 };

 if (watermarkType === 'image' && watermarkImage) {
 const imgBytes = await watermarkImage.arrayBuffer();
 embeddedImage = watermarkImage.type === 'image/png'
 ? await pdfDoc.embedPng(imgBytes)
 : await pdfDoc.embedJpg(imgBytes);
 const MAX_WIDTH = 400;
 const scale = embeddedImage.width > MAX_WIDTH ? MAX_WIDTH / embeddedImage.width : 1;
 imgDims = { width: embeddedImage.width * scale, height: embeddedImage.height * scale };
 }

 pages.forEach(page => {
 const { width, height } = page.getSize();
 if (watermarkType === 'text' && watermarkText) {
 const textSize = 60;
 const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, textSize);
 const textHeight = helveticaFont.heightAtSize(textSize);
 page.drawText(watermarkText, {
 x: width / 2 - textWidth / 2,
 y: height / 2 - textHeight / 2,
 size: textSize,
 font: helveticaFont,
 color: rgb(0.8, 0.8, 0.8),
 opacity: 0.4,
 });
 } else if (embeddedImage) {
 page.drawImage(embeddedImage, {
 x: width / 2 - imgDims.width / 2,
 y: height / 2 - imgDims.height / 2,
 width: imgDims.width,
 height: imgDims.height,
 opacity: 0.4,
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
 alert('Error editing PDF.');
 } finally {
 setProcessing(false);
 }
 };

 const getToolInfo = () => {
 switch (id) {
 case 'watermark': return { title: 'Watermark', icon: Stamp, color: 'bg-purple-500', hex: '#a855f7' };
 case 'page-numbers': return { title: 'Page Numbers', icon: Hash, color: 'bg-indigo-500', hex: '#6366f1' };
 case 'metadata': return { title: 'Edit Metadata', icon: Settings, color: 'bg-slate-500', hex: '#64748b' };
 default: return { title: 'Edit PDF', icon: Settings, color: 'bg-slate-500', hex: '#64748b' };
 }
 };

 const info = getToolInfo();

 return (
 <div className="w-full max-w-4xl mx-auto py-4 sm:py-12 px-2 sm:px-6 text-center">
 <div className="bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[48px] p-4 sm:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 sm:space-y-12 relative">
 <div className="space-y-3">
 <div className={`inline-flex p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl ${info.color} text-white shadow-xl shadow-indigo-500/20`}>
 <info.icon size={32} className="sm:w-9 sm:h-9" />
 </div>
 <h2 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
 {info.title}
 </h2>
 <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">Customize your documents with professional grade editing.</p>
 </div>

 {!result ? (
  <div className="space-y-6 flex-1 flex flex-col items-center w-full max-w-3xl mx-auto">
  <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mb-6">
  {[
  { icon: Zap, title: "Instant", desc: "Lightning fast processing" },
  { icon: Shield, title: "Private", desc: "Your files stay secure" },
  { icon: Sparkles, title: "Lossless", desc: "Perfect quality output" }
  ].map((f, i) => (
  <div key={i} className="flex items-center gap-3 pointer-events-none">
  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ color: info.hex, backgroundColor: `${info.hex}15` }}>
  <f.icon size={20} />
  </div>
  <div className="text-left">
  <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{f.title}</p>
  <p className="text-[11px] text-slate-400 font-medium tracking-wide">{f.desc}</p>
  </div>
  </div>
  ))}
  </div>

  {!file ? (
  <>
  <div className="relative w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-500 group overflow-hidden mb-6">
  <input type="file" onChange={onFileChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-30" />
  
  <div className="relative mb-8 group-hover:scale-105 transition-transform duration-300 pointer-events-none z-10">
  <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative z-10">
  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
  <div className="m-auto text-slate-300 dark:bg-slate-800">
  <info.icon size={32} />
  </div>
  </div>
  <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl z-20 ${info.color}`}>
  <Upload size={20} strokeWidth={3} />
  </div>
  <Plus size={16} className={`absolute -top-4 -left-6 opacity-60 text-slate-400`} />
  <Plus size={12} className={`absolute top-10 -right-8 opacity-60 text-slate-400`} />
  <Plus size={14} className={`absolute bottom-2 -left-8 opacity-60 text-slate-400`} />
  </div>

  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center pointer-events-none z-10">
  Drag & drop your PDF file here
  </h3>
  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 text-center pointer-events-none z-10">
  or click to <span style={{ color: info.hex }}>browse</span>
  </p>
  <p className="text-sm text-slate-400 font-medium mb-8 text-center pointer-events-none z-10">
  Supports single PDF file
  </p>

  <button className={`px-8 py-4 rounded-xl text-white text-base font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-20 flex items-center gap-3 ${info.color} pointer-events-none`}>
  <Plus size={20} /> SELECT PDF FILE
  </button>
  </div>

  <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/50 z-10 pointer-events-none">
  {[
  { icon: Lock, title: "100% Secure", desc: "Your files are safe" },
  { icon: Trash2, title: "Auto Delete", desc: "Files auto removed" },
  { icon: Smartphone, title: "Works Offline", desc: "No internet needed" },
  { icon: Rocket, title: "Super Fast", desc: "Built for speed" }
  ].map((f, i) => (
  <div key={i} className="flex flex-col xl:flex-row items-center justify-start gap-2 xl:gap-3 text-center xl:text-left">
  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ color: info.hex, backgroundColor: `${info.hex}10` }}>
  <f.icon size={16} />
  </div>
  <div>
  <p className="text-[10px] sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">{f.title}</p>
  <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden sm:block">{f.desc}</p>
  </div>
  </div>
  ))}
  </div>
  </>
  ) : (
 <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
 <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
 <div className="flex items-center gap-3 text-left min-w-0">
 <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-purple-500 shrink-0">
 <FileText size={16} />
 </div>
 <p className="font-medium text-slate-900 dark:text-white text-[11px] sm:text-sm truncate leading-tight">{file.name}</p>
 </div>
 <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0 rounded-lg">
 <X size={16} />
 </button>
 </div>

 {id === 'watermark' && (
 <div className="space-y-5 sm:space-y-6 text-left bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
 <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
 {(['text', 'image'] as const).map(type => (
 <button key={type} onClick={() => setWatermarkType(type)}
 className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-medium uppercase tracking-widest rounded-lg transition-all ${watermarkType === type ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
 {type === 'text' ? <Type size={14} /> : <ImageIcon size={14} />} {type}
 </button>
 ))}
 </div>

 {watermarkType === 'text' ? (
 <div className="space-y-2 px-1">
 <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Watermark Text</label>
 <input
 type="text"
 value={watermarkText || ''}
 onChange={(e) => setWatermarkText(e.target.value)}
 className="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 ring-purple-500/20 font-medium text-sm sm:text-base tracking-widest"
 />
 </div>
 ) : (
 <div className="space-y-2 px-1">
 <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Upload Image Logo</label>
 <div className="relative">
 <input
 type="file"
 accept="image/png, image/jpeg"
 onChange={(e) => setWatermarkImage(e.target.files?.[0] || null)}
 className="w-full text-[11px] sm:text-sm text-slate-500 file:mr-3 sm:file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
 />
 </div>
 </div>
 )}
 </div>
 )}

 {id === 'metadata' && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-left">
 {Object.entries(metadata).map(([key, value]) => {
 const isDate = key.includes('date');
 return (
 <div key={key} className="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2">
 <div className="flex flex-col gap-0.5">
 <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400">{key.replace('_', ' ')}</label>
 {origMetadata[key] && (
 <span className="text-[7px] sm:text-[8px] font-medium text-slate-400 opacity-60 break-all leading-tight" title={origMetadata[key]}>
 Original: {origMetadata[key]}
 </span>
 )}
 </div>
 <input
 type={isDate ? 'datetime-local' : 'text'}
 value={value || ''}
 onChange={(e) => setMetadata({ ...metadata, [key]: e.target.value || '' })}
 placeholder={`Enter ${key}...`}
 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 ring-indigo-500/20 font-bold tracking-tighter sm:tracking-widest transition-all placeholder:text-slate-200"
 />
 </div>
 );
 })}
 </div>
 )}

 <button
 onClick={handleProcess}
 disabled={processing}
 className={`w-full py-4 sm:py-5 ${info.color} hover:opacity-90 text-white rounded-2xl text-base sm:text-2xl font-medium shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3 sm:gap-4 transition-all active:scale-[0.98] disabled:opacity-50`}
 >
 {processing ? <Loader2 className="animate-spin" size={24} /> : <info.icon size={24} className="sm:w-7 sm:h-7" />}
 {processing ? 'Processing...' : `Apply ${info.title}`}
 </button>
 </div>
 )}
 </div>
 ) : (
 <div className="space-y-8 sm:space-y-12 animate-in zoom-in duration-700 py-4 sm:py-8">
 <div className="p-8 sm:p-12 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 scale-110 border border-green-500/20 shadow-xl shadow-green-500/10 inline-block">
 <CheckCircle2 size={60} className="sm:w-20 sm:h-20" />
 </div>
 <div className="space-y-2 sm:space-y-4">
 <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Changes Applied!</h3>
 <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-widest leading-relaxed">Document optimized and ready for use.</p>
 </div>
 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
 <a href={result} download={`edited_${file?.name}`}
 className={`flex-1 py-4 sm:py-5 ${info.color} text-white rounded-2xl text-lg sm:text-lg sm:text-xl font-medium shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all`}>
 <Download size={24} className="sm:w-7 sm:h-7" /> Download
 </a>
 <button
 onClick={() => {
 setFile(null);
 setResult(null);
 setWatermarkText('DRAFT');
 setWatermarkImage(null);
 setMetadata({
 title: '', author: '', subject: '', keywords: '', creator: '', producer: '',
 language: '', creator_tool: '', create_date: '', modify_date: '', metadata_date: ''
 });
 setOrigMetadata({
 title: '', author: '', subject: '', keywords: '', creator: '', producer: '',
 language: '', creator_tool: '', create_date: '', modify_date: '', metadata_date: ''
 });
 }}
 className="px-8 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-medium transition-all text-sm sm:text-base"
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



