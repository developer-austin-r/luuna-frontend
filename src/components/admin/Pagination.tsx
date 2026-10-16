import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  className = "",
}) => {
  // Always show pagination as requested
  // if (totalPages <= 1) return null;

  const safeTotalPages = Math.max(1, totalPages || 1);

  const getPageNumbers = (): (number | string)[] => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", safeTotalPages];
    }

    if (currentPage >= safeTotalPages - 3) {
      return [
        1,
        "...",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      safeTotalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-t border-border-custom bg-white ${className}`}
    >
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-text-custom/60">
            Page{" "}
            <span className="font-semibold text-text-custom">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-text-custom">
              {safeTotalPages}
            </span>
            {totalItems !== undefined && (
              <span className="ml-1.5 text-text-custom/50 font-medium">
                ({totalItems} {totalItems === 1 ? "product" : "products"})
              </span>
            )}
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-xs items-center gap-1"
            aria-label="Pagination"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {pages.map((item, i) => {
              if (item === "...") {
                return (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-text-custom/40 font-bold select-none"
                  >
                    ...
                  </span>
                );
              }

              const page = item as number;
              const isCurrent = page === currentPage;
              return (
                <Button
                  key={page}
                  variant={isCurrent ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= safeTotalPages}
              className="px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};
