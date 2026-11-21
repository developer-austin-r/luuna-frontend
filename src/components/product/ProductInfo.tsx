"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  RefreshCw,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

interface ProductInfoProps {
  product?: {
    name?: string;
    subtitle?: string;
    rating?: number;
    reviewsCount?: number;
    inStock?: boolean;
    originalPrice?: number;
    discountedPrice?: number;
    size?: string;
    brand?: string;
    description?: string;
  };
}

const defaultProduct = {
  name: "Batman vs Joker | Arkham City Edition",
  subtitle: "Gotham's Eternal Duel",
  rating: 4,
  reviewsCount: 150,
  inStock: true,
  originalPrice: 3500,
  discountedPrice: 2500,
  size: "10cm",
  brand: "PVC statues",
  description:
    "Bring the legendary clash of Gotham's eternal rivals to life with this Batman vs. Joker – Arkham City Edition Figure. Captured in a dramatic mid-battle pose, this collectible showcases Batman's unyielding strength as he confronts the Joker with raw intensity. The sculpt highlights intricate detailing—from Batman's armoured suit and flowing cape to the Joker's iconic purple coat and chaotic expression. The gritty, industrial base enhances the scene, making it a striking centerpiece for any DC or gaming fan's collection.",
};

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product = defaultProduct,
}) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    name = defaultProduct.name,
    subtitle = defaultProduct.subtitle,
    rating = defaultProduct.rating,
    reviewsCount = defaultProduct.reviewsCount,
    inStock = defaultProduct.inStock,
    originalPrice = defaultProduct.originalPrice,
    discountedPrice = defaultProduct.discountedPrice,
    size = defaultProduct.size,
    brand = defaultProduct.brand,
    description = defaultProduct.description,
  } = product;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) to your cart!`);
  };

  const handleBuyNow = () => {
    toast.success("Proceeding to checkout...");
    router.push("/cart");
  };

  const descriptionPreview =
    description.length > 280 ? description.slice(0, 280) + "..." : description;

  return (
    <div className="flex flex-col text-white w-full">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
          {name}
        </h1>
        <p className="text-gray-300 italic text-xs sm:text-sm md:text-base mt-1 sm:mt-1.5 font-normal">
          {subtitle}
        </p>
      </div>

      {/* Ratings, Reviews & Stock Status */}
      <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm mt-2.5 sm:mt-3">
        <div className="flex items-center text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                i < rating ? "fill-amber-400 text-amber-400" : "text-gray-600"
              }`}
            />
          ))}
        </div>
        <span className="text-gray-300">({reviewsCount} Reviews)</span>
        <span className="text-gray-600">|</span>
        <span
          className={
            inStock
              ? "text-emerald-400 font-medium"
              : "text-red-400 font-medium"
          }
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-2.5 sm:gap-3 mt-3 sm:mt-4">
        <span className="text-gray-400 line-through text-base sm:text-lg md:text-xl font-medium">
          ₹ {originalPrice.toLocaleString()}
        </span>
        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ₹ {discountedPrice.toLocaleString()}
        </span>
      </div>

      {/* Specifications / Metadata */}
      <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-200">
        <div>
          <span className="font-semibold text-white">Size:</span> {size}
        </div>
        <div>
          <span className="font-semibold text-white">Brand:</span> {brand}
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-gray-300 font-light">
        <p className="inline">
          {isExpanded ? description : descriptionPreview}
        </p>{" "}
        {description.length > 280 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white font-bold hover:underline inline cursor-pointer ml-1"
          >
            {isExpanded ? "Read less" : "Read more..."}
          </button>
        )}
      </div>

      {/* Quantity & Add to Cart Section */}
      <div className="mt-5 sm:mt-6 flex flex-col gap-2.5 sm:gap-3.5">
        <div className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
          Quantity
        </div>

        <div className="flex flex-row items-center gap-2 sm:gap-3">
          {/* Quantity Selector */}
          <div className="inline-flex items-center justify-between border border-white/40 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 w-28 sm:w-36 bg-[#160B2A] shrink-0">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="text-white/80 hover:text-white disabled:opacity-30 p-1 cursor-pointer transition-colors"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <span className="text-white font-bold text-sm sm:text-base px-2 sm:px-3 select-none">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="text-white/80 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-white hover:bg-gray-100 text-black font-extrabold uppercase rounded-lg px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-md cursor-pointer text-xs sm:text-sm tracking-wider"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="truncate">ADD TO CART</span>
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-white hover:bg-gray-100 text-black font-extrabold uppercase rounded-lg py-2.5 sm:py-3 text-center transition-all duration-150 active:scale-[0.98] shadow-md cursor-pointer text-xs sm:text-sm tracking-wider mt-1"
        >
          BUY NOW
        </button>
      </div>

      {/* Additional Information Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-5">
        {/* PAN India Delivery Card */}
        <div className="bg-white rounded-lg p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 shadow-md">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-black font-bold text-[11px] sm:text-xs leading-snug">
              PAN India Delivery
            </span>
            <span className="text-gray-600 text-[9px] sm:text-[10px] leading-tight mt-0.5 truncate sm:whitespace-normal">
              We deliver your fave collectibles Across India
            </span>
          </div>
        </div>

        {/* Replacement Card */}
        <div className="bg-white rounded-lg p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 shadow-md">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-black font-bold text-[11px] sm:text-xs leading-snug">
              Replacement
            </span>
            <span className="text-gray-600 text-[9px] sm:text-[10px] leading-tight mt-0.5">
              Free 7 days replacement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
