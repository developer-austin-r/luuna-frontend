import React, { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { EmptyState } from "./EmptyState";
import { Skeleton } from "./LoadingSkeleton";

export interface Column<T> {
  key: keyof T | "actions";
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  emptyState?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  onSort,
  emptyState,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof T) => {
    if (!onSort) return;
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="flex gap-4 p-4 border border-border-custom bg-white rounded-lg animate-pulse"
          >
            <Skeleton variant="circle" className="w-8 h-8" />
            <Skeleton variant="text" className="w-1/4 h-6" />
            <Skeleton variant="text" className="w-1/2 h-6 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <>{emptyState || <EmptyState />}</>;
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl border border-border-custom shadow-xs">
      <table className="w-full text-left border-collapse text-xs text-text-custom">
        <thead>
          <tr className="bg-bg-secondary border-b border-border-custom font-semibold text-text-custom/70">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-6 py-4 select-none ${
                  col.sortable
                    ? "cursor-pointer hover:bg-border-custom/50 hover:text-text-custom transition-all"
                    : ""
                }`}
                onClick={() =>
                  col.sortable &&
                  col.key !== "actions" &&
                  handleSort(col.key as keyof T)
                }
              >
                <div className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  {col.label}
                  {col.sortable && col.key !== "actions" && (
                    <span>
                      {sortConfig?.key === col.key ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-custom/50 font-medium">
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-bg-secondary/40 transition-colors duration-150"
            >
              {columns.map((col) => {
                const cellValue =
                  col.key !== "actions" ? item[col.key as keyof T] : undefined;
                return (
                  <td
                    key={String(col.key)}
                    className="px-6 py-4 text-xs align-middle"
                  >
                    {col.render
                      ? col.render(cellValue, item)
                      : String(cellValue ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
