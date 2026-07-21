import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (value: string) => void;
}

export const Search: React.FC<SearchProps> = ({
  onSearchChange,
  className = '',
  placeholder = 'Search...',
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-custom/40">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full pl-9 pr-4 py-2 text-sm border border-border-custom rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};
