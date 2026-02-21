import { Skeleton } from '@/components/ui/skeleton';

/**
 * Industrial-themed card skeleton loader.
 * Gold accent bar on left, shimmer animation.
 */
export function CardSkeleton() {
  return (
    <div
      className="relative bg-white border border-neutral-200 p-6 space-y-4 overflow-hidden"
      role="status"
      aria-label="Loading content"
    >
      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" aria-hidden="true" />

      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" />

      {/* Content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-10 w-32" />

      <span className="sr-only">Loading, please wait...</span>
    </div>
  );
}

/**
 * Grid of card skeletons
 */
export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
