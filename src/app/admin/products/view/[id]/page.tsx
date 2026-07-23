"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  Edit,
  Package,
  Tag,
} from "lucide-react";

import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  StatsCard,
  StatusBadge,
} from "@/components/admin";
import { useAppSelector } from "@/redux/hooks";

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Retrieve product
  const products = useAppSelector((state) => state.admin.products);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/admin/products" },
            { label: "Not Found" },
          ]}
        />
        <Card className="text-center py-12">
          <p className="text-sm font-semibold text-text-custom/60">
            Product listing not found.
          </p>
          <Button
            onClick={() => router.push("/admin/products")}
            className="mt-4"
          >
            Back to Catalog
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate discount percentage if sale price exists
  const discountPct = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Simulated product sales statistics
  const simulatedStats = {
    unitsSold: 142,
    revenue: product.salePrice ? product.salePrice * 142 : product.price * 142,
    pageViews: 2450,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/products")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <Breadcrumb
              items={[
                { label: "Products", href: "/admin/products" },
                { label: product.name },
              ]}
            />
            <h1 className="text-2xl font-bold text-text-custom mt-1">
              Product Details
            </h1>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
            className="flex items-center gap-1.5"
          >
            <Edit className="w-4 h-4 text-primary" />
            Edit Listing
          </Button>
          <span className="flex items-center">
            <StatusBadge status={product.status} />
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Units Sold"
          value={simulatedStats.unitsSold}
          icon={<Package className="w-5 h-5" />}
        />
        <StatsCard
          title="Revenue Generated"
          value={`$${simulatedStats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard
          title="Page Visitors"
          value={simulatedStats.pageViews}
          icon={<BarChart3 className="w-5 h-5 text-sky-500" />}
        />
      </div>

      {/* Product Information Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image Card */}
        <div>
          <Card>
            <div className="relative aspect-square rounded-lg overflow-hidden border border-border-custom bg-bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80";
                }}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: details breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Product Summary">
            <div className="space-y-6 mt-2">
              <div className="space-y-1">
                <span className="text-3xs uppercase tracking-widest text-text-custom/50 font-bold block">
                  Luuna Collection
                </span>
                <h2 className="text-xl font-bold text-text-custom leading-tight">
                  {product.name}
                </h2>
                <div className="flex gap-2 mt-1">
                  <Badge variant="primary">{product.category}</Badge>
                  <Badge variant="gray">SKU: {product.sku}</Badge>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-t border-b border-border-custom py-4 flex gap-6 items-baseline">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl font-extrabold text-primary">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-text-custom/40 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-2xs border border-emerald-100">
                      <Tag className="w-3 h-3" />
                      Save {discountPct}%
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-extrabold text-text-custom">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-custom">
                    Available Stock:
                  </span>
                  <span
                    className={`font-semibold ${
                      product.stock === 0
                        ? "text-red-500"
                        : product.stock <= 10
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {product.stock} units
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-custom">
                    Low Stock Threshold alert:
                  </span>
                  <span className="text-text-custom/60">
                    Triggers alert under 10 units
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-text-custom uppercase tracking-wider">
                  Product Description
                </h4>
                <p className="text-xs text-text-custom/80 leading-relaxed font-medium">
                  {product.description ||
                    "No description has been supplied for this item."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
