import SkeletonCard from './SkeletonCard';

interface SkeletonGridProps {
  count?: number;
}

export default function SkeletonGrid({ count = 16 }: SkeletonGridProps) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-cols-5 gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading tools..."
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
