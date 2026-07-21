import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  className?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg border border-border-custom hover:bg-bg-secondary text-text-custom/70 hover:text-text-custom transition-all duration-150 cursor-pointer"
        type="button"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white border border-border-custom shadow-lg ring-1 ring-black/5 z-40 focus:outline-none divide-y divide-border-custom/50 py-1 origin-top-right transition-all">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-left hover:bg-bg-secondary cursor-pointer transition-colors ${
                item.variant === 'danger'
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  : 'text-text-custom hover:text-primary'
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
