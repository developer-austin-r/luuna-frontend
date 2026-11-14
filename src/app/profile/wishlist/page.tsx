"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HeartOff,
  Loader2,
  Package,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import { AccountMenu } from "@/components/profile/AccountMenu/AccountMenu";
import { env } from "@/config/env";
import { logoutApi } from "@/services/auth";
import {
  clearWishlistApi,
  getWishlistApi,
  removeFromWishlistApi,
  type WishlistItem,
  type WishlistPagination,
} from "@/services/wishlist";

function formatPrice(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return "₹0.00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return `₹${(isNaN(num) ? 0 : num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function resolveProductImage(item: WishlistItem): string {
  const images = item.product?.images;
  if (!images || images.length === 0) {
    return "/images/recommendation-toy.png";
  }
  const img = images[0];
  if (!img) return "/images/recommendation-toy.png";
  const url = img.displayUrl || img.imageUrl || img.originalUrl;
  if (!url) return "/images/recommendation-toy.png";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  ) {
    return url;
  }
  return `${env.s3BaseUrl}/${url}`;
}

export default function WishlistPage() {
  const router = useRouter();

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [pagination, setPagination] = useState<WishlistPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Auto-dismiss status message after 4 seconds
  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlist() {
      try {
        setIsLoading(true);
        const res = await getWishlistApi({ page: currentPage, limit: 12 });
        if (!isMounted) return;
        setWishlistItems(res.data);
        setPagination(res.pagination);
      } catch (err: any) {
        if (!isMounted) return;
        const msg = err?.message || "";
        if (
          msg.includes("401") ||
          msg.toLowerCase().includes("unauthorized") ||
          msg.includes("403")
        ) {
          router.push("/login");
          return;
        }
        setStatusMessage({
          type: "error",
          text: msg || "Failed to load wishlist. Please try refreshing.",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      isMounted = false;
    };
  }, [router, currentPage]);

  const handleRemove = async (productId: string, productName: string) => {
    try {
      setRemovingId(productId);
      await removeFromWishlistApi(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
      setPagination((prev) =>
        prev
          ? {
              ...prev,
              total: Math.max(0, prev.total - 1),
            }
          : null,
      );
      setStatusMessage({
        type: "success",
        text: `"${productName}" has been removed from your wishlist.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to remove item. Please try again.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      return;
    }

    try {
      setIsClearing(true);
      await clearWishlistApi();
      setWishlistItems([]);
      setPagination((prev) =>
        prev
          ? {
              ...prev,
              total: 0,
              totalPages: 1,
            }
          : null,
      );
      setStatusMessage({
        type: "success",
        text: "Your wishlist has been cleared.",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to clear wishlist. Please try again.",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <>
      <LoginOfferBar />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#2a1740] via-[#755494] to-[#E9D5FF] pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Button */}
        <div className="max-w-6xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-white hover:text-[#E9D5FF] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Left Sidebar Navigation */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <h2 className="text-xl font-bold text-white mb-4 px-1 tracking-tight hidden md:block">
              Manage My Account
            </h2>
            <AccountMenu onLogout={handleLogout} />
          </div>

          {/* Right Main Content area */}
          <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[560px] flex flex-col min-w-0">
            {/* Header with Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-gray-100 mb-6">
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    My Wishlist
                  </h1>
                  {!isLoading && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#6B21A8]">
                      {pagination?.total ?? wishlistItems.length}{" "}
                      {(pagination?.total ?? wishlistItems.length) === 1
                        ? "item"
                        : "items"}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Keep track of products you love and want to purchase later
                </p>
              </div>

              {wishlistItems.length > 0 && !isLoading && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
                >
                  {isClearing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Clear All
                </button>
              )}
            </div>

            {/* Status Alert Banner */}
            {statusMessage && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 border text-sm transition-all duration-300 ${
                  statusMessage.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-red-600 shrink-0" />
                )}
                <span className="font-medium">{statusMessage.text}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 animate-pulse flex flex-col"
                  >
                    <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-1/2 mt-auto" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && wishlistItems.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#6B21A8] mb-4 shadow-inner">
                  <HeartOff size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
                  Explore our luxury collection and save items you adore by
                  clicking the wishlist heart icon on any product.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  Discover Products
                </Link>
              </div>
            )}

            {/* Wishlist Products Grid */}
            {!isLoading && wishlistItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {wishlistItems.map((item) => {
                  const product = item.product;
                  const isRemoving = removingId === product.id;
                  const imageUrl = resolveProductImage(item);
                  const isOutOfStock =
                    product.stock <= 0 || product.availableStock <= 0;

                  const hasDiscount =
                    product.discountPrice !== null &&
                    product.discountPrice !== undefined &&
                    Number(product.discountPrice) > 0 &&
                    Number(product.discountPrice) < Number(product.basePrice);

                  return (
                    <div
                      key={item.id}
                      className="group border border-gray-100 hover:border-[#E9D5FF] rounded-2xl p-4 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Top Badges & Remove Button */}
                      <div className="relative w-full aspect-square bg-[#fcfaff] rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Stock Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-900/80 text-white backdrop-blur-sm">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-sm">
                              In Stock
                            </span>
                          )}
                        </div>

                        {/* Remove Action Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(product.id, product.name)}
                          disabled={isRemoving}
                          title="Remove from wishlist"
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 shadow-md backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isRemoving ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-red-500"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">
                        {/* Brand or Category Tag */}
                        {product.brand?.name && (
                          <span className="text-[11px] font-bold text-[#6B21A8] uppercase tracking-wider mb-1">
                            {product.brand.name}
                          </span>
                        )}

                        {/* Product Title */}
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#6B21A8] transition-colors line-clamp-2 mb-2">
                          {product.name}
                        </h4>

                        {/* Price Row */}
                        <div className="flex items-baseline gap-2 mt-auto pt-2">
                          <span className="text-base font-bold text-gray-900">
                            {formatPrice(product.finalPrice)}
                          </span>

                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.basePrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                          <Package size={14} />
                          View Product
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Showing page{" "}
                  <span className="font-semibold text-gray-800">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {pagination.totalPages}
                  </span>{" "}
                  ({pagination.total} total)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border border-gray-200 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    Previous
                  </button>
                  <span className="text-xs font-medium text-gray-600 px-2">
                    {currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= pagination.totalPages || isLoading}
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagination.totalPages, p + 1),
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border border-gray-200 transition-colors cursor-pointer"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
