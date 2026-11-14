import { apiClient } from "./api-client";

export interface WishlistProductImage {
  id: string;
  imageUrl?: string | null;
  displayUrl?: string;
  originalUrl?: string;
  displayOrder?: number;
}

export interface WishlistBrand {
  id: string;
  name: string;
  logo?: string | null;
}

export interface WishlistCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface WishlistProductCategory {
  id?: string;
  category: WishlistCategory;
}

export interface WishlistProduct {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  basePrice: number | string;
  discountPrice?: number | string | null;
  taxPercentage?: number | string;
  finalPrice: number | string;
  stock: number;
  availableStock: number;
  reservedStock?: number;
  rating?: number;
  productSize?: string | null;
  images?: WishlistProductImage[];
  brand?: WishlistBrand | null;
  productCategories?: WishlistProductCategory[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
}

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Fetches all wishlist items for the authenticated user.
 */
export async function getWishlistApi(): Promise<WishlistItem[]> {
  const res = await apiClient<ApiResponse<WishlistItem[]>>("/wishlist", {
    method: "GET",
  });
  return res.data ?? [];
}

/**
 * Adds a product to the user's wishlist.
 */
export async function addToWishlistApi(
  productId: string,
): Promise<{ message: string; item: WishlistItem }> {
  const res = await apiClient<
    ApiResponse<{ message: string; item: WishlistItem }>
  >("/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
  return res.data;
}

/**
 * Removes a product from the user's wishlist.
 */
export async function removeFromWishlistApi(
  productId: string,
): Promise<{ success: boolean; message: string; productId: string }> {
  const res = await apiClient<
    ApiResponse<{ success: boolean; message: string; productId: string }>
  >(`/wishlist/${productId}`, {
    method: "DELETE",
  });
  return res.data;
}

/**
 * Checks if a product is in the user's wishlist.
 */
export async function checkWishlistStatusApi(
  productId: string,
): Promise<{ productId: string; inWishlist: boolean }> {
  const res = await apiClient<
    ApiResponse<{ productId: string; inWishlist: boolean }>
  >(`/wishlist/check/${productId}`, {
    method: "GET",
  });
  return res.data;
}

/**
 * Clears the user's wishlist.
 */
export async function clearWishlistApi(): Promise<{
  success: boolean;
  message: string;
  deletedCount: number;
}> {
  const res = await apiClient<
    ApiResponse<{
      success: boolean;
      message: string;
      deletedCount: number;
    }>
  >("/wishlist", {
    method: "DELETE",
  });
  return res.data;
}
