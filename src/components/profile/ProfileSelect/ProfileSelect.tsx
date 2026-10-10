import React, { SelectHTMLAttributes } from "react";

export interface Option {
  value: string | number;
  label: string;
}

export interface ProfileSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  placeholder?: string;
}

export const ProfileSelect = React.forwardRef<HTMLSelectElement, ProfileSelectProps>(
  ({ label, options, error, className = "", id, placeholder, value, defaultValue, ...props }, ref) => {
    const selectId = id || `profile-select-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <div className="flex flex-col mb-4 w-full">
        <label htmlFor={selectId} className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">
          {label}
        </label>
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            className={`w-full bg-[#fdfcff] border border-gray-200 text-sm rounded-xl py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-colors appearance-none ${error ? "border-red-500" : ""} ${className}`}
            {...props}
            value={value !== undefined ? (value === "" && placeholder ? "" : value) : undefined}
            defaultValue={value === undefined ? (defaultValue ?? (placeholder ? "" : undefined)) : undefined}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        {error && (
          <span className="text-xs text-red-500 mt-1.5 ml-1 block">
            {error}
          </span>
        )}
      </div>
    );
  }
);

ProfileSelect.displayName = "ProfileSelect";
