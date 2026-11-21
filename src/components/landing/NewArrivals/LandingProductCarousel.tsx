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
};

export default async function LandingProductCarousel({
  section,
}: {
  section: keyof typeof sections;
}) {
  const { title, empty, unavailable } = sections[section];
  let products: ArrivalProduct[] = [];
  let emptyMessage = empty;

  try {
    const { data } = await apiClient<{ data: LandingProduct[] }>(
      `/products/${section}`,
      { cache: "no-store", signal: AbortSignal.timeout(5000) },
    );

    products = data.map((product) => {
      const hasDiscount = product.basePrice > product.finalPrice;
      return {
        id: product.id,
        href:
          section === "new-arrivals"
            ? `/products/${encodeURIComponent(product.id)}`
            : undefined,
        name: product.name,
        description: product.shortDescription ?? "",
        price: rupees.format(product.finalPrice),
        oldPrice: hasDiscount ? rupees.format(product.basePrice) : undefined,
        discount: hasDiscount
          ? Math.round((1 - product.finalPrice / product.basePrice) * 100)
          : 0,
        image: product.imageUrl ?? undefined,
      };
    });
  } catch (error) {
    console.error(`Failed to load landing page ${section}`, error);
    emptyMessage = unavailable;
  }

  if (section === "accessories" && products.length === 0) return null;

  return (
    <ProductCarousel
      id={section}
      title={title}
      products={products}
      emptyMessage={emptyMessage}
    />
  );
}
