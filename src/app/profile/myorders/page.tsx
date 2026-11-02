"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Copy,
  CreditCard,
  Eye,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  PackageSearch,
  PackageX,
  Truck,
  X,
  XCircle,
} from "lucide-react";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import { AccountMenu } from "@/components/profile/AccountMenu/AccountMenu";
import { logoutApi } from "@/services/auth";
import {
  cancelOrderApi,
  getMyOrdersApi,
  type Order,
  type OrderStatus,
} from "@/services/order";

type FilterTab = "ALL" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatPrice(val: number | string | undefined): string {
  if (val === undefined || val === null) return "₹0.00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return `₹${(isNaN(num) ? 0 : num).toFixed(2)}`;
}

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMyOrdersApi();
      setOrders(data);
    } catch (err: any) {
      const msg = err?.message || "";
      if (
        msg.includes("401") ||
        msg.toLowerCase().includes("unauthorized") ||
        msg.includes("403")
      ) {
        router.replace("/login");
        return;
      }
      setError(msg || "Failed to load your orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors
    } finally {
      window.location.href = "/";
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      setIsCancelling(true);
      setCancelError(null);
      const updated = await cancelOrderApi(orderToCancel.id);
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)),
      );
      if (selectedOrder && selectedOrder.id === updated.id) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...updated } : null));
      }
      setOrderToCancel(null);
    } catch (err: any) {
      setCancelError(
        err?.message || "Failed to cancel order. Please try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === "IN_PROGRESS") {
        if (
          order.orderStatus !== "PENDING" &&
          order.orderStatus !== "PROCESSING" &&
          order.orderStatus !== "SHIPPED"
        ) {
          return false;
        }
      } else if (activeTab === "DELIVERED") {
        if (order.orderStatus !== "DELIVERED") return false;
      } else if (activeTab === "CANCELLED") {
        if (
          order.orderStatus !== "CANCELLED" &&
          order.orderStatus !== "REFUNDED"
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      ALL: orders.length,
      IN_PROGRESS: orders.filter((o) =>
        ["PENDING", "PROCESSING", "SHIPPED"].includes(o.orderStatus),
      ).length,
      DELIVERED: orders.filter((o) => o.orderStatus === "DELIVERED").length,
      CANCELLED: orders.filter((o) =>
        ["CANCELLED", "REFUNDED"].includes(o.orderStatus),
      ).length,
    };
  }, [orders]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Truck size={13} className="text-sky-600" />
            Shipped
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={13} className="text-amber-600" />
            Processing
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            <Clock size={13} className="text-violet-600" />
            Order Placed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={13} className="text-rose-600" />
            Cancelled
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <AlertCircle size={13} className="text-gray-600" />
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <LoginOfferBar />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#2a1740] via-[#755494] to-[#E9D5FF] pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-white hover:text-[#E9D5FF] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          {/* Left Sidebar Navigation */}
          <div className="w-full md:w-72 shrink-0">
            <h2 className="text-xl font-bold text-white mb-4 px-1 tracking-tight">
              Manage My Account
            </h2>
            <AccountMenu onLogout={handleLogout} />
          </div>

          {/* Right Main Content area */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full border border-gray-100 min-h-[500px]">
            {/* Header */}
            <div className="pb-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                <Package className="text-[#6B21A8]" size={26} />
                My Orders
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage your order history, delivery details, and
                items.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-gray-100 text-sm scrollbar-none">
              {(
                [
                  { id: "ALL", label: "All Orders", count: tabCounts.ALL },
                  {
                    id: "IN_PROGRESS",
                    label: "In Progress",
                    count: tabCounts.IN_PROGRESS,
                  },
                  {
                    id: "DELIVERED",
                    label: "Delivered",
                    count: tabCounts.DELIVERED,
                  },
                  {
                    id: "CANCELLED",
                    label: "Cancelled",
                    count: tabCounts.CANCELLED,
                  },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-[#6B21A8] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content States */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <Loader2
                  size={36}
                  className="animate-spin text-[#6B21A8] mb-4"
                />
                <p className="text-gray-600 font-medium">
                  Loading your orders...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Please wait while we retrieve your order history.
                </p>
              </div>
            ) : error ? (
              <div className="py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Failed to load orders
                </h3>
                <p className="text-sm text-gray-500 mb-6">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="px-5 py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  Try Again
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="h-16 w-16 rounded-full bg-purple-50 text-[#6B21A8] flex items-center justify-center mb-4">
                  <PackageSearch size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {activeTab === "ALL"
                    ? "No orders found"
                    : `No ${activeTab.toLowerCase().replace("_", " ")} orders`}
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                  You haven&apos;t placed any orders in this section yet.
                  Discover our wonderful collection of toys!
                </p>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-sm font-semibold transition-colors shadow-md"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              /* Orders List */
              <div className="mt-6 flex flex-col gap-6">
                {filteredOrders.map((order) => {
                  const shipment = order.shipment?.[0];
                  const canCancel =
                    order.orderStatus === "PENDING" ||
                    order.orderStatus === "PROCESSING";

                  return (
                    <div
                      key={order.id}
                      className="border border-gray-200 hover:border-purple-200 rounded-2xl p-5 sm:p-6 transition-all bg-white hover:shadow-md flex flex-col gap-4"
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 text-base">
                            #{order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(order.orderNumber, order.id)
                            }
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            title="Copy Order ID"
                          >
                            <Copy size={14} />
                          </button>
                          {copiedId === order.id && (
                            <span className="text-xs text-emerald-600 font-medium">
                              Copied!
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Calendar size={13} className="text-gray-400" />
                            {formatDate(order.orderedAt)}
                          </span>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="divide-y divide-gray-100">
                        {order.orderItems.map((item) => {
                          const product = item.product;
                          const imageObj = product?.images?.[0];
                          const imageSrc =
                            imageObj?.displayUrl ||
                            imageObj?.imageUrl ||
                            imageObj?.originalUrl ||
                            "/images/recommendation-toy.png";

                          return (
                            <div
                              key={item.id}
                              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="h-16 w-16 rounded-xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
                                  <img
                                    src={imageSrc}
                                    alt={product?.name || "Product"}
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/images/recommendation-toy.png";
                                    }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                                    {product?.name || "Product Item"}
                                  </h4>
                                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                    <span>Qty: {item.quantity}</span>
                                    <span>•</span>
                                    <span>
                                      Unit Price: {formatPrice(item.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-sm font-bold text-gray-900">
                                  {formatPrice(item.total)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                          {shipment && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <MapPin
                                size={13}
                                className="text-gray-400 shrink-0"
                              />
                              <span className="truncate max-w-xs">
                                Delivery to: {shipment.city}, {shipment.state}
                              </span>
                            </div>
                          )}
                          {shipment?.trackingNumber && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Truck
                                size={13}
                                className="text-[#6B21A8] shrink-0"
                              />
                              <span>
                                {shipment.courierName || "Courier"}:{" "}
                                <span className="font-semibold text-gray-700">
                                  {shipment.trackingNumber}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block">
                              Total Amount
                            </span>
                            <span className="text-lg font-bold text-[#6B21A8]">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => setOrderToCancel(order)}
                                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#6B21A8] hover:bg-[#581c87] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye size={13} />
                              View Details
                            </button>
                          </div>
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

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {formatDate(selectedOrder.orderedAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm">
              {/* Order Tracking Stepper */}
              {selectedOrder.orderStatus !== "CANCELLED" &&
                selectedOrder.orderStatus !== "REFUNDED" && (
                  <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 sm:p-5">
                    <h4 className="text-xs font-bold text-[#6B21A8] uppercase tracking-wider mb-4">
                      Delivery Status
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
                      {[
                        {
                          label: "Placed",
                          active: true,
                          icon: Package,
                        },
                        {
                          label: "Processing",
                          active: [
                            "PROCESSING",
                            "SHIPPED",
                            "DELIVERED",
                          ].includes(selectedOrder.orderStatus),
                          icon: Clock,
                        },
                        {
                          label: "Shipped",
                          active: ["SHIPPED", "DELIVERED"].includes(
                            selectedOrder.orderStatus,
                          ),
                          icon: Truck,
                        },
                        {
                          label: "Delivered",
                          active: selectedOrder.orderStatus === "DELIVERED",
                          icon: PackageCheck,
                        },
                      ].map((step, idx) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={step.label}
                            className="flex flex-col items-center gap-1.5 relative z-10"
                          >
                            <div
                              className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                step.active
                                  ? "bg-[#6B21A8] text-white shadow-xs"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <span
                              className={`font-semibold ${
                                step.active ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">
                  Items in this order ({selectedOrder.orderItems.length})
                </h4>
                <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                  {selectedOrder.orderItems.map((item) => {
                    const product = item.product;
                    const imageObj = product?.images?.[0];
                    const imageSrc =
                      imageObj?.displayUrl ||
                      imageObj?.imageUrl ||
                      imageObj?.originalUrl ||
                      "/images/recommendation-toy.png";

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={imageSrc}
                            alt={product?.name || "Product"}
                            className="h-12 w-12 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/recommendation-toy.png";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {product?.name || "Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product?.sku && `SKU: ${product.sku} • `}Qty:{" "}
                              {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">
                            {formatPrice(item.total)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping & Payment Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Shipping Details */}
                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#6B21A8]" />
                    Shipping Details
                  </h4>
                  {selectedOrder.shipment?.[0] ? (
                    <div className="text-xs text-gray-600 flex flex-col gap-1 leading-relaxed">
                      <p className="font-medium text-gray-900">
                        {selectedOrder.shipment[0].shippingAddress}
                      </p>
                      <p>
                        {selectedOrder.shipment[0].city},{" "}
                        {selectedOrder.shipment[0].state} -{" "}
                        {selectedOrder.shipment[0].postalCode}
                      </p>
                      <p>{selectedOrder.shipment[0].country}</p>
                      {selectedOrder.shipment[0].phone && (
                        <p className="mt-1">
                          Phone: {selectedOrder.shipment[0].phone}
                        </p>
                      )}
                      {selectedOrder.shipment[0].trackingNumber && (
                        <p className="mt-2 font-semibold text-[#6B21A8]">
                          Courier: {selectedOrder.shipment[0].courierName} (
                          {selectedOrder.shipment[0].trackingNumber})
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Standard home delivery
                    </p>
                  )}
                </div>

                {/* Payment Details */}
                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#6B21A8]" />
                    Payment Information
                  </h4>
                  <div className="text-xs text-gray-600 flex flex-col gap-1 leading-relaxed">
                    <p>
                      Method:{" "}
                      <span className="font-semibold text-gray-900 capitalize">
                        {selectedOrder.paymentMethod.replace(/_/g, " ")}
                      </span>
                    </p>
                    <p>
                      Payment Status:{" "}
                      <span className="font-semibold text-gray-900 capitalize">
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                    {selectedOrder.notes && (
                      <p className="mt-2 text-gray-500 italic">
                        Note: &ldquo;{selectedOrder.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-purple-50/30">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
                  Payment Summary
                </h4>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  {Number(selectedOrder.discount) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  {Number(selectedOrder.tax) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Estimated Tax</span>
                      <span>+{formatPrice(selectedOrder.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges</span>
                    <span>
                      {Number(selectedOrder.shippingCharge) === 0
                        ? "FREE"
                        : formatPrice(selectedOrder.shippingCharge)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-purple-100 flex justify-between font-bold text-gray-900 text-sm">
                    <span>Total Paid</span>
                    <span className="text-[#6B21A8]">
                      {formatPrice(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              {(selectedOrder.orderStatus === "PENDING" ||
                selectedOrder.orderStatus === "PROCESSING") && (
                <button
                  type="button"
                  onClick={() => {
                    const o = selectedOrder;
                    setSelectedOrder(null);
                    setOrderToCancel(o);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="ml-auto px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ORDER CONFIRMATION MODAL */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => !isCancelling && setOrderToCancel(null)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-150 text-center">
            <button
              type="button"
              onClick={() => !isCancelling && setOrderToCancel(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
              <PackageX size={24} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Cancel Order #{orderToCancel.orderNumber}?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            {cancelError && (
              <div className="mt-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {cancelError}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setOrderToCancel(null)}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancelOrder}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isCancelling ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
