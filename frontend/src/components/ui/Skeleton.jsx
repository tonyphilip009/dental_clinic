
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-linear-to-r from-brand-light via-brand-dark to-brand-light bg-[length:200%_100%] ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-accent/15 bg-brand-dark p-6 shadow-soft">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <Skeleton className="mt-5 h-4 w-1/3" />
    </div>
  );
}

export function CardSkeletonGrid({
  count = 6,
  className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
}) {
  return (
    <div
      className={className}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

export function PhotoSkeletonGrid({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="Loading photos"
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          className="aspect-square rounded-2xl"
        />
      ))}
      <span className="sr-only">Loading photos...</span>
    </div>
  );
}
