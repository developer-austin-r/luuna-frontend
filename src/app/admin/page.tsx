"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import {
  Breadcrumb,
  Card,
  type Column,
  DataTable,
  StatsCard,
  StatusBadge,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProducts } from "@/redux/slices/admin-slice";
import { apiClient } from "@/services/api-client";
import { type Order, type Product } from "@/types/admin";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const {
    orders,
    customers,
    products,
    coupons,
    activityLogs,
    reportData,
    categories,
  } = useAppSelector((state) => state.admin);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function loadProducts() {
      try {
        const res = await apiClient<{ data: { data: any[] } }>("/products");
        if (res && res.data && Array.isArray(res.data.data)) {
          const mapped: Product[] = res.data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            category:
              p.productCategories?.[0]?.category?.name || "Uncategorized",
            price: Number(p.basePrice),
            salePrice: p.discountPrice ? Number(p.discountPrice) : undefined,
            stock: p.stock,
            status: p.status?.slug || "active",
            image:
              p.images?.[0]?.imageUrl ||
              "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
            description: p.description || "",
          }));
          dispatch(setProducts(mapped));
        }
      } catch (err) {
        console.error("Error loading dashboard products:", err);
      }
    }
    loadProducts();
  }, [dispatch]);

  // Compute stats
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProductsCount = products.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockItems = products.filter((p) => p.stock <= 10).length;

  const recentOrders = orders.slice(0, 5);
  const recentCustomers = customers.slice(0, 4);
  const lowStockProducts = products.filter((p) => p.stock <= 10).slice(0, 4);

  const orderColumns: Column<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (val) => (
        <span className="font-bold text-text-custom font-mono">{val}</span>
      ),
    },
    { key: "customerName", label: "Customer" },
    {
      key: "date",
      label: "Date",
      render: (val) => (
        <span suppressHydrationWarning>
          {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (val) => (
        <span className="font-bold">${Number(val).toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar + Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[]} />
        </div>
      </div>

      {/* Six Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard
          title="Revenue"
          value="₹0"
          change={12.4}
          icon={<IndianRupee className="w-4 h-4" />}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          change={8.2}
          icon={<ShoppingCart className="w-4 h-4" />}
        />
        <StatsCard
          title="Customers"
          value={totalCustomers}
          change={18.5}
          icon={<Users className="w-4 h-4" />}
        />
        <StatsCard
          title="Products"
          value={totalProductsCount}
          change={4.1}
          icon={<Package className="w-4 h-4" />}
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          change={-15.2}
          timeframe="vs last week"
          icon={<ShoppingCart className="w-4 h-4 text-amber-500" />}
        />
        <StatsCard
          title="Low Stock Alert"
          value={lowStockItems}
          change={10.0}
          timeframe="vs last week"
          icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
        />
      </div>

      {/* Interactive Charts Area */}
      <Card title="Sales Overview">
        <div className="h-72 mt-4 relative flex items-end">
          {/* Revenue Chart (Curved Area Chart Mockup via SVG) */}
          <div className="w-full h-full flex flex-col justify-end pt-4">
            <div className="relative flex-1 w-full border-b border-border-custom px-2">
              {/* SVG Curve */}
              <svg
                viewBox="0 0 700 200"
                className="w-full h-full text-primary"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>
                {/* Fill Area */}
                <path
                  d="M 0 200 C 100 120, 200 180, 300 80 C 400 40, 500 130, 600 60 C 650 30, 700 20, 700 20 L 700 200 Z"
                  fill="url(#gradient)"
                />
                {/* Curve Stroke */}
                <path
                  d="M 0 200 C 100 120, 200 180, 300 80 C 400 40, 500 130, 600 60 C 650 30, 700 20, 700 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Hover dots mock */}
              <div className="absolute left-[43%] top-[35%] w-3 h-3 rounded-full bg-white border-3 border-primary shadow-md cursor-pointer group">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-text-custom text-white text-2xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                  Peak Revenue: $2,200 (18th)
                </div>
              </div>
            </div>
            <div className="flex justify-between px-4 text-3xs text-text-custom/50 font-bold uppercase tracking-wider mt-2">
              <span>July 13</span>
              <span>July 15</span>
              <span>July 17</span>
              <span>July 19</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Multicolumn Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Orders Table */}
        <Card
          className="lg:col-span-3"
          title="Latest Transactions"
          extra={
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-0.5"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <DataTable columns={orderColumns} data={recentOrders} />
        </Card>
      </div>

      {/* Stock warnings */}
      <div className="w-full">
        {/* Low Stock Warn panel */}
        <Card
          title="Low Stock Items Warning"
          extra={
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Adjust Stock
            </Link>
          }
        >
          <div className="space-y-4 mt-2">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between border-b border-border-custom/35 last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-lg border border-border-custom shrink-0 bg-bg-secondary"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-custom line-clamp-1">
                        {prod.name}
                      </p>
                      <span className="text-3xs text-text-custom/50 font-bold uppercase tracking-wider font-mono">
                        SKU: {prod.sku}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-3xs font-semibold px-2 py-0.5 rounded-full ${
                      prod.stock === 0
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}
                  >
                    {prod.stock === 0 ? "Out of stock" : `${prod.stock} left`}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-text-custom/50">
                All items are sufficiently stocked.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
