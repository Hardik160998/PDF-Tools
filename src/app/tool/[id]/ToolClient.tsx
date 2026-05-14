"use client";

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { CenteredCardSkeleton } from './skeletons';

const EditTools = dynamic(() => import('@/components/tools/EditTools'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(221 214 254)" />,
});
const ExtractText = dynamic(() => import('@/components/tools/ExtractText'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(191 219 254)" />,
});
const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(254 240 138)" />,
});
const OfficeTools = dynamic(() => import('@/components/tools/OfficeTools'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(191 219 254)" />,
});
const SecurityTools = dynamic(() => import('@/components/tools/SecurityTools'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(254 202 202)" />,
});
const AadharCropper = dynamic(() => import('@/components/tools/AadharCropper'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(254 202 202)" />,
});
const FlattenPdf = dynamic(() => import('@/components/tools/FlattenPdf'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(221 214 254)" />,
});
const MeeshoCropper = dynamic(() => import('@/components/tools/MeeshoCropper'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(254 215 170)" />,
});

const TOOL_COMPONENTS: Record<string, React.ComponentType<{ id: string }>> = {
  'extract-text': ExtractText,
  'pdf-to-xml': ExtractText,
  'watermark': EditTools,
  'page-numbers': EditTools,
  'metadata': EditTools,
  'pdf-to-jpg': ImageConverter,
  'jpg-to-pdf': ImageConverter,
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
