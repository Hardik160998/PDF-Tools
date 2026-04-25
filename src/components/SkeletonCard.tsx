export default function SkeletonCard() {
  return (
    <div className="tool-card animate-pulse opacity-75">
      {/* Icon Wrapper Skeleton */}
      <div className="tool-icon-wrapper bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 skeleton-shimmer" />
      
      {/* Content Skeleton */}
      <div className="space-y-3 flex-1">
        {/* Title Skeleton */}
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-md skeleton-shimmer w-3/4" />
        
        {/* Description Skeleton (2 lines) */}
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-sm skeleton-shimmer w-full" />
          <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-sm skeleton-shimmer w-5/6" />
        </div>
      </div>
    </div>
  );
}
