import { apiClient } from "./api-client";

export type DiscountType = "PERCENTAGE" | "FIXED";
export type CouponStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface CouponItem {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number | string;
  minimumOrderAmount: number | string;
  redemptionLimit?: number | null;
  redeemedCount?: number;
  activeDate: string;
  expiryDate: string;
  status: CouponStatus;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Fetches all available coupons from the database.
 */
export async function getCouponsApi(): Promise<CouponItem[]> {
  const res = await apiClient<ApiResponse<CouponItem[]>>("/coupons", {
    method: "GET",
  });
  return res.data ?? [];
}
