import { apiClient } from "./api-client";

export interface ApprovedReview {
  id: string;
  author: string;
  starRate: number;
  title: string | null;
  review: string | null;
  images: string[];
  createdAt: string;
}

export interface ProductReviewPage {
  reviews: ApprovedReview[];
  summary: {
    count: number;
    average: number;
    breakdown: { stars: number; count: number }[];
  };
  page: number;
  totalPages: number;
}

export async function getProductReviews(
  productId: string,
  page: number,
  signal: AbortSignal,
) {
  const response = await apiClient<{ data: ProductReviewPage }>(
    `/user-reviews/product/${encodeURIComponent(productId)}?page=${page}`,
    { signal, cache: "no-store" },
  );
  return response.data;
}

export async function submitProductReview(
  productId: string,
  rating: number,
  fields: FormData,
  photos: File[],
) {
  fields.delete("rating");
  fields.set("productId", productId);
  fields.set("starRate", String(rating));
  for (const photo of photos) fields.append("images", photo);

  await apiClient<{ data: { id: string; status: "PENDING" } }>(
    "/user-reviews",
    {
      method: "POST",
      body: fields,
    },
  );
}
