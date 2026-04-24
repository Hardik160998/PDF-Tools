"use client";

import { use } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const MergeSplit = dynamic(() => import('@/components/tools/MergeSplit'), { ssr: false });
const OrganizeTool = dynamic(() => import('@/components/tools/OrganizeTool'), { ssr: false });
const ExtractText = dynamic(() => import('@/components/tools/ExtractText'), { ssr: false });
const EditTools = dynamic(() => import('@/components/tools/EditTools'), { ssr: false });
const Compressor = dynamic(() => import('@/components/tools/Compressor'), { ssr: false });
const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter'), { ssr: false });
const OfficeTools = dynamic(() => import('@/components/tools/OfficeTools'), { ssr: false });
const AadharCropper = dynamic(() => import('@/components/tools/AadharCropper'), { ssr: false });
const SecurityTools = dynamic(() => import('@/components/tools/SecurityTools'), { ssr: false });
const RepairTool = dynamic(() => import('@/components/tools/RepairTool'), { ssr: false });

const TOOL_COMPONENTS: Record<string, React.ComponentType<{ id: string }>> = {
  'organize': OrganizeTool,
  'merge': MergeSplit,
  'split': MergeSplit,
  'extract-text': ExtractText,
  'pdf-to-xml': ExtractText,
  'watermark': EditTools,
  'page-numbers': EditTools,
  'metadata': EditTools,
  'compress': Compressor,
  'repair-pdf': RepairTool,
  'pdf-to-jpg': ImageConverter,
  'jpg-to-pdf': ImageConverter,
  'word-to-pdf': OfficeTools,
  'pdf-to-word': OfficeTools,
  'excel-to-pdf': OfficeTools,
  'pdf-to-excel': OfficeTools,
  'ppt-to-pdf': OfficeTools,
  'pdf-to-ppt': OfficeTools,
  'html-to-pdf': OfficeTools,
  'aadhar-crop': AadharCropper,
  'unlock': SecurityTools,
  'protect': SecurityTools,
};

export default function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const Tool = TOOL_COMPONENTS[id];

  if (!Tool) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Tool id={id} />
      
      {/* Universal Tool Ad Slot - Clean iLovePDF Style */}
      <div className="mt-16 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-12 text-center text-slate-400 opacity-50 border border-slate-100 dark:border-slate-800 border-dashed max-w-5xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest mb-4">Ad Placement</p>
        <div className="h-32 flex items-center justify-center italic font-medium text-lg">
          Premium Responsive Display Ad
        </div>
      </div>
    </div>
  );
}
