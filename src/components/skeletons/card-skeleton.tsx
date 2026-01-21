import { Skeleton } from '@/components/ui/skeleton';

/**
 * Card skeleton loader for product cards, news cards, etc.
 * Provides visual feedback while content is loading
 */
export function CardSkeleton() {
  return (
    <div
      className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-4"
      role="status"
      aria-label="Loading content"
    >
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-xl" />

      {/* Content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-10 w-32 rounded-lg" />

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
