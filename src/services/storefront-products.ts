import { cache } from "react";

import { env } from "@/config/env";

export interface StorefrontProduct {
  id: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  basePrice: string | number;
  finalPrice: string | number;
  availableStock: number;
  rating: number;
  productSize: string | null;
  brand: { name: string } | null;
  images: {
    displayUrl: string;
    imageUrl: string | null;
    originalUrl: string;
  }[];
}

interface CatalogPage {
  data: StorefrontProduct[];
  meta: { hasPreviousPage: boolean; hasNextPage: boolean };
}

async function fetchProductData<T>(path: string): Promise<T | null> {
  const response = await fetch(`${env.apiBaseUrl.replace(/\/+$/, "")}${path}`, {
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Product API returned ${response.status}`);

  const { data } = (await response.json()) as { data: T };
  return data;
}

const productIdPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export function isProductId(value: string) {
  return productIdPattern.test(value);
}

export const getProductById = cache((id: string) =>
  fetchProductData<StorefrontProduct>(`/products/${encodeURIComponent(id)}`),
);

export function getProductIdBySlug(slug: string) {
  return fetchProductData<{ id: string }>(
    `/products/by-slug/${encodeURIComponent(slug)}`,
  );
}

export async function getProductCatalog(page: number) {
  const catalog = await fetchProductData<CatalogPage>(
    `/products?page=${page}&limit=24`,
  );
  if (!catalog) throw new Error("Product catalog endpoint is unavailable");
  return catalog;
}

export function getProductImages(product: StorefrontProduct) {
  return [
    ...new Set(
      product.images
        .map(
          ({ displayUrl, imageUrl, originalUrl }) =>
            displayUrl || imageUrl || originalUrl,
        )
        .filter(Boolean),
    ),
  ];
}
