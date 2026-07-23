"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Save, Sparkles } from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addActivityLog, updateProduct } from "@/redux/slices/admin-slice";

interface ProductFormValues {
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number | undefined;
  taxRate: number;
  stock: number;
  alertLevel: number;
  status: "active" | "draft" | "out_of_stock";
  image: string;
  description: string;
  metaTitle?: string | undefined;
  metaDescription?: string | undefined;
  slug?: string | undefined;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = params.id as string;

  // Retrieve products & categories
  const products = useAppSelector((state) => state.admin.products);
  const categories = useAppSelector((state) => state.admin.categories);
  const product = products.find((p) => p.id === id);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>();

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        brand: "Luuna Luxury",
        price: product.price,
        salePrice: product.salePrice,
        taxRate: 8,
        stock: product.stock,
        alertLevel: 10,
        status: product.status,
        image: product.image,
        description: product.description || "",
      });
    }
  }, [product, reset]);

  // Watch fields for live preview card
  const watchedName = useWatch({
    control,
    name: "name",
    defaultValue: product?.name || "Product Title",
  });
  const watchedPrice = useWatch({
    control,
    name: "price",
    defaultValue: product?.price || 0,
  });
  const watchedSalePrice = useWatch({
    control,
    name: "salePrice",
    defaultValue: product?.salePrice,
  });
  const watchedImage = useWatch({
    control,
    name: "image",
    defaultValue:
      product?.image ||
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
  });
  const watchedStatus = useWatch({
    control,
    name: "status",
    defaultValue: product?.status || "active",
  });
  const watchedBrand = useWatch({
    control,
    name: "brand",
    defaultValue: "Luuna",
  });

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

  // Generate SEO slug helper
  const handleAutoGenerateSlug = () => {
    const nameVal = watchedName || "";
    const generated = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", generated);
    setValue("metaTitle", `${nameVal} | Luuna Luxury E-Commerce`);
  };

  const onSubmit = (data: ProductFormValues) => {
    // Dispatch edit update
    dispatch(
      updateProduct({
        id: product.id,
        name: data.name,
        sku: data.sku,
        category: data.category,
        price: data.price,
        salePrice: data.salePrice || undefined,
        stock: data.stock,
        status: data.status,
        image: data.image,
        description: data.description,
      }),
    );

    dispatch(
      addActivityLog({
        user: "Admin Alex",
        action: `Modified product listing details: ${data.name}`,
        module: "Products",
        status: "success",
      }),
    );

    alert(`Product listing details for "${data.name}" updated successfully.`);
    router.push("/admin/products");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              { label: `Edit ${product.name}` },
            ]}
          />
          <h1 className="text-2xl font-bold text-text-custom mt-1">
            Edit Product Listing
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card title="Basic Information">
            <div className="space-y-4 mt-2">
              <Input
                label="Product Title"
                {...register("name", { required: "Product title is required" })}
                error={errors.name?.message}
              />
              <div>
                <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block mb-1.5">
                  Long Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="w-full px-3 py-2 text-sm border border-border-custom rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Describe material compositions, measurements, style suggestions..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category Taxonomy"
                  {...register("category")}
                  options={categories.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                />
                <Input label="Brand Name" {...register("brand")} />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card title="Pricing & Tax rates">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <Input
                label="Regular Retail Price ($)"
                type="number"
                step="0.01"
                {...register("price", {
                  valueAsNumber: true,
                  required: "Retail price is required",
                })}
                error={errors.price?.message}
              />
              <Input
                label="Discount Price ($)"
                type="number"
                step="0.01"
                {...register("salePrice", { valueAsNumber: true })}
              />
              <Input
                label="Sales Tax Rate (%)"
                type="number"
                {...register("taxRate", { valueAsNumber: true })}
              />
            </div>
          </Card>

          {/* Inventory */}
          <Card title="Inventory Management">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <Input
                label="SKU Code"
                {...register("sku", { required: "SKU barcode is required" })}
                error={errors.sku?.message}
              />
              <Input
                label="Stock Quantity"
                type="number"
                {...register("stock", {
                  valueAsNumber: true,
                  required: "Stock volume is required",
                })}
                error={errors.stock?.message}
              />
              <Input
                label="Alert Level Threshold"
                type="number"
                {...register("alertLevel", { valueAsNumber: true })}
              />
            </div>
          </Card>

          {/* SEO Details */}
          <Card
            title="SEO Optimization"
            extra={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAutoGenerateSlug}
                className="text-primary text-2xs flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-generate
              </Button>
            }
          >
            <div className="space-y-4 mt-2">
              <Input label="SEO Meta Title" {...register("metaTitle")} />
              <Input label="URL Slug Link" {...register("slug")} />
              <div>
                <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  rows={2}
                  {...register("metaDescription")}
                  className="w-full px-3 py-2 text-sm border border-border-custom rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Preview & Status */}
        <div className="space-y-6">
          <Card title="Publish Settings">
            <div className="space-y-4 mt-2">
              <Select
                label="Listing Status"
                {...register("status")}
                options={[
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft / Archived" },
                  { value: "out_of_stock", label: "Out of Stock" },
                ]}
              />
              <Input label="Image Address URL" {...register("image")} />
            </div>
          </Card>

          {/* Product Preview Card */}
          <div className="sticky top-20">
            <div className="text-xs font-semibold text-text-custom/60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" />
              Live Visual Preview Card
            </div>

            <div className="bg-white rounded-xl border border-border-custom shadow-lg overflow-hidden group">
              <div className="relative aspect-square w-full bg-bg-secondary overflow-hidden">
                <img
                  src={watchedImage}
                  alt={watchedName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80";
                  }}
                />
                <div className="absolute top-3 right-3 z-10">
                  <StatusBadge status={watchedStatus} />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <span className="text-3xs uppercase tracking-widest text-text-custom/50 font-bold">
                  {watchedBrand}
                </span>
                <h4 className="text-sm font-bold text-text-custom line-clamp-1 leading-tight">
                  {watchedName}
                </h4>
                <div className="flex items-baseline gap-2 pt-1">
                  {watchedSalePrice ? (
                    <>
                      <span className="text-sm font-extrabold text-primary">
                        ${Number(watchedSalePrice).toFixed(2)}
                      </span>
                      <span className="text-xs text-text-custom/35 line-through">
                        ${Number(watchedPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-extrabold text-text-custom">
                      ${Number(watchedPrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/products")}
                className="flex-1"
                disabled={isSubmitting}
              >
                Discard
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                className="flex-1"
                isLoading={isSubmitting}
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
