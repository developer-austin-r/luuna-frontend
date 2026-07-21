import React, { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  error?: string | undefined;
  helperText?: string | undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        type={type}
        className={`px-3 py-2 text-sm border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-border-custom'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-custom/60 mt-0.5">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
