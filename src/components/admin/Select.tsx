import React, { forwardRef, useId } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string | undefined;
  options: Option[];
  error?: string | undefined;
  helperText?: string | undefined;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg bg-white appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 cursor-pointer ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-border-custom'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-custom/50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-custom/60 mt-0.5">{helperText}</span>}
    </div>
  );
});

Select.displayName = 'Select';
