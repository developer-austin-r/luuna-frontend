"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";

interface GalleryView {
  id: number;
  label: string;
  image: string;
  objectPosition: string;
  scaleClass: string;
}

const defaultViews: GalleryView[] = [
  {
    id: 1,
    label: "Full Figure on Pedestal",
    image: "/images/recommendation-toy.png",
    objectPosition: "center center",
    scaleClass: "scale-100",
  },
  {
    id: 2,
    label: "Upper Torso & Sword",
    image: "/images/recommendation-toy.png",
    objectPosition: "center 22%",
    scaleClass: "scale-140",
  },
  {
    id: 3,
    label: "Profile Pose Angle",
    image: "/images/recommendation-toy.png",
    objectPosition: "center 38%",
    scaleClass: "scale-120",
  },
  {
    id: 4,
    label: "Sitting Pose & Jacket Detail",
    image: "/images/recommendation-toy.png",
    objectPosition: "center 50%",
    scaleClass: "scale-115",
  },
  {
    id: 5,
    label: "Rocky Industrial Base & Boots",
    image: "/images/recommendation-toy.png",
    objectPosition: "center 80%",
    scaleClass: "scale-130",
  },
];

interface ProductGalleryProps {
  productName: string;
  images?: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  productName,
  images,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // If custom distinct images provided, use them; otherwise use the 5 camera angles
  const views: GalleryView[] =
    images && images.length > 1
      ? images.map((img, idx) => ({
          id: idx + 1,
          label: `${productName} view ${idx + 1}`,
          image: img,
          objectPosition: "center center",
          scaleClass: "scale-100",
        }))
      : defaultViews;

  const fallbackView: GalleryView = defaultViews[0]!;
  const currentView: GalleryView = views[selectedIndex] ?? fallbackView;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? views.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === views.length - 1 ? 0 : prev + 1));
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
    try {
      if (typeof window !== "undefined" && navigator?.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      } else {
        toast.success("Share link ready!");
      }
    } catch {
      toast.success("Share link ready!");
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-5 w-full">
      {/* Vertical Thumbnails List on Tab/Laptop, Horizontal on Mobile */}
      <div className="flex sm:flex-col gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-y-auto w-full sm:w-auto max-w-full sm:max-h-[640px] py-1 sm:py-0 scrollbar-none justify-center sm:justify-start shrink-0">
        {views.map((view, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={view.id}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View ${view.label}`}
              className={`relative w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 bg-[#160B2A] cursor-pointer ${
                isSelected
                  ? "border-white ring-2 ring-white/60 shadow-lg scale-105"
                  : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
              }`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={view.image}
                  alt={view.label}
                  fill
                  sizes="72px"
                  className={`object-cover ${view.scaleClass} transition-transform duration-200`}
                  style={{ objectPosition: view.objectPosition }}
                  priority={idx === 0}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Large Product Image Box */}
      <div className="relative flex-1 w-full aspect-4/5 sm:aspect-auto sm:h-[540px] md:h-[600px] lg:h-[640px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#160B2A] border border-white/10 shadow-2xl group">
        {/* Navigation Arrows */}
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
            aria-label="Share product"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center transition-transform active:scale-90 shadow-lg cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5 -translate-x-0.5 translate-y-0.5 text-gray-700" />
          </button>
        </div>

        {/* Edge-to-Edge Main Product Image */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={currentView.image}
            alt={`${productName} - ${currentView.label}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
            className={`w-full h-full object-cover transition-all duration-300 ${currentView.scaleClass}`}
            style={{ objectPosition: currentView.objectPosition }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
