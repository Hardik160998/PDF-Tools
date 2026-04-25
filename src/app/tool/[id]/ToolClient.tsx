"use client";

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { OrganizeSkeletonA, MergeSplitSkeletonA, RepairSkeleton, CenteredCardSkeleton } from './skeletons';

const OrganizeTool = dynamic(() => import('@/components/tools/OrganizeTool'), {
  ssr: false, loading: () => <OrganizeSkeletonA />,
});
const MergeSplit = dynamic(() => import('@/components/tools/MergeSplit'), {
  ssr: false, loading: () => <MergeSplitSkeletonA />,
});
const RepairTool = dynamic(() => import('@/components/tools/RepairTool'), {
  ssr: false, loading: () => <RepairSkeleton />,
});
const Compressor = dynamic(() => import('@/components/tools/Compressor'), {
  ssr: false, loading: () => <CenteredCardSkeleton accent="rgb(187 247 208)" />,
});
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

export default function ToolClient({ id }: { id: string }) {
  const Tool = TOOL_COMPONENTS[id];
  if (!Tool) notFound();

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Tool id={id} />
    </div>
  );
}
