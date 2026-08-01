"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Film,
  Image as ImageIcon,
  Save,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Select,
  StatusBadge,
} from "@/components/admin";
import { useToast } from "@/providers/toast-provider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addActivityLog, setCategories } from "@/redux/slices/admin-slice";
import { apiClient } from "@/services/api-client";
import { uploadImage } from "@/services/media-upload";

interface ProductFormValues {
  name: string;
  sku: string;
  categoryIds: string[];
  brandId: string;
  brandName?: string;
  basePrice: number;
  discountPrice?: number | null;
  taxPercentage: number;
  stock: number;
  reservedStock: number;
  alertLevel: number;
  statusId: string;
  description: string;
  slug: string;
  keywords: string;
}

interface StatusOption {
  id: string;
  status: string;
  slug: string;
}

interface ImageUploadItem {
  id: string;
  imageUrl: string;
  displayOrder: number;
  file?: File;
  uploading: boolean;
  progress: number;
}

interface VideoUploadItem {
  id: string;
  videoUrl: string;
  fileSize: number;
  uploading: boolean;
  progress: number;
  base64?: string;
}

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
];

const MOCK_VIDEO =
  "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40409-large.mp4";

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.admin.categories);
  const { error: toastError, success: toastSuccess } = useToast();

  const [statuses, setStatuses] = useState<StatusOption[]>([]);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      sku: "",
      categoryIds:
        categories.length > 0 && categories[0] ? [categories[0].id] : [],
      brandName: "",
      basePrice: 0,
      discountPrice: null,
      taxPercentage: 0,
      stock: 0,
      reservedStock: 0,
      alertLevel: 10,
      statusId: "",
      description: "",
      slug: "",
      keywords: "",
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await apiClient<{ data: any[] }>(
          "/products/categories/all",
        );
        if (catRes && catRes.data) {
          dispatch(setCategories(catRes.data));
        }

        const statusRes = await apiClient<{ data: StatusOption[] }>(
          "/products/statuses/all",
        );
        if (statusRes && statusRes.data) {
          setStatuses(statusRes.data);
          const activeStatus = statusRes.data.find((s) => s.slug === "active");
          if (activeStatus) {
            setTimeout(() => {
              setValue("statusId", activeStatus.id);
            }, 100);
          }
        }
      } catch (err) {
        console.error("Error loading categories or statuses:", err);
      }
    }
    loadData();
  }, [dispatch, setValue]);

  // Upload States
  const [images, setImages] = useState<ImageUploadItem[]>([]);
  const [video, setVideo] = useState<VideoUploadItem | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Watch fields for live preview card
  const watchedName = useWatch({
    control,
    name: "name",
    defaultValue: "New Product Title",
  });
  const watchedBasePrice = useWatch({
    control,
    name: "basePrice",
    defaultValue: 0,
  });
  const watchedDiscountPrice = useWatch({ control, name: "discountPrice" });
  const watchedStatusId = useWatch({
    control,
    name: "statusId",
    defaultValue: "",
  });
  const watchedKeywords = useWatch({
    control,
    name: "keywords",
    defaultValue: "",
  });

  // Generate SEO slug helper
  const handleAutoGenerateSlug = () => {
    const nameVal = watchedName || "";
    const generated = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", generated);
  };

  // Mock Upload Simulator
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    // Enforce maximum of 7 images
    if (images.length + filesArray.length > 7) {
      alert("You can upload a maximum of 7 images.");
      return;
    }

    filesArray.forEach((file, index) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newItem: ImageUploadItem = {
        id,
        imageUrl: "",
        displayOrder: images.length + index,
        file,
        uploading: true,
        progress: 0,
      };

      setImages((prev) => [...prev, newItem]);

      void uploadImage(file)
        .then((imageUrl) => {
          setImages((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, imageUrl, uploading: false, progress: 100 }
                : item,
            ),
          );
        })
        .catch((err: unknown) => {
          setImages((prev) => prev.filter((item) => item.id !== id));
          setApiError(
            err instanceof Error ? err.message : "Failed to upload image.",
          );
        });
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    const id = "video-upload";
    const localUrl = URL.createObjectURL(file);
    const newItem: VideoUploadItem = {
      id,
      videoUrl: localUrl,
      fileSize: file.size,
      uploading: true,
      progress: 0,
    };

    setVideo(newItem);

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setVideo((prev) => (prev ? { ...prev, progress: percent } : null));
      }
    };

    reader.onload = () => {
      const base64String = reader.result as string;
      setVideo({
        id,
        videoUrl: localUrl,
        fileSize: file.size,
        uploading: false,
        progress: 100,
        base64: base64String,
      });
    };

    reader.onerror = () => {
      setApiError("Failed to read the video file.");
      setVideo(null);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (id: string) => {
    setImages((prev) =>
      prev
        .filter((img) => img.id !== id)
        .map((img, i) => ({ ...img, displayOrder: i })),
    );
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const onSubmit = async (data: ProductFormValues) => {
    setApiError(null);
    setSuccessMsg(null);

    // Validation checks
    if (
      data.discountPrice &&
      Number(data.discountPrice) > Number(data.basePrice)
    ) {
      setApiError(
        "Validation Error: Discount price must be less than or equal to base price.",
      );
      return;
    }

    if (Number(data.reservedStock) > Number(data.stock)) {
      setApiError(
        "Validation Error: Reserved stock cannot exceed total stock quantity.",
      );
      return;
    }

    if (images.length === 0) {
      setApiError("Validation Error: Please upload at least 1 product image.");
      return;
    }

    if (images.some((img) => img.uploading) || (video && video.uploading)) {
      setApiError(
        "Validation Error: Please wait for media uploads to complete.",
      );
      return;
    }

    try {
      // Structure single POST request payload
      const cleanedCategoryIds = (
        Array.isArray(data.categoryIds)
          ? data.categoryIds
          : data.categoryIds
            ? [data.categoryIds]
            : []
      ).filter((id) => id && id !== "none");

      const fallbackStatusId =
        data.statusId || statuses.find((s) => s.slug === "active")?.id;
      if (!fallbackStatusId) {
        setApiError("Validation Error: Please select a valid product status.");
        return;
      }

      const payload = {
        name: data.name,
        sku: data.sku,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        shortDescription: data.name,
        description: data.description,
        brandName: data.brandName ? data.brandName.trim() : undefined,
        basePrice: Number(data.basePrice),
        discountPrice: data.discountPrice
          ? Number(data.discountPrice)
          : undefined,
        taxPercentage: Number(data.taxPercentage || 0),
        finalPrice: data.discountPrice
          ? Number(data.discountPrice)
          : Number(data.basePrice),
        stock: Number(data.stock || 0),
        reservedStock: Number(data.reservedStock || 0),
        availableStock:
          Number(data.stock || 0) - Number(data.reservedStock || 0),
        rating: 4.5, // initial rating
        statusId: fallbackStatusId,
        categoryIds: cleanedCategoryIds,
        keywords: data.keywords
          ? data.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
        images: images.map((img) => ({
          imageUrl: img.imageUrl,
          displayOrder: img.displayOrder,
        })),
        videos: video
          ? [
              {
                videoUrl: video.base64 || video.videoUrl,
                fileSize: video.fileSize,
              },
            ]
          : [],
      };

      const result = await apiClient<any>("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const msg = `Product listing "${result?.data?.name || data.name}" launched successfully!`;
      setSuccessMsg(msg);
      toastSuccess(msg);

      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Created new product: ${data.name} (SKU: ${data.sku})`,
          module: "Products",
          status: "success",
        }),
      );

      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (err: any) {
      console.warn(err);
      const errMsg =
        err.message ||
        "An error occurred while creating the product in the NestJS + Prisma backend.";
      setApiError(errMsg);
      toastError(errMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/products")}
          className="p-2 border-border-custom hover:bg-bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <Breadcrumb
            items={[
              { label: "Products", href: "/admin/products" },
              { label: "Add Product" },
            ]}
          />
          <h1 className="text-2xl font-bold text-text-custom mt-1">
            Add Product
          </h1>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{apiError}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-start gap-2 shadow-sm">
          <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card title="Basic Information">
            <div className="space-y-4 mt-2">
              <Input
                label="Product Title"
                {...register("name", { required: "Product title is required" })}
                error={errors.name?.message}
                placeholder="e.g. Silk V-Neck Dress"
              />
              <div>
                <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block mb-1.5">
                  Long Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="w-full px-3 py-2 text-sm border border-border-custom rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Describe material compositions, measurements, styling suggestions..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category Taxonomy"
                  {...register("categoryIds")}
                  multiple
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
                <Input
                  label="Product Brand"
                  {...register("brandName")}
                  placeholder="e.g. Nike, Adidas, Gucci"
                />
              </div>
            </div>
          </Card>

          {/* Pricing & Fees */}
          <Card title="Pricing & Tax rates">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <Input
                label="Regular Retail Price ($)"
                type="number"
                step="0.01"
                {...register("basePrice", {
                  valueAsNumber: true,
                  required: "Retail price is required",
                })}
                error={errors.basePrice?.message}
              />
              <Input
                label="Discount Price ($)"
                type="number"
                step="0.01"
                {...register("discountPrice", { valueAsNumber: true })}
              />
              <Input
                label="Sales Tax Rate (%)"
                type="number"
                {...register("taxPercentage", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Tax percentage must be >= 0" },
                  max: { value: 100, message: "Tax percentage must be <= 100" },
                })}
                error={errors.taxPercentage?.message}
              />
            </div>
          </Card>

          {/* Inventory Limits */}
          <Card title="Inventory Management">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
              <Input
                label="SKU Code"
                {...register("sku", { required: "SKU barcode is required" })}
                error={errors.sku?.message}
                placeholder="CL-SLK-01"
              />
              <Input
                label="Stock Quantity"
                type="number"
                {...register("stock", {
                  valueAsNumber: true,
                  required: "Initial stock is required",
                })}
                error={errors.stock?.message}
              />
              <Input
                label="Reserved Stock"
                type="number"
                {...register("reservedStock", { valueAsNumber: true })}
              />
              <Input
                label="Alert Level Threshold"
                type="number"
                {...register("alertLevel", { valueAsNumber: true })}
              />
            </div>
          </Card>

          {/* Product Media (Images & Video) */}
          <Card title="Product Media Assets">
            <div className="space-y-6 mt-2">
              {/* Image Upload Area */}
              <div>
                <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block mb-2">
                  Images (Upload up to 7, {images.length}/7 uploaded)
                </label>

                <div className="border-2 border-dashed border-border-custom hover:border-primary/50 transition-all rounded-xl p-6 flex flex-col items-center justify-center bg-bg-secondary/50 cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={images.length >= 7}
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <UploadCloud className="w-10 h-10 text-text-custom/30 group-hover:text-primary transition-all mb-2" />
                  <p className="text-sm font-semibold text-text-custom">
                    Click or drag images to upload
                  </p>
                  <p className="text-xs text-text-custom/40 mt-1">
                    Supports PNG, JPG, WEBP formats (Max 7)
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mt-4">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-lg border border-border-custom bg-bg-secondary overflow-hidden group"
                      >
                        {img.uploading ? (
                          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-2 text-center">
                            <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                            <span className="text-3xs font-semibold mt-1.5">
                              {img.progress}%
                            </span>
                          </div>
                        ) : (
                          <>
                            <img
                              src={img.imageUrl}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-3xs px-1 rounded font-mono">
                              #{img.displayOrder + 1}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload Area */}
              <div>
                <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block mb-2">
                  Product Video (Exactly 1 Video)
                </label>

                {!video ? (
                  <div className="border-2 border-dashed border-border-custom hover:border-primary/50 transition-all rounded-xl p-6 flex flex-col items-center justify-center bg-bg-secondary/50 cursor-pointer relative group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-text-custom/30 group-hover:text-primary transition-all mb-2" />
                    <p className="text-sm font-semibold text-text-custom">
                      Click or drag video to upload
                    </p>
                    <p className="text-xs text-text-custom/40 mt-1">
                      Supports MP4, MOV formats (Max 1)
                    </p>
                  </div>
                ) : (
                  <div className="border border-border-custom rounded-lg p-4 bg-bg-secondary/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Film className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-text-custom">
                          Product Video Asset
                        </p>
                        <p className="text-xs text-text-custom/40 font-mono">
                          Size: {(video.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {video.uploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-border-custom h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${video.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold font-mono">
                          {video.progress}%
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="bg-red-50 hover:bg-red-100 text-red-600 rounded-lg p-2 transition-all border border-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Image and Preview Card */}
        <div className="space-y-6">
          {/* Status and Image URL config */}
          <Card title="Publish Settings">
            <div className="space-y-4 mt-2">
              <Select
                label="Listing Status"
                {...register("statusId", { required: "Status is required" })}
                error={errors.statusId?.message}
                options={statuses.map((s) => ({
                  value: s.id,
                  label: s.status,
                }))}
              />
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
                {images.length > 0 && images[0] && !images[0].uploading ? (
                  <img
                    src={images[0].imageUrl}
                    alt={watchedName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-custom/30 gap-2">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-xs font-semibold">
                      No Image Uploaded
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                  <StatusBadge
                    status={
                      statuses.find((s) => s.id === watchedStatusId)?.slug ||
                      "active"
                    }
                  />
                </div>
              </div>

              {/* Video Player in preview if uploaded */}
              {video && !video.uploading && (
                <div className="border-t border-border-custom p-3 bg-bg-secondary/40">
                  <div className="text-3xs uppercase tracking-widest text-text-custom/50 font-bold mb-1.5 flex items-center gap-1">
                    <Film className="w-3 h-3 text-primary" /> Video Asset
                    Preview
                  </div>
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full rounded-lg border border-border-custom aspect-video object-cover"
                  />
                </div>
              )}

              <div className="p-4 space-y-2">
                <span className="text-3xs uppercase tracking-widest text-text-custom/50 font-bold">
                  LUUNA BRAND
                </span>
                <h4 className="text-sm font-bold text-text-custom line-clamp-1 leading-tight">
                  {watchedName}
                </h4>

                <div className="flex items-baseline gap-2 pt-1">
                  {watchedDiscountPrice ? (
                    <>
                      <span className="text-sm font-extrabold text-primary">
                        ${Number(watchedDiscountPrice).toFixed(2)}
                      </span>
                      <span className="text-xs text-text-custom/35 line-through">
                        ${Number(watchedBasePrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-extrabold text-text-custom">
                      ${Number(watchedBasePrice).toFixed(2)}
                    </span>
                  )}
                </div>

                {watchedKeywords && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {watchedKeywords.split(",").map((k, i) => (
                      <span
                        key={i}
                        className="text-3xs bg-bg-secondary px-1.5 py-0.5 rounded text-text-custom/60 font-semibold"
                      >
                        #{k.trim()}
                      </span>
                    ))}
                  </div>
                )}
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
                Launch Item
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
