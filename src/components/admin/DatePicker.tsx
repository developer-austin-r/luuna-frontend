import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-custom/40">
          <Calendar className="w-4 h-4" />
        </div>
        <input
          type="date"
          className={`w-full pl-9 pr-3 py-2 text-sm border border-border-custom rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 cursor-pointer ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
