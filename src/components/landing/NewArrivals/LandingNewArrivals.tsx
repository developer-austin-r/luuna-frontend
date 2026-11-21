import { apiClient } from "@/services/api-client";

import { type ArrivalProduct, ProductCarousel } from "./NewArrivals";

type NewArrival = {
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

export default async function LandingNewArrivals() {
  let products: ArrivalProduct[] = [];
  let emptyMessage = "No new arrivals yet.";

  try {
    const { data } = await apiClient<{ data: NewArrival[] }>(
      "/products/new-arrivals",
      { cache: "no-store", signal: AbortSignal.timeout(5000) },
    );

    products = data.map((product) => {
      const hasDiscount = product.basePrice > product.finalPrice;
      return {
        id: product.id,
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
    console.error("Failed to load landing page new arrivals", error);
    emptyMessage = "New arrivals are temporarily unavailable.";
  }

  return (
    <ProductCarousel
      id="new-arrivals"
      title="NEW ARRIVALS"
      products={products}
      emptyMessage={emptyMessage}
    />
  );
}
