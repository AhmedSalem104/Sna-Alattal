import { Skeleton } from '@/components/ui/skeleton';

/**
 * Section skeleton loader for dynamically imported page sections
 * Provides visual feedback while section components are being loaded
 */
export function SectionSkeleton() {
  return (
    <div className="section-padding animate-pulse" role="status" aria-label="Loading section">
      <div className="container-custom">
        {/* Section header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
          <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-lg" />
          <Skeleton className="h-4 w-full max-w-xl mx-auto rounded-lg" />
        </div>

        {/* Section content skeleton - 3 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-neutral-50 rounded-2xl p-6 space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading section, please wait...</span>
    </div>
  );
}

/**
 * Compact section skeleton for smaller sections
 */
export function SectionSkeletonCompact() {
  return (
    <div className="section-padding-sm animate-pulse" role="status" aria-label="Loading section">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <span className="sr-only">Loading section, please wait...</span>
    </div>
  );
}
