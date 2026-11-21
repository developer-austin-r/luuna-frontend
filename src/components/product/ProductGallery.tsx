"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";

interface ProductGalleryProps {
  productName: string;
  images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  productName,
  images,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [manualShareUrl, setManualShareUrl] = useState<string | null>(null);

  const currentImage = images[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex(
      (previous) => (previous + images.length - 1) % images.length,
    );
  };

  const handleNext = () => {
    setSelectedIndex((previous) => (previous + 1) % images.length);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Added to your wishlist!");
      } else {
        toast("Removed from wishlist", { icon: "💔" });
      }
      return next;
    });
  };

  const handleShare = async () => {
    const url = new URL(window.location.pathname, window.location.origin).href;
    const shareData = { title: productName, url };
    setManualShareUrl(null);

    if (
      navigator.share &&
      (!navigator.canShare || navigator.canShare(shareData))
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied to clipboard!");
        return;
      }
    } catch {
      // The browser may block programmatic clipboard access.
    }
    setManualShareUrl(url);
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-5 w-full">
      {/* Vertical Thumbnails List on Tab/Laptop, Horizontal on Mobile */}
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-y-auto w-full sm:w-auto max-w-full sm:max-h-[640px] py-1 sm:py-0 scrollbar-none justify-center sm:justify-start shrink-0">
          {images.map((image, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={image}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View image ${idx + 1} of ${productName}`}
                className={`relative w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 bg-[#160B2A] cursor-pointer ${
                  isSelected
                    ? "border-white ring-2 ring-white/60 shadow-lg scale-105"
                    : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                    unoptimized
                    priority={idx === 0}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Large Product Image Box */}
      <div className="relative flex-1 w-full aspect-4/5 sm:aspect-auto sm:h-[540px] md:h-[600px] lg:h-[640px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#160B2A] border border-white/10 shadow-2xl group">
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous product image"
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next product image"
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Floating Top-Right Action Buttons */}
        <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-20 flex items-center gap-2 sm:gap-2.5">
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-lg cursor-pointer ${
              isWishlisted
                ? "bg-purple-600 text-white"
                : "bg-[#D8B4E2] text-[#4A154B] hover:bg-[#e0c3e8]"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${
                isWishlisted ? "fill-white" : "fill-[#541B5C] text-[#541B5C]"
              }`}
            />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            type="button"
            aria-label="Share product"
            aria-expanded={manualShareUrl !== null}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center transition-transform active:scale-90 shadow-lg cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5 -translate-x-0.5 translate-y-0.5 text-gray-700" />
          </button>
          {manualShareUrl && (
            <div className="absolute right-0 top-full mt-2 w-64 max-w-[75vw] rounded-lg bg-white p-3 text-gray-900 shadow-lg">
              <label className="grid gap-1 text-sm font-semibold">
                Copy product link
                <input
                  type="url"
                  readOnly
                  value={manualShareUrl}
                  onFocus={(event) => event.currentTarget.select()}
                  className="min-w-0 rounded border border-gray-300 p-2 font-normal"
                />
              </label>
              <button
                type="button"
                className="mt-2 text-sm underline"
                onClick={() => setManualShareUrl(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Edge-to-Edge Main Product Image */}
        <div className="relative w-full h-full overflow-hidden">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={`${productName}, image ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
              unoptimized
              priority
            />
          ) : (
            <p className="absolute inset-0 grid place-items-center text-gray-300">
              No product images available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
