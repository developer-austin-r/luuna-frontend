"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Gift,
  RefreshCw,
  Sparkles,
  Tag,
  Ticket,
} from "lucide-react";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import { AccountMenu } from "@/components/profile/AccountMenu/AccountMenu";
import { logoutApi } from "@/services/auth";
import { type CouponItem, getCouponsApi } from "@/services/coupon";

type FilterTab = "ALL" | "ACTIVE" | "EXPIRED";

function formatCurrency(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return "₹0.00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return `₹${(isNaN(num) ? 0 : num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isExpired(expiryDate: string): boolean {
  try {
    return new Date(expiryDate).getTime() < Date.now();
  } catch {
    return false;
  }
}

export default function ProfileCouponsPage() {
  const router = useRouter();

  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getCouponsApi();
      setCoupons(data);
    } catch (err: any) {
      const msg = err?.message || "";
      if (
        msg.includes("401") ||
        msg.toLowerCase().includes("unauthorized") ||
        msg.includes("403")
      ) {
        router.push("/login");
        return;
      }
      setErrorMessage(
        msg || "Unable to load coupons from the server. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // Fallback
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore
    } finally {
      window.location.href = "/";
    }
  };

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const expired = isExpired(c.expiryDate) || c.status === "EXPIRED";
      if (activeTab === "ACTIVE") {
        return c.status === "ACTIVE" && !expired;
      }
      if (activeTab === "EXPIRED") {
        return expired || c.status === "INACTIVE";
      }
      return true;
    });
  }, [coupons, activeTab]);

  const activeCount = useMemo(() => {
    return coupons.filter(
      (c) => c.status === "ACTIVE" && !isExpired(c.expiryDate),
    ).length;
  }, [coupons]);

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-gray-100 mb-6">
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    Coupon Codes
                  </h1>
                  {!isLoading && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#6B21A8]">
                      <Sparkles size={12} />
                      {activeCount} active
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Available discount coupons and promo vouchers you can apply at
                  checkout
                </p>
              </div>

              <button
                type="button"
                onClick={loadCoupons}
                disabled={isLoading}
                title="Refresh coupons"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6B21A8] bg-[#F3E8FF] hover:bg-[#E9D5FF] rounded-xl transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={isLoading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("ALL")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "ALL"
                    ? "bg-[#6B21A8] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Coupons ({coupons.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ACTIVE")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "ACTIVE"
                    ? "bg-[#6B21A8] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("EXPIRED")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "EXPIRED"
                    ? "bg-[#6B21A8] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Expired / Inactive ({coupons.length - activeCount})
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl flex items-center justify-between gap-3 border bg-red-50 border-red-200 text-red-800 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={loadCoupons}
                  className="px-3 py-1 bg-white border border-red-200 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-2xl p-5 bg-gray-50/60 animate-pulse flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 rounded w-16" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-200 rounded-xl w-full mt-2" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredCoupons.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#6B21A8] mb-4 shadow-inner">
                  <Ticket size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No coupons found
                </h3>
                <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
                  {activeTab === "ACTIVE"
                    ? "There are currently no active promo codes available. Stay tuned for upcoming offers!"
                    : "No coupon vouchers matched your selection. Check back soon for exclusive promotions."}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg cursor-pointer"
                >
                  <Gift size={18} />
                  Explore Products
                </Link>
              </div>
            )}

            {/* Coupons List */}
            {!isLoading && filteredCoupons.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
                {filteredCoupons.map((coupon) => {
                  const expired =
                    isExpired(coupon.expiryDate) || coupon.status === "EXPIRED";
                  const isInactive = coupon.status === "INACTIVE";
                  const isUsable = !expired && !isInactive;

                  const isPercentage = coupon.discountType === "PERCENTAGE";
                  const discountDisplay = isPercentage
                    ? `${Number(coupon.discountValue)}% OFF`
                    : `${formatCurrency(coupon.discountValue)} OFF`;

                  const isCopied = copiedCode === coupon.code;
                  const minAmount = Number(coupon.minimumOrderAmount);

                  return (
                    <div
                      key={coupon.id}
                      className={`relative rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between overflow-hidden ${
                        isUsable
                          ? "bg-gradient-to-br from-white via-[#FCF9FF] to-[#FAF5FF] border-[#E9D5FF] shadow-sm hover:shadow-md hover:border-[#D8B4FE]"
                          : "bg-gray-50/70 border-gray-200 opacity-70"
                      }`}
                    >
                      {/* Top Row: Discount Banner & Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isUsable
                                ? "bg-[#F3E8FF] text-[#6B21A8]"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            <Tag size={18} />
                          </div>
                          <div>
                            <div className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight leading-none">
                              {discountDisplay}
                            </div>
                            <span className="text-[11px] font-medium text-gray-500 mt-1 block">
                              {minAmount > 0
                                ? `On orders above ${formatCurrency(minAmount)}`
                                : "No minimum spend required"}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isUsable ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          ) : expired ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {coupon.description && (
                        <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {coupon.description}
                        </p>
                      )}

                      {/* Coupon Code Block & Copy Button */}
                      <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between gap-2 bg-white border border-[#E9D5FF] rounded-xl px-3 py-2 shadow-xs">
                          <div className="flex items-center gap-2 overflow-hidden min-w-0">
                            <Ticket
                              size={15}
                              className={
                                isUsable
                                  ? "text-[#6B21A8] shrink-0"
                                  : "text-gray-400 shrink-0"
                              }
                            />
                            <span className="font-mono font-bold text-xs sm:text-sm tracking-wider text-gray-900 truncate select-all">
                              {coupon.code}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            disabled={!isUsable}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : isUsable
                                  ? "bg-[#6B21A8] hover:bg-[#581c87] text-white"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check size={13} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>

                        {/* Validity Footer */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 gap-2">
                          <span className="inline-flex items-center gap-1 truncate">
                            <Clock size={12} className="shrink-0" />
                            Expires: {formatDate(coupon.expiryDate)}
                          </span>

                          {coupon.redemptionLimit && (
                            <span className="shrink-0">
                              Limit: {coupon.redemptionLimit} uses
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
