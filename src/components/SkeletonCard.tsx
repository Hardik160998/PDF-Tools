interface SkeletonCardProps {
  gradient?: string;
}

export default function SkeletonCard({ gradient }: SkeletonCardProps) {
  return (
    <div className="tool-card-border" style={{ pointerEvents: 'none' }}>
      <div className="tool-card">
        <div
          className="tool-icon-wrapper"
          style={{ backgroundImage: gradient, opacity: 0.3 }}
        />
        <div className="space-y-3 flex-1">
          <div className="h-5 rounded-md skeleton-shimmer w-3/4" />
          <div className="space-y-2">
            <div className="h-3 rounded-sm skeleton-shimmer w-full" />
            <div className="h-3 rounded-sm skeleton-shimmer w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
