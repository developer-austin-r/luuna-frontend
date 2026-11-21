import {
  Skeleton,
  SkeletonCards,
  SkeletonFields,
  SkeletonLines,
  SkeletonRegion,
} from "@/components/loading/Skeleton";

export function LoadingSkeletonTable({
  columns = 5,
  label = "Loading rows",
}: {
  columns?: number;
  label?: string;
}) {
  const cells = Array.from({ length: columns }, (_, index) => index);
  return (
    <SkeletonRegion label={label}>
      <div className="overflow-hidden rounded-xl border border-border-custom bg-white">
        <div className="flex gap-4 border-b border-violet-100 bg-violet-50/70 px-4 py-4 sm:px-6">
          {cells.map((index) => (
            <div
              key={index}
              className={`min-w-0 flex-1 ${index > 2 ? "hidden sm:block" : ""}`}
            >
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
        <div className="divide-y divide-violet-50">
          {Array.from({ length: 5 }, (_, row) => (
            <div
              key={row}
              className="flex items-center gap-4 px-4 py-4 sm:px-6"
            >
              {cells.map((column) => (
                <div
                  key={column}
                  className={`min-w-0 flex-1 ${column > 2 ? "hidden sm:block" : ""}`}
                >
                  <Skeleton
                    className={`h-5 ${(row + column) % 2 ? "w-3/4" : "w-full"}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function LoadingSkeletonGrid() {
  return (
    <SkeletonRegion label="Loading overview">
      <SkeletonCards />
    </SkeletonRegion>
  );
}

export function AdminDetailSkeleton({
  label,
  variant = "details",
}: {
  label: string;
  variant?: "details" | "form" | "product";
}) {
  return (
    <SkeletonRegion label={label}>
      <div className="space-y-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-8 w-56 max-w-full" />
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-5 rounded-xl border border-violet-100 bg-white p-5">
            {variant === "product" ? (
              <Skeleton className="aspect-square max-h-72 w-full" />
            ) : variant === "form" ? (
              <SkeletonFields />
            ) : (
              <>
                <SkeletonLines />
                <SkeletonLines />
                <SkeletonLines />
              </>
            )}
          </div>
          <div className="space-y-5 rounded-xl border border-violet-100 bg-white p-5">
            <SkeletonLines />
            <SkeletonLines />
          </div>
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function AdminLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-56 max-w-full" />
      <LoadingSkeletonGrid />
      <LoadingSkeletonTable />
    </div>
  );
}
