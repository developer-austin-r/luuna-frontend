import {
  Skeleton,
  SkeletonCards,
  SkeletonFields,
  SkeletonLines,
  SkeletonRegion,
} from "./Skeleton";

const frame = "min-h-screen bg-[#140824]";

function StorefrontFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={frame}>
      <SkeletonRegion
        tone="dark"
        className="border-b border-white/10 px-5 py-4 sm:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
      </SkeletonRegion>
      {children}
    </div>
  );
}

export function HomeLoading() {
  return (
    <StorefrontFrame>
      <SkeletonRegion
        tone="dark"
        label="Loading storefront"
        className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8"
      >
        <Skeleton className="mb-6 h-52 w-full sm:h-80 lg:h-[420px]" />
        <Skeleton className="mb-5 h-8 w-44" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="aspect-square w-full" />
          ))}
        </div>
      </SkeletonRegion>
    </StorefrontFrame>
  );
}

export function CatalogLoading() {
  return (
    <StorefrontFrame>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <SkeletonRegion tone="dark">
          <Skeleton className="mb-6 h-9 w-40" />
        </SkeletonRegion>
        <SkeletonRegion label="Loading products">
          <SkeletonCards image count={8} />
        </SkeletonRegion>
      </div>
    </StorefrontFrame>
  );
}

export function ProductLoading() {
  return (
    <StorefrontFrame>
      <SkeletonRegion
        label="Loading product details"
        tone="dark"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[7fr_5fr] lg:gap-10">
          <Skeleton className="aspect-4/5 max-h-[640px] w-full rounded-2xl sm:aspect-square" />
          <div className="space-y-5">
            <Skeleton className="h-10 w-5/6" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-9 w-36" />
            <SkeletonLines />
            <SkeletonLines />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </SkeletonRegion>
    </StorefrontFrame>
  );
}

function SummaryPlaceholder() {
  return (
    <div className="space-y-5 rounded-3xl bg-white p-5 sm:p-8">
      <Skeleton className="h-5 w-32" />
      <SkeletonLines />
      <SkeletonLines />
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

export function CartSkeleton() {
  return (
    <SkeletonRegion label="Loading your cart">
      <div className="grid items-start gap-5 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl bg-white p-4"
            >
              <Skeleton className="size-16 shrink-0 sm:size-20" />
              <SkeletonLines className="flex-1" />
              <Skeleton className="h-8 w-14 shrink-0 sm:w-24" />
            </div>
          ))}
        </div>
        <SummaryPlaceholder />
      </div>
    </SkeletonRegion>
  );
}

export function CheckoutSkeleton() {
  return (
    <SkeletonRegion label="Loading checkout">
      <div className="grid items-start gap-5 min-[961px]:grid-cols-[minmax(0,784fr)_minmax(320px,446fr)] min-[961px]:gap-8">
        <div className="space-y-5">
          {[6, 2, 2].map((count, index) => (
            <div
              key={index}
              className="space-y-5 rounded-3xl bg-white p-5 sm:p-8"
            >
              <Skeleton className="h-5 w-36" />
              <SkeletonFields count={count} />
            </div>
          ))}
        </div>
        <SummaryPlaceholder />
      </div>
    </SkeletonRegion>
  );
}

export function ConfirmationSkeleton() {
  return (
    <SkeletonRegion label="Loading order confirmation">
      <div className="space-y-5">
        <div className="space-y-4 rounded-[30px] bg-[#f0e5ff] p-6 sm:p-12">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-3/4" />
          <SkeletonLines />
        </div>
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
          <SummaryPlaceholder />
          <SummaryPlaceholder />
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function CartLoading() {
  return (
    <StorefrontFrame>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <CartSkeleton />
      </div>
    </StorefrontFrame>
  );
}

export function CheckoutLoading() {
  return (
    <StorefrontFrame>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <CheckoutSkeleton />
      </div>
    </StorefrontFrame>
  );
}

export function ConfirmationLoading() {
  return (
    <StorefrontFrame>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <ConfirmationSkeleton />
      </div>
    </StorefrontFrame>
  );
}
