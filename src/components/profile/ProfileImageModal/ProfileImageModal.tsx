"use client";

import React, { useEffect, useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";

import { Skeleton, SkeletonRegion } from "@/components/loading/Skeleton";
import { getS3AssetUrl } from "@/config";
import type { AvailableProfileImage } from "@/services/profile";

export interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: AvailableProfileImage[];
  currentSelectedKey: string | null;
  onSave: (imageKey: string) => Promise<void>;
  isLoadingOptions?: boolean;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  isOpen,
  onClose,
  images,
  currentSelectedKey,
  onSave,
  isLoadingOptions = false,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(
    currentSelectedKey,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync internal selected key when modal opens or currentSelectedKey updates
  useEffect(() => {
    if (isOpen) {
      setSelectedKey(currentSelectedKey);
      setError(null);
    }
  }, [isOpen, currentSelectedKey]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedKey) return;
    setIsSaving(true);
    setError(null);

    try {
      await onSave(selectedKey);
      onClose();
    } catch (err: any) {
      console.error("Failed to update profile image:", err);
      setError(
        err?.message || "Failed to save profile image. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const selectedImageObj = images.find((img) => img.key === selectedKey);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-purple-100 flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B21A8]"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6B21A8] text-xs font-semibold mb-2">
            <Sparkles size={13} />
            <span>Profile Customization</span>
          </div>
          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight"
          >
            Choose Profile Picture
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Select an avatar from our curated S3 collection to personalize your
            account profile.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}

        {/* Preview of Current Selection */}
        <div className="flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white shadow-md border-2 border-purple-200 flex items-center justify-center">
              {selectedKey ? (
                <img
                  src={getS3AssetUrl(selectedKey)}
                  alt="Selected avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                  None
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#6B21A8] text-white p-1 rounded-full shadow border-2 border-white flex items-center justify-center">
              <Check size={12} strokeWidth={3} />
            </div>
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
              Selected Avatar
            </span>
            <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {selectedImageObj?.name || "Selected Avatar"}
            </p>
            <p className="text-xs text-gray-500 font-mono truncate mt-0.5">
              {selectedKey || "assets/Profile-img/..."}
            </p>
          </div>
        </div>

        {/* Available Options Grid */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
            Available Avatars
          </label>

          {isLoadingOptions ? (
            <SkeletonRegion label="Loading profile images">
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 8 }, (_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square w-full rounded-full"
                  />
                ))}
              </div>
            </SkeletonRegion>
          ) : images.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              No profile avatars found in storage.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 sm:gap-4 max-h-60 overflow-y-auto p-1">
              {images.map((img) => {
                const isSelected = selectedKey === img.key;
                const dynamicSrc = getS3AssetUrl(img.key);

                return (
                  <button
                    key={img.key}
                    type="button"
                    onClick={() => {
                      setSelectedKey(img.key);
                      if (error) setError(null);
                    }}
                    disabled={isSaving}
                    className={`group relative rounded-2xl p-2 flex flex-col items-center gap-2 transition-all duration-200 text-center focus:outline-none ${
                      isSelected
                        ? "bg-purple-100/90 ring-2 ring-[#6B21A8] shadow-md scale-102"
                        : "bg-gray-50 hover:bg-purple-50/50 hover:scale-102 border border-gray-100"
                    } ${isSaving ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    aria-label={`Select ${img.name}`}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white shadow-sm transition-all ${
                        isSelected
                          ? "ring-2 ring-[#6B21A8] ring-offset-2"
                          : "group-hover:ring-2 group-hover:ring-purple-300"
                      }`}
                    >
                      <img
                        src={dynamicSrc}
                        alt={img.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 truncate max-w-full">
                      {img.name}
                    </span>

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-[#6B21A8] text-white p-0.5 rounded-full shadow border border-white">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving || !selectedKey}
            className="px-5 py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6B21A8] focus:ring-offset-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Profile Picture</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
