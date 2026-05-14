"use client";
import { notFound } from 'next/navigation';
import EditTools from '@/components/tools/EditTools';
import ImageConverter from '@/components/tools/ImageConverter';
import OfficeTools from '@/components/tools/OfficeTools';
import SecurityTools from '@/components/tools/SecurityTools';
import AadharCropper from '@/components/tools/AadharCropper';
import FlattenPdf from '@/components/tools/FlattenPdf';
import MeeshoCropper from '@/components/tools/MeeshoCropper';

const TOOL_COMPONENTS: Record<string, React.ComponentType<{ id: string }>> = {
  'watermark': EditTools,
  'page-numbers': EditTools,
  'metadata': EditTools,
  'jpg-to-png': ImageConverter,
  'png-to-jpg': ImageConverter,
  'jpg-to-webp': ImageConverter,
  'webp-to-jpg': ImageConverter,
  'png-to-webp': ImageConverter,
  'webp-to-png': ImageConverter,
  'jpg-to-avif': ImageConverter,
  'avif-to-jpg': ImageConverter,
  'png-to-avif': ImageConverter,
  'avif-to-png': ImageConverter,
  'webp-to-avif': ImageConverter,
  'avif-to-webp': ImageConverter,
  'word-to-pdf': OfficeTools,
  'docx-to-pdf': OfficeTools,
  'pdf-to-word': OfficeTools,
  'pdf-to-docx': OfficeTools,
  'excel-to-pdf': OfficeTools,
  'pdf-to-excel': OfficeTools,
  'ppt-to-pdf': OfficeTools,
  'pdf-to-ppt': OfficeTools,
  'html-to-pdf': OfficeTools,
  'flatten-pdf': FlattenPdf,
  'aadhar-crop': AadharCropper,
  'meesho-cropper': MeeshoCropper,
  'unlock': SecurityTools,
  'protect': SecurityTools,
};

export default function ToolClient({ id }: { id: string }) {
  const Tool = TOOL_COMPONENTS[id];
  if (!Tool) notFound();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Tool id={id} />
    </div>
  );
}
