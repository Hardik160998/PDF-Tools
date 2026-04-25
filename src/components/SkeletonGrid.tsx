import SkeletonCard from './SkeletonCard';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Organize': 'linear-gradient(135deg, rgb(242, 101, 34), rgb(194, 65, 12))',
  'Optimize': 'linear-gradient(135deg, rgb(34, 197, 94), rgb(21, 128, 61))',
  'Convert':  'linear-gradient(135deg, rgb(49, 130, 206), rgb(30, 58, 138))',
  'Edit':     'linear-gradient(135deg, #E8465D, #843286)',
  'Security': 'linear-gradient(135deg, #e53e3e, #7f1d1d)',
  'Special':  'linear-gradient(135deg, #ef4444, #991b1b)',
};

interface SkeletonGridProps {
  count?: number;
  categories?: string[];
}

export default function SkeletonGrid({ count = 16, categories = [] }: SkeletonGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading tools..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard
          key={i}
          gradient={CATEGORY_GRADIENTS[categories[i]] ?? CATEGORY_GRADIENTS['Organize']}
        />
      ))}
    </div>
  );
}
