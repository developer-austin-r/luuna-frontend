import { apiClient } from "@/services/api-client";

import { type ArrivalProduct, ProductCarousel } from "./NewArrivals";

type LandingProduct = {
  id: string;
  name: string;
  shortDescription: string | null;
  basePrice: number;
  finalPrice: number;
  imageUrl: string | null;
};

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function toProductCard(product: LandingProduct): ArrivalProduct {
  const hasDiscount = product.basePrice > product.finalPrice;
  return {
    id: product.id,
    href: `/products/${encodeURIComponent(product.id)}`,
    name: product.name,
    description: product.shortDescription ?? "",
    price: rupees.format(product.finalPrice),
    oldPrice: hasDiscount ? rupees.format(product.basePrice) : undefined,
    discount: hasDiscount
      ? Math.round((1 - product.finalPrice / product.basePrice) * 100)
      : 0,
    image: product.imageUrl ?? undefined,
  };
}

const sections = {
  "new-arrivals": {
    title: "NEW ARRIVALS",
    empty: "No new arrivals yet.",
    unavailable: "New arrivals are temporarily unavailable.",
  },
  accessories: {
    title: "ACCESSORIES",
    empty: "No accessories available yet.",
    unavailable: "Accessories are temporarily unavailable.",
  },
  related: {
    title: "RELATED ITEMS",
    empty: "No related products yet.",
    unavailable: "Related products are temporarily unavailable.",
  },
};

export default async function LandingProductCarousel({
  section,
  productId,
}: {
  section: keyof typeof sections;
  productId?: string;
}) {
  const { title, empty, unavailable } = sections[section];
  let products: ArrivalProduct[] = [];
  let emptyMessage = empty;

  try {
    const apiPath =
      section === "related" && productId
        ? `/products/${encodeURIComponent(productId)}/related`
        : `/products/${section}`;

    const { data } = await apiClient<{ data: LandingProduct[] }>(apiPath, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    products = data.map(toProductCard);
  } catch (error) {
    console.error(`Failed to load ${section}`, error);
    emptyMessage = unavailable;
  }

  if (
    (section === "accessories" || section === "related") &&
    products.length === 0
  ) {
    return null;
  }

  return (
    <ProductCarousel
      id={section}
      title={title}
      products={products}
      emptyMessage={emptyMessage}
    />
  );
}
