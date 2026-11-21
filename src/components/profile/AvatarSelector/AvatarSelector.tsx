"use client";

import React from "react";
import { Check, Images, Loader2 } from "lucide-react";

export interface AvatarOption {
  id: string;
  url: string;
  label: string;
  key?: string;
}

export interface AvatarSelectorProps {
  options: AvatarOption[];
  selectedUrl: string | null;
  onSelect: (url: string, key?: string) => void;
  onOpenModal?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  options,
  selectedUrl,
  onSelect,
  onOpenModal,
  isLoading = false,
  className = "",
}) => {
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-100 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Select Profile Avatar</span>
            {isLoading && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B21A8]">
                <Loader2 size={12} className="animate-spin" />
                Saving avatar...
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose from the available avatars below or open the popup modal
          </p>
        </div>

        {onOpenModal && (
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-[#6B21A8] hover:bg-purple-50 text-xs font-semibold shadow-sm transition-all focus:outline-none"
          >
            <Images size={14} />
            <span>Browse All Avatars</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
        {options.map((avatar) => {
          const isSelected =
            selectedUrl === avatar.url ||
            (Boolean(avatar.key) && selectedUrl === avatar.key);

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.url, avatar.key)}
              disabled={isLoading}
              className={`relative group rounded-full p-1 transition-all duration-200 focus:outline-none ${
                isSelected
                  ? "ring-4 ring-[#6B21A8] ring-offset-2 scale-105 shadow-md bg-white"
                  : "ring-2 ring-transparent hover:ring-2 hover:ring-purple-300 hover:scale-105 bg-white"
              } ${isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
              aria-label={`Select ${avatar.label}`}
              title={avatar.label}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={avatar.url}
                  alt={avatar.label}
                  className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                  loading="lazy"
                />
              </div>

              {isSelected && (
                <div className="absolute -bottom-1 -right-1 bg-[#6B21A8] text-white p-1 rounded-full shadow-md border-2 border-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
