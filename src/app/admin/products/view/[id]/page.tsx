"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Tag } from "lucide-react";

import { appConfig } from "@/config";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  StatusBadge,
} from "@/components/admin";
import { useAppSelector } from "@/redux/hooks";
import { apiClient } from "@/services/api-client";

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const renderDescription = (description: string) => {
    if (!description) return "No description has been supplied for this item.";

    const disclaimerMarker = "Please note:";
    const index = description.indexOf(disclaimerMarker);

    if (index !== -1) {
      const mainText = description.substring(0, index);
      const disclaimerText = description.substring(index);

      return (
        <div className="flex flex-col gap-3">
          <span className="whitespace-pre-wrap">{mainText.trim()}</span>
          <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg text-amber-800 text-xs italic">
            <span className="font-bold not-italic mr-1">
              {disclaimerMarker}
            </span>
            {disclaimerText.replace(disclaimerMarker, "").trim()}
          </div>
        </div>
      );
    }

    return <span className="whitespace-pre-wrap">{description}</span>;
  };

  // Retrieve product from Redux store as initial cache
  const products = useAppSelector((state) => state.admin.products);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Look up in Redux cache first to render instantly
        const cached = products.find((p) => p.id === id);
        if (cached) {
          setProduct(cached);
        }

        // Fetch from API to get fresh details/allow direct refresh
        const res = await apiClient<{ data: any }>(`/products/${id}`);
        const p = res?.data;
        if (p) {
          const mapped = {
            id: p.id,
            name: p.name,
            sku: p.sku,
            barcode: p.barcode,
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
            productSize: p.productSize || null,
          };
          setProduct(mapped);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  if (loading && !product) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/admin/products" },
            { label: "Loading..." },
          ]}
        />
        <Card className="text-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="text-sm font-semibold text-text-custom/60 mt-4">
            Loading product details...
          </p>
        </Card>
      </div>
    );
  }

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

  // Product sales statistics
  const simulatedStats = {
    unitsSold: 0,
    revenue: 0,
    pageViews: 0,
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

      {/* Product Information Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image Card */}
        <div className="space-y-4">
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

          <Card className="flex flex-col items-center justify-center p-4">
            <h4 className="text-xs font-bold text-text-custom uppercase tracking-wider mb-3 self-start">
              Product Barcode
            </h4>
            {product.barcode ? (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="bg-white p-2.5 rounded-lg border border-border-custom flex items-center justify-center w-full min-h-[90px]">
                  <img
                    src={`${appConfig.apiBaseUrl}/products/${product.id}/barcode`}
                    alt={`Barcode for ${product.name}`}
                    className="max-h-[70px] max-w-full object-contain"
                  />
                </div>
                <span className="font-mono text-sm font-bold text-text-custom/75 tracking-widest bg-bg-secondary px-3 py-1 rounded border border-border-custom w-full text-center">
                  {product.barcode}
                </span>
              </div>
            ) : (
              <span className="text-xs text-text-custom/50">No barcode assigned</span>
            )}
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
                      ₹{product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-text-custom/40 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-2xs border border-emerald-100">
                      <Tag className="w-3 h-3" />
                      Save {discountPct}%
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-extrabold text-text-custom">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="space-y-2 text-xs">
                {product.productSize && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-custom">
                      Product Size:
                    </span>
                    <span className="font-semibold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">
                      {product.productSize}
                    </span>
                  </div>
                )}
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
                <div className="text-xs text-text-custom/80 leading-relaxed font-medium">
                  {renderDescription(product.description)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
