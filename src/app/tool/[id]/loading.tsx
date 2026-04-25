import { CenteredCardSkeleton } from './skeletons';

export default function ToolLoading() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      <CenteredCardSkeleton />
    </div>
  );
}
