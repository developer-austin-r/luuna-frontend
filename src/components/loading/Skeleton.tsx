import type { ReactNode } from "react";

import styles from "./skeleton.module.css";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`${styles.block} ${className}`} />;
}

export function SkeletonRegion({
  label,
  tone = "light",
  className = "",
  children,
}: {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.region} ${tone === "dark" ? styles.dark : ""} ${className}`}
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <span className="sr-only">{label}</span>}
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

export function SkeletonLines({ className = "" }: { className?: string }) {
  return (
    <div className={`min-w-0 space-y-2.5 ${className}`}>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonFields({ count = 6 }: { count?: number }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24 max-w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({
  count = 4,
  image = false,
  layout = "catalog",
}: {
  count?: number;
  image?: boolean;
  layout?: "catalog" | "account";
}) {
  return (
    <div
      className={
        layout === "catalog"
          ? "grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4"
          : image
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "grid gap-4 xl:grid-cols-2"
      }
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="min-w-0 space-y-3 rounded-xl border border-violet-100 bg-white p-3 sm:p-4"
        >
          {image && <Skeleton className="aspect-square w-full" />}
          <SkeletonLines />
        </div>
      ))}
    </div>
  );
}
