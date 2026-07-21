import React, { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface FiltersProps {
  children: React.ReactNode;
  onClearFilters?: () => void;
  className?: string;
}

export const Filters: React.FC<FiltersProps> = ({
  children,
  onClearFilters,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            {isOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          {onClearFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs text-text-custom/50 hover:text-text-custom"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-bg-secondary rounded-xl border border-border-custom grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};
