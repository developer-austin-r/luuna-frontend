import React, { InputHTMLAttributes } from "react";

export interface ProfileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const ProfileInput = React.forwardRef<HTMLInputElement, ProfileInputProps>(
  ({ label, icon, error, className = "", id, ...props }, ref) => {
    const inputId = id || `profile-input-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <div className="flex flex-col mb-4 w-full">
        <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">
          {label}
        </label>
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
              {React.cloneElement(icon as React.ReactElement, { size: 16 })}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#fdfcff] border border-gray-200 text-sm rounded-xl py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-colors ${icon ? "pl-10 pr-4" : "px-4"} ${error ? "border-red-500" : ""} ${className}`}
            {...props}
          />
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

ProfileInput.displayName = "ProfileInput";
