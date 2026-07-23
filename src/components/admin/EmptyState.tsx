import React from "react";
import { Archive } from "lucide-react";

import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No records found",
  description = "Try adjusting your filters or search criteria.",
  icon,
  actionLabel,
  onActionClick,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-dashed border-border-custom ${className}`}
    >
      <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
        {icon || <Archive className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-semibold text-text-custom mb-1">{title}</h3>
      <p className="text-xs text-text-custom/60 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onActionClick && (
        <Button variant="primary" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
