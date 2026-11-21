import {
  Skeleton,
  SkeletonCards,
  SkeletonFields,
  SkeletonLines,
  SkeletonRegion,
} from "./Skeleton";

export function AccountFormSkeleton({
  label = "Loading profile",
}: {
  label?: string;
}) {
  return (
    <SkeletonRegion label={label}>
      <SkeletonFields count={8} />
    </SkeletonRegion>
  );
}

export function AccountListSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label}>
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-violet-100 p-4"
          >
            <Skeleton className="size-12 shrink-0 sm:size-16" />
            <SkeletonLines className="flex-1" />
            <Skeleton className="h-6 w-14 shrink-0 sm:w-24" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function AccountCardsSkeleton({
  label,
  image = false,
}: {
  label: string;
  image?: boolean;
}) {
  return (
    <SkeletonRegion label={label}>
      <SkeletonCards image={image} count={image ? 6 : 4} layout="account" />
    </SkeletonRegion>
  );
}

export function AccountLoading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#2a1740] via-[#755494] to-[#e9d5ff] px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-5 sm:p-8 md:ml-auto">
        <AccountFormSkeleton label="Loading your account" />
      </div>
    </div>
  );
}

export function AuthLoading() {
  return (
    <div className="mx-auto w-full max-w-md self-center rounded-3xl border border-violet-100 bg-white p-6 sm:p-9">
      <SkeletonRegion label="Loading account form">
        <Skeleton className="mb-6 h-8 w-2/3" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </SkeletonRegion>
    </div>
  );
}
