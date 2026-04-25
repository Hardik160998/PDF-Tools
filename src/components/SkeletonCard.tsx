interface SkeletonCardProps {
  gradient?: string;
}

export default function SkeletonCard({ gradient }: SkeletonCardProps) {
  return (
    <div
      className="tool-card"
      style={gradient ? {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        backgroundImage: `linear-gradient(white, white), ${gradient}`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } : undefined}
    >
      {/* Icon skeleton */}
      <div className="tool-icon-wrapper skeleton-shimmer" />

      {/* Content skeleton */}
      <div className="space-y-3 flex-1">
        <div className="h-5 rounded-md skeleton-shimmer w-3/4" />
        <div className="space-y-2">
          <div className="h-3 rounded-sm skeleton-shimmer w-full" />
          <div className="h-3 rounded-sm skeleton-shimmer w-5/6" />
        </div>
      </div>
    </div>
  );
}
